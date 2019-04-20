const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const tokenKey = require("../../config/keys").tokenKey;
const User = require("../../models/User"); //Load User model

const router = express.Router();

//@route GET api/users/test
//@desc Tests user route
//@access Public
router.get("/test", (request, response) =>
  response.json({ msg: "users works" })
);

//@route GET api/users/register
//@desc Register user
//@access Public
router.post("/register", (request, response) => {
  User.findOne({ email: request.body.email }).then(user => {
    if (user) {
      return response.status(400).json({ email: "Email already taken" });
    } else {
      const avatar = gravatar.url(request.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: request.body.name,
        email: request.body.email,
        avatar,
        password: request.body.password
      });

      bcrypt.genSalt(10, (error, salt) => {
        bcrypt.hash(newUser.password, salt, (error, hash) => {
          if (error) throw error;
          newUser.password = hash;
          newUser
            .save()
            .then(user => response.json(user))
            .catch(error => console.log(error));
        });
      });
    }
  });
});

//@route GET api/users/login
//@desc Login user
//@access Public

router.post("/login", (request, response) => {
  const { email, password } = request.body;
  User.findOne({ email }).then(user => {
    if (!user) {
      return response.status(404).json({ email: "User not found" });
    }
    const tokenPayload = { id: user.id, name: user.name, avatar: user.avatar };
    jwt.sign(tokenPayload, tokenKey, { expiresIn: 3600 }, (error, token) => {
      response.json({ success: true, token: "Bearer " + token });
    });
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        response.json({ msg: "success" });
      } else {
        return response.status(400).json({ password: "password incorrect" });
      }
    });
  });
});

//@route GET api/users/current
//@desc Return current user
//@access Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    response.json(request.user);
  }
);
module.exports = router;
