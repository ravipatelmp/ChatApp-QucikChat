import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },

    fullName: {
      type: String,
      trim: true,
    },

    password: {                
      type: String,
      required: true,
      minlength: 6,
    },

    profilePic: {
      type: String, // store image URL
      default: "",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;