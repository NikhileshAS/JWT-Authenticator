const express = require("express");
const router = express.Router();

//@route GET api/profile/test
//@desc Tests profile route
//@access Public
router.get("/test", (request, response) =>
  response.json({ msg: "profile works" })
);
module.exports = router;
