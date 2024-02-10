import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    questionTag: {
      type: String,
      enum: ["Clarification", "Exploratory"],
      default: "Clarification",
      //required: true
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    iterationIndex: {
      type: Number,
      required: true,
      default: 1,
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    raisedByName: {
      type: String,
      required: true
    },
    priorityBySelf: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      default: 5,
    },
    priorityByPeer: [
      {
        prioritizedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          strictPopulate: false
        },
        priority: {
          type: Number,
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          default: 1,
        },
      },
    ],
    priorityBySystem: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      default: 5,
    },
    iteration: {
      type: Number,
      default: 1,
    },
    counter: {
      type: Number,
      default: 0,
    },
    pickedBySystem: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
