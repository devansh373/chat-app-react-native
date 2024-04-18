const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Message = require("./models/message");
const User = require("./models/user");
const multer = require("multer");

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

const server = app.listen(port, () => {
  console.log("Server running on port ", port);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: { origin: "exp://192.168.1.5:8081" },
});

io.on("connection", (socket) => {
  console.log("Connected to socket io");

  socket.on("setup", (userId) => {
    socket.userId = userId;
    socket.join(userId);
    // console.log(userId);
    socket.emit("connected");
  });

  socket.on("join chat", (room, loggedInUserId) => {
    socket.join(room);
    console.log(loggedInUserId, "joined room ", room);
  });

  socket.on("new message", (newMessageRecieved, recepientId) => {
    // console.log("new message recieved", newMessageRecieved);
    // var chat = newMessageRecieved.chat;
    // if (!chat.users) return console.log("Chat.users not defined");
    // chat.users.forEach((user) => {
    // if (user._id === newMessageRecieved.sender._id) return;
    // console.log("idhar ", newMessageRecieved, recepientId);
    socket.in(recepientId).emit("message recieved", newMessageRecieved);
    // });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.userId);
    socket.leave(socket.userId);
  });
});
// ZPha58OICprtimgM

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

// configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); //specify desired destination folder
  },
  // filename: function (req, file, cb) {
  //   // Generate a unique file name for the uploaded file
  //   const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  //   cb(null, uniqueSuffix + "-" + file.originalname);
  // },
});

// endpoint to post messages and store it in the backend

const upload = multer({ storage: storage });
app.post("/messages", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText, imageUri } =
      req.body;

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: messageType === "image" ? imageUri : null,
    });
    // console.log("imageUri", imageUri);
    // console.log("newMessage", newMessage);
    res.status(200).json(newMessage);
    await newMessage.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
});

// endpoint to fetch msgs btwn 2 users in the chatroom

app.get("/messages/:senderId/:recepientId", async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
});

// endpoint to get user details for the chat header

app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const recepientId = await User.findById(userId);
    res.status(200).json(recepientId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
});

// endpoint to delete the msgs
app.post("/deleteMessages", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Invalid req body" });
    }
    await Message.deleteMany({
      _id: { $in: messages },
    });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
});

app.get("/friend-requests/sent/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("sentFriendRequests", "name email image")
      .lean();

    const sentFriendRequests = user.sentFriendRequests;

    res.json(sentFriendRequests);
  } catch (error) {
    console.log("error", error);

    res.status(500).json({ error: "Internal Server" });
  }
});

app.get("/friends/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const user = User.findById(userId)
      .populate("friends")
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const friendsId = user.friends.map((friend) => friend._id);
        res.status(200).json(friendsId);
      });
  } catch (error) {
    console.log("error", error);

    res.status(500).json({ error: "Internal Server" });
  }
});
