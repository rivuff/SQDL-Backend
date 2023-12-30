import mongoose, { Mongoose } from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    year: {
      type: String,
    },
    semester: {
      type: Number,
    },
    taughtBy: {
      type: String,
    },
    division: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

subjectSchema.pre("save", async function (next) {
  console.log("------------------HELLOOOOO--------------")
  if (!this.subjectId) {
    console.log("From If");
    // Generate the student ID if it doesn't exist
    this.subjectId = await generateUniqueSubjectId();
  }
  next();
});

async function generateUniqueSubjectId() {
  let subjectId;
  const Subject = mongoose.model("Subject"); // Move the Subject model reference here
  do {
    // Generate a potential subject ID
    subjectId = "SUB" + Math.random().toString().substring(2, 5);
    // Check if the subject ID already exists
    const count = await Subject.countDocuments({ subjectId });
    if (count === 0) {
      // Unique subject ID generated
      return subjectId;
    }
  } while (true);
}

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
