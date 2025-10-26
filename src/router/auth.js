const express = require("express");
const UserModel = require("../models/user");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");

// Register a new user to our app.
authRouter.post("/signup", async (req, res) => {
  // Validation of data
  validateSignUpData(req);
  const { firstName, lastName, emailId, password } = req.body;
  // Encrypt the data

  const passwordHash = await bcrypt.hash(password, 10);

  // We are creating new instance of the User model. and we are passing the data to that instance.
  const user = new UserModel({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });
  try {
    await user.save();
    res.send("User Created Successfully");
  } catch (err) {
    res.status(400).send("Update Failed");
  }
});

// Login User using this.
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await UserModel.findOne({
      emailId: emailId,
    });

    if (!user) {
      throw new Error("Invalid Credentials");
    } else {
      const checkPassword = user.validatePassword(password);

      if (!checkPassword) {
        throw new Error("Invalid Credentials");
      } else {
        // Create a JWT tocken.
        const token = await user.getJWT();

        // Add the token to cookie and send the response back to the user.
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
          httpOnly: true,
        });
        res.send("User Found");
      }
    }
  } catch (err) {
    res.status(400).send("Error:  " + err.messge);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.send("User has been Logout");
});

module.exports = authRouter;
