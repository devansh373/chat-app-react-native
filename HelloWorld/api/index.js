const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

const port = 8000; // || process.env.PORT

mongoose
  .connect(
    "mongodb+srv://devansh373:ZPha58OICprtimgM@cluster0.rfbvras.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connection succesfull"))
  .catch((err) => console.log("Error connecting to mongoDB", err));

app.listen(port, () => {
  console.log("Server running on port ", port);
});
// ZPha58OICprtimgM

const Message = require("./models/message");
const User = require("./models/user");

// register
app.post("/register", (req, res) => {
  const { name, email, password, image } = req.body;
  const newUser = new User({ name, email, password, image });
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User registered successfully" });
    })
    .catch((err) => {
      console.log("Error registering user ", err);
      res.status(500).json({ message: "Error registering user" });
    });
});

// createToken function
const createToken = (userId) => {
  const payload = { userId };
  const token = jwt.sign(payload, "JNADSIASND", { expiresIn: "1h" });
  return token;
};

// login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Please provide both email and password" });
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.password !== password) {
        return res.status(404).json({ message: "Incorrect Password" });
      }
      const token = createToken(user._id);
      res.status(200).json({ token });
      console.log(token);
    })
    .catch((error) => {
      console.log("Error in finding the user ", error);
      res.status(500).json({ message: "Internal server error" });
    });
});

// endpoint to find all users except the one who is currently logged in!
app.get("/users/:userId", (req, res) => {
  const loggedInUserId = req.params.userId;
  User.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      res.status(200).json(users);
      console.log(users);
    })
    .catch((error) => {
      console.log("Error retrieving users", error);
      res.status(500).json({ message: "Error retrieving users" });
      // return;
    });
});

// endpoint to send a request to a user

app.post("/friend-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { freindRequests: currentUserId },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

// endpoint to show all the friend requests of a particular user

app.get("/friend-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("freindRequests", "name email image")
      .lean();
    const freindRequests = user.freindRequests;
    res.status(200).json(freindRequests);
    // console.log(user, freindRequests);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error" });
  }
});

// endpoint to accept friend request
app.post("/friend-request/accept", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    sender.friends.push(recepientId);
    recepient.friends.push(senderId);

    recepient.freindRequests = recepient.freindRequests.filter((request) => {
      request.toString() !== senderId.toString();
    });
    sender.freindRequests = sender.freindRequests.filter((request) => {
      request.toString() !== recepientId.toString();
    });

    await recepient.save();
    await sender.save();

    res.status(200).json({ message: "Request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
});

// endpoint to access all the accepted friends

app.get("/accepted-friends/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate(
    "friends",
    "name email image"
  );
  const acceptedFriends = user.friends;
  res.status(200).json(acceptedFriends);
});
