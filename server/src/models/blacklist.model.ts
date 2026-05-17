import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const BlacklistModel = mongoose.model("Blacklist", blacklistSchema);
