import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

const PollSchema = new mongoose.Schema({

  pollId: {
    type: String,
    required: true,
    unique: true
  },

  question: {
    type: String,
    required: true
  },

  options: {
    type: [OptionSchema],
    validate: v => v.length >= 2
  },

  voters: [
    {
      deviceId: String,
      ip: String
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.models.Poll ||
       mongoose.model("Poll", PollSchema);
