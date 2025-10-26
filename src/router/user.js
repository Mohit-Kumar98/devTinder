const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionReqest");

const USER_SAFE_DATA = "firstName lastName photoUrl about skills";

//Get all the pending connection request for the loggedIn user.
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    // We can write as a string or array
    // .populate("fromUserId", "firstName lastName photoUrl about skills");
    // .populate("fromUserId", ["firstName", "lastName"]);

    // if (!connectionRequest) {
    //   res.status(404).json({ message: "User does not exist." });
    // }

    res.json({
      message: "Data fetched Successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionReqest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionReqest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.fromUserId;
      }
      return row.fromUserId;
    });
    res.json({
      data: data,
    });
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }
});

module.exports = userRouter;
