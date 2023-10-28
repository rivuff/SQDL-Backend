//import TeacherRepository from "../repository/user-repository.js";
import { set } from "mongoose";
import UserRepository from "../repository/user-repository.js";
import Session from "../model/session.js";
import User from "../model/user.js";
import Question from "../model/question.js";

const userRepo = new UserRepository();

export const userSignup = async (req, res) => {
  try {
    const response = await userRepo.create({
      email: req.body.email,
      name: req.body.name,
      enrollmentNumber: req.body.enrollment,
      rollNumber: req.body.rollNumber,
      password: req.body.password,
      year: req.body.year,
      semester: req.body.semester,
      status: "active",
      type: req.body.type, //all accounts are student if through signup page
    });
    return res.status(200).json({
      success: true,
      message: "Successfully created new user",
      data: response,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Account with this email already exists",
      data: {},
      err: error,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    let user = null;
    console.log(req.body.email, req.body.password);
    if (req.body.email != null) {
      user = await userRepo.findBy(req.body.email);
    } else {
      user = await userRepo.findBystudId(req.body.studentId);
    }
    console.log(user.comparePassword(req.body.password));
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    } else if (!user.comparePassword(req.body.password)) {
      return res.status(401).json({
        success: false,
        message: "incorrect password",
      });
    }
    console.log(user);
    const token = user.genJWT();

    return res.status(200).json({
      success: true,
      message: "Successfully logged in",
      data: user,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in auth layer",
      data: {},
      success: false,
      err: error,
    });
  }
};

export const updateInfo = async (req, res) => {
  //update user data
  try {
    const user = await userRepo.findByID(req.body._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.body.name != null) {
      user.name = req.body.name;
      // console.log(user.name);
    }
    if (req.body.email != null) {
      user.email = req.body.email;
      // console.log(user.email);
    }
    if (req.body.enrollmentNumber != null) {
      user.enrollmentNumber = req.body.enrollmentNumber;
      // console.log(user.enrollmentNumber);
    }
    if (req.body.rollNumber != null) {
      user.rollNumber = req.body.rollNumber;
      // console.log(user.rollNumber);
    }
    if (req.body.status != null) {
      user.status = req.body.status;
      // console.log(user.status);
    }
    if (req.body.type != null) {
      user.type = req.body.type;
      // console.log(user.type);
    }
    if (req.body.subjects != null) {
      user.subjects = req.body.subjects;
      // console.log(user.status);
    }
    if (req.body.sessions != null) {
      user.sessions = req.body.sessions;
      // console.log(user.type);
    }
    if (req.body.allowedBy != null) {
      user.allowedBy = req.body.allowedBy;
      // console.log(user.enrollmentNumber);
    }
    const updateUser = await user.save();
    console.log("updated");
    return res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updateUser,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in auth layer",
      data: {},
      success: false,
      err: error,
    });
  }
};

export const handleRequest = async (req, res) => {
  console.log(req.body)
  const request = req.body.request
  try {
    const user = await userRepo.findByID(request._id);
    if (!user) {
      return res.status(401).json({
        message: "Teacher not found",
        success: false
      })
    }
    if (request.type === 'send') {
      user.requests.push(request);
      await user.save();
      return res.status(200).json({message: "request send successfully", data: user});
    } else if (request.type === 'accept') {
      let newReqs
      if (request.from === 'admin') {
        newReqs = user.requests.filter(req => {
          return req.subjectid !== request.subjectid;
        })
      } else if (request.from === 'student') {
        newReqs = user.requests.filter(req => {
          return req.subjectInfo._id === request.subjectInfo._id;
        })
      }
      user.requests = newReqs;
      await user.save();
      return res.status(200).json({message: "request accepted", data: user})
    }
    
    console.log("request sent");
    return res.status(400).json({message: "type parameter missing", success: false});
  } catch(error) {
    console.log(error);
    return res.status(404).json({message: "Some error occured while request transaction", data: error})
  }
}

export const deleteUser = async (req, res) => {
  console.log(req.body.email);
  try {
    const email = req.body.email;
    console.log(email);
    const response = await userRepo.delete(email);

    if (response) {
      console.log("User successfully deleted");
      return res.json({
        message: "User successfully deleted",
        success: true,
      });
    } else {
      console.log("User not found");
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in the controller layer",
      data: {},
      success: false,
      err: error,
    });
  }
};

export const associateTeacher = async (req, res) => {
  const { _id, subjectId } = req.body;

  try {
    const user = await User.findOne({ _id: _id});
    console.log(user);

    if (!user) {
      return res.status(200).json({error: "user not found"});
    }

    user.taughtBy = subjectId;
    
    await user.save()

    return res.status(200).json({ message: "Teacher Associated Successfully", data: user})
      
  } catch(error) {
    res.status(500).json({ error: "Associate Teacher Error"})
  }
}

export const get = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await userRepo.findBy(email);

    return res.status(200).json({
      success: true,
      message: "User retrived successfully",
      data: user,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in editing user information",
      data: {},
      success: false,
      err: error,
    });
  }
};

export const getByID = async (req, res) => {
  try {
    const { _id } = req.body;
    
    const user = await userRepo.findByID(_id);
    console.log("--------------------------------------");
    console.log("Type of id: " + typeof(_id));
    console.log(user);
    console.log("--------------------------------------");
    return res.status(200).json({
      success: true,
      message: "User retrived successfully",
      data: user,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in querying user information",
      data: {},
      success: false,
      err: error,
    });
  }
};

export const getByIDs = async (req, res) => {
  try {
    const _ids = req.body._ids;
    const users = [];
    for (let i = 0; i < _ids.length; i++) {
      const user = await userRepo.findByID(_ids[i]);
      // console.log(_ids[i])
      users.push(user);
    }
    return res.status(200).json({
      success: true,
      message: "Users retrived successfully",
      data: users,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in querying user information",
      data: {},
      success: false,
      err: error,
    });
  }
};

export const getAlluser = async (req, res) => {
  try {
    console.log(req.query);
    const { offset, limit } = req.query;
    console.log(offset, limit);
    const users = await userRepo.getAll(parseInt(offset), parseInt(limit));
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in editing user information",
      data: {},
      success: false,
      err: error,
    });
  }
};

export const getUserSession = async (req, res) => {
  const userId = req.query.userId;

  try {
    const user = await User.findById(userId).populate("sessions");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const sessionIds = user.sessions.map((session) => session._id);

    const sessions = await Session.find({ _id: { $in: sessionIds } });

    return res.json({ sessions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addTeacherToStudent = async (req, res) => {
  const { studentId, teacherIds } = req.body;

  try {
    console.log(studentId);
    const user = await User.findOne({ _id: studentId });

    console.log(user);
    if (!user) {
      return res.status(200).json({ error: "user not found" });
    }

    const teachers = await User.find({ _id: { $in: teacherIds } });

    user.allowedBy.push(...teachers);

    await user.save();

    res.status(200).json({ message: "Teachers added successfully" });
    console.log("Teachers added");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Controller error" });
  }
};

export const addQuestionToUser = async (req, res) => {
  try {
    const { questionId, studentId } = req.body;

    const user = await User.findOne({ _id: studentId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    user.questions.push(question);
    await user.save();

    res.status(200).json({ message: "Question added successfully" });
    console.log("Question added to user");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Controller error" });
  }
};
