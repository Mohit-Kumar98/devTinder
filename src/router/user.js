const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionReqest");
const UserModel = require("../models/user");

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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    //saksham is loggedIn user.
    // if saksham have already marked someone intrested or ignored someone that person should not be showned at saksham feed.
    // if someone is saksham connection already saksham will not he her or his profile.
    // if someone rejected saksham then also saksham will not see that person on his feed.
    // saksham will not see himself in his feed.
    //==========================================
    // User should see all the user cards except
    // 0. his own card.
    // 1. his connection.
    // 2. ignored people.
    // 3. already sent the connection request.

    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Find all the connection requests(sent+received)
    const connectionReqest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    //   .populate("fromUserId", "firstName")
    //   .populate("toUserId", "firstName");

    // data structure that do not contain the duplicate value.
    // so what we have done we want all the request id that have sent request to saksham.
    // or to whome saksham have sent the request in this id of saksham will also be included.

    const hideUsersFromFeed = new Set();
    connectionReqest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Db call to find all the user whose id is not present in the hideUsersFromFeed. and also user will not contian his id as well.
    const users = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      data: users,
    });
  } catch (err) {
    res.status(404).send("Error: " + err.message);
  }
});

module.exports = userRouter;
