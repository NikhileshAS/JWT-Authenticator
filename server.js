const express = require("express");
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("DB Connected"))
  .catch(e => console.log(e));
app.get("/", (request, response) => response.send("Hello World !##"));
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on localhost:${port}/`));
