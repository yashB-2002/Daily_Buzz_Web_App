const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const user_model = mongoose.model("user_model");
const post_model = mongoose.model("post_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Jwt_secret_token } = require("../mongo");
const requireLogin = require("../middlewares/requireLogin");
const Message = require("../models/Message");
router.get("/", (req, res) => {
  res.send("hello from express");
});
router.post("/createpost", requireLogin, (req, res) => {
  // all this content will run when we call next function in middleware file
  const { description, image } = req.body;
  console.log(image);
  if (!image || !description) {
    return res.status(422).json({ error: "Add all required fields.." });
  }
  // console.log(req.user); // details of  user who creates post
  const new_post = new post_model({
    description,
    image,
    postedBy: req.user,
  });
  new_post
    .save()
    .then((result) => res.json({ post: result }))
    .catch((err) => console.log(err));
});

router.get("/getposts", (req, res) => {
  post_model
    .find()
    .populate("postedBy", "_id name profilepic")
    .populate("comments.postedBy", "_id name")
    .then((d) => res.json(d))
    .catch((err) => res.json(err));
});

router.get("/profileposts", requireLogin, async (req, res) => {
  // console.log(req.user);
  const post = await post_model
    .find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name");
  res.json(post);
});

router.put("/likepost", requireLogin, (req, res) => {
  post_model
    .findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    )
    .populate("postedBy", "_id name profilepic")
    .exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      else res.json(result);
    });
});

router.put("/unlikepost", requireLogin, (req, res) => {
  post_model
    .findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    )
    .populate("postedBy", "_id name profilepic")
    .exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      else res.json(result);
    });
});

router.put("/commentpost", requireLogin, (req, res) => {
  post_model
    .findByIdAndUpdate(
      req.body.postId,
      {
        $push: {
          comments: {
            comment: req.body.text,
            postedBy: req.user._id,
          },
        },
      },
      { new: true }
    )
    .populate("comments.postedBy", "_id name profilepic")
    .exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      else res.json(result);
    });
});
router.post("/signup", (req, res) => {
  const { name, username, email, password } = req.body;
  console.log(req.body);
  if (!name || !email || !username || !password) {
    return res.json({ error: "Please add all fields...." });
  }
  user_model
    .findOne({ $or: [{ email: email }, { username: username }] })
    .then((user) => {
      // if user already exist then show error
      if (user) {
        return res.json({
          error: "User already exist with same credentials...",
        });
      } else {
        bcrypt.hash(password, 8).then(function (new_pswd) {
          const newUser = new user_model({
            name,
            username,
            email,
            password: new_pswd,
          });
          newUser
            .save()
            .then((u) => res.json({ msg: "Details saved successfully..." }))
            .catch((err) => console.log(err));
        });
      }
    });
});
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add necessary details.." });
  }
  user_model.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(422).json({ error: "email not found" });
    }
    console.log(user);
    bcrypt.compare(password, user.password).then((validated) => {
      if (validated) {
        // return res.status(200).json({ msg: "Authenticated successfully.." });
        const token = jwt.sign({ _id: user.id }, Jwt_secret_token);
        const { _id, name, email, username } = user;
        console.log({ token, user: { _id, name, email, username } });
        res.json({ token, user: { _id, name, email, username } });
      } else {
        return res.status(422).json({ error: "Check your password.." });
      }
    });
  });
});

router.delete("/delpost/:postid", requireLogin, (req, res) => {
  post_model
    .findOne({ _id: req.params.postid })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (!post || err) {
        return res.status(402).json({
          error: err,
        });
      }
      // console.log(post.postedBy._id.toString(), req.user._id.toString());
      if (post.postedBy._id.toString() == req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            return res.json({ message: "Deleted your post Successfully.." });
          })
          .catch((err) => {
            console.log("errror");
          });
      }
    });
});

router.get("/user/:id", (req, res) => {
  user_model
    .findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      post_model
        .find({ postedBy: req.params.id })
        .populate("postedBy", "_id")
        .exec((err, posts) => {
          if (err) return res.status(422).json({ error: err });
          return res.status(200).json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User Not Found.." });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  user_model
    .findByIdAndUpdate(req.body.id, {
      $push: { followers: req.user._id },
    })
    .then(() => {
      user_model
        .findByIdAndUpdate(req.user._id, {
          $push: { following: req.body.id },
        })
        .then((d) => res.status(201).json(d));
    })
    .catch((err) => res.status(422).json({ error: err }));
});

// user_model
//   .findByIdAndUpdate(req.body.id, {
//     $push: { followers: req.user._id },
//   })
//   .then(() => {
//     user_model
//       .findByIdAndUpdate(req.user._id, {
//         $push: { following: req.body.id },
//       })
//       .then((d) => res.status(201).json(d));
//   })
//   .catch((err) => res.status(422).json({ error: err }));
// });
router.put("/unfollow", requireLogin, (req, res) => {
  user_model
    .findByIdAndUpdate(req.body.id, {
      $pull: { followers: req.user._id },
    })
    .then(() => {
      user_model
        .findByIdAndUpdate(req.user._id, {
          $pull: { following: req.body.id },
        })
        .then((d) => res.status(201).json(d));
    })
    .catch((err) => res.status(422).json({ error: err }));
});

router.put("/upload", requireLogin, (req, res) => {
  user_model
    .findByIdAndUpdate(
      req.user._id,
      {
        $set: { profilepic: req.body.pic },
      },
      { new: true }
    )
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else res.json(result);
    });
});

router.get("/follwingposts", requireLogin, (req, res) => {
  post_model
    .find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => res.status(200).json(posts))
    .catch((e) => res.status(404).json({ error: e }));
});

router.post("/msg", requireLogin, async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const newmsg = await Message.create({
      users: [from, to],
      sender: from,
      message: message,
    });
    return res.status(200).json(newmsg);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

router.get("/get/msg/:user1Id/:user2Id", requireLogin, async (req, res) => {
  try {
    const from = req.params.user1Id;
    const to = req.params.user2Id;
    const newmsg = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const allmsgs = newmsg.map((msg) => {
      return {
        myself: msg.sender.toString() === from,
        message: msg.message,
      };
    });
    return res.status(201).json(allmsgs);
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

module.exports = router;
