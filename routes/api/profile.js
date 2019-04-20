const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

const router = express.Router();

//@route GET api/profile/test
//@desc Tests profile route
//@access Public
router.get("/test", (request, response) =>
  response.json({ msg: "profile works" })
);

//@route GET api/profile/
//@desc Current users profile
//@access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const errors = {};
    Profile.findOne({ user: request.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "Profile not found";
          return response.status(404).json(errors);
        }
        response.json(profile);
      })
      .catch(error => response.status(404).json(error));
  }
);
//@route POST api/profile/
//@desc Create/Update user profile
//@access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (request, response) => {
    const profileFields = {};
    profileFields.user = request.user.id;
    if (request.body.handle) profileFields.handle = request.body.handle;
    if (request.body.company) profileFields.company = request.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields }, //The giant object
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

module.exports = router;
