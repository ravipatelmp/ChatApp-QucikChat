import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js"
import {io, userSocketMap} from "../server.js"

// Get all users except the logged in user
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        // Count number of messages not seen
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })

        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
};

// Get all messages for selected user
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        })

        await Message.updateMany({senderId: selectedUserId, receiverId: myId},
        {seen: true});

        res.json({success: true, messages})

    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: "Internal server error"});
    }
};

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res)=>{
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({success: true})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
};

// Send message to selected user
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user?._id;
    const receiverId = req.params.id;
    const { text } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // ✅ auth check
    if (!senderId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ✅ id validation
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiver ID",
      });
    }

    if (!text && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Message or image required",
      });
    }

    let imageUrl = null;

    // ✅ upload image
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      
      const uploadResponse = await cloudinary.uploader.upload(base64Image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      newMessage,
    });

  } catch (error) {
    console.log("SEND MESSAGE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};