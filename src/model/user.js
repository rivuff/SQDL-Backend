import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Jwt_key } from "../config/serverConfig.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    enrollmentNumber: {
      type: String,
      unique: false,
    },
    rollNumber: {
      type: String,
      required: false, //CHANGED --> used to be true
    },
    year: {
      type: String,
      required: false
    },
    semester: {
      type: String,
      required: false
    },
    division: {
      type: String,
      required: false
    },
    password: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "blocked", "invited"],
      default: "active",
    },
    type: {
      //ADDED
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    requests: {
      type: Array,
      required: false,
    },
    subjects: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
        },
      ],
      default: [],
    },
    sessions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session", // Reference the "Subject" model from the "subject" database
      },
    ],
    currSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
    allowedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.studentId) {
    // Generate the student ID if it doesn't exist
    this.studentId = await generateUniqueStudentId();
  }
  next();
});

async function generateUniqueStudentId() {
  let studentId;
  do {
    // Generate a potential student ID
    studentId = "S" + Math.random().toString().substring(2, 9);
    // Check if the student ID already exists
    const count = await mongoose.model("User").countDocuments({ studentId });
    if (count === 0) {
      // Unique student ID generated
      return studentId;
    }
  } while (true);
}

userSchema.pre("save", function (next) {
  const student = this;

  // Check if the password field is already hashed or if it is the same as the hashed password
  if (!student.isModified("password") || student.password.startsWith("$2b$")) {
    return next();
  }

  const SALT = bcrypt.genSaltSync(9);
  const encryptedPassword = bcrypt.hashSync(student.password, SALT);
  student.password = encryptedPassword;
  next();
});

userSchema.methods.comparePassword = function compare(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.genJWT = function generate() {
  return jwt.sign({ id: this._id, email: this.email }, Jwt_key, {
    expiresIn: "1h",
  });
};

const User = mongoose.model("User", userSchema);

export default User;
