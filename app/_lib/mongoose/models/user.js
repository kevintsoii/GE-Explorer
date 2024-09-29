import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bookmarks: {
      type: [String],
      required: true,
    },
  },
  { collection: "users" }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);