import sessionRepository from "../repository/session-repository.js";
import User from "../model/user.js";
import UserRepository from "../repository/user-repository.js";
import Session from "../model/session.js";
import Subject from "../model/subject.js";
import Question from "../model/question.js";
import QuestionRepository from "../repository/question-repository.js";

import { createObjectCsvWriter } from 'csv-writer';

const sessionRepo = new sessionRepository();
const userRepo = new UserRepository();
const questionRepo = new QuestionRepository();



export const createSession = async (req, res) => {
  try {
    const existingSubject = await Subject.findById(req.body.subject);
    console.log(req);

    if (!existingSubject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    console.log("Hello1");
    const response = await sessionRepo.create({
      title: req.body.title,
      description: req.body.description,
      parentModule: req.body.parentModule,
      parentTopic: req.body.parentTopic,
      startDateTime: req.body.startDateTime,
      conductedBy: req.body.conductedBy,
      enrollmentLimit: req.body.enrollmentLimit,
      sessionCode: req.body.sessionCode,
      activity_order: req.body.activity_order,
      topic: req.body.topic,
      startTime: req.body.startTime, // Corrected field assignment
      endDateTime: null,
      createdBy: req.body.createdBy,
      parentModule: req.body.parentModule,
      subject: req.body.subject,
    });

    console.log(response);


    console.log("Hello 2");
    return res.status(200).json({
      success: true,
      message: "Successfully created new session",
      data: response,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in the controller",
      data: {},
      err: error,
    });
  }
};

export const addCurrsession = async (req, res) => {
  try {
    const { sessionId, userId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { currSession: sessionId },
      { new: true }
    );

    if (!user) {
      console.log("User not found");
    } else {
      console.log("Updated user:", user);
    }

    res.status(200).json({
      message: "successfully added current session",
    });

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in in Session controller",
      data: {},
      success: false,
      err: error,
    });
  }
};

export const getSessionsByModuleId = async (req, res) => {
  try {
    const _id = req.body._id;
    if (_id == null) {
      const session = await sessionRepo.getAll(0, 50);
      return res.status(200).json({
        success: true,
        message: "Sessions retrieved successfully",
        data: session,
        err: {},
      });
    }
    const session = await sessionRepo.getAllFromModuleId(_id);
    return res.status(200).json({
      success: true,
      message: "Sessions retrieved successfully",
      data: session,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in in Session controller",
      data: {},
      success: false,
      err: error,
    });
  }
};

export const getSession = async (req, res) => {
  try {
    const response = await sessionRepo.get(req.body._id);

    return res.status(200).json({
      success: true,
      message: "Session retrived succcessfully",
      data: response,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in in Session controller",
      data: {},
      success: false,
      err: error,
    });
  }
};

export const getSessionByCode = async (req, res) => {
  console.log("---------------fromgetSessionBycode--------------------");
  console.log(req.body);
  console.log("---------------fromgetSessionBycode--------------------");
  try {
    const response = await sessionRepo.getByCode(req.body.sessionCode);

    return res.status(200).json({
      success: true,
      message: "Session retrived succcessfully",
      data: response,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in in Session controller",
      data: {},
      success: false,
      err: error,
    });
  }
};

export const addUserSession = async (req, res) => {
  const { userId, sessionIds } = req.body;

  try {
    const user = await User.findOne({ _id: userId });

    console.log(user);
    if (!user) {
      return res.status(200).json({ error: "user not found" });
    }
    const sessions = await Session.find({ _id: { $in: sessionIds } });
    user.sessions.push(...sessions);
    await user.save();

    res.status(200).json({ message: "sessions added successfully" });
    console.log("sessions added");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const addQuestionToSession = async (req, res) => {
  try {
    const { sessionId, questionId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "session not found" });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: "question not found" });
    }

    session.questions.push(question);

    session.save();

    res.status(200).json({ message: "Question added successfully" });
    console.log("Question added");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Session Controller error" });
  }
};

export const getAllQuestionFromSession = async (req, res) => {
  const sessionId = req.body.sessionId;

  try {
    // Find the session by its _id and populate the questions field with the full question data.
    const session = await Session.findById(sessionId).populate("questions");

    if (!session) {
      // Handle the case where the session with the provided _id does not exist.
      console.log("Session not found");
      return [];
    }

    // Access the full question data from the populated questions field.
    const questions = session.questions;
    res.status(200).json(questions);
    console.log(questions);
  } catch (error) {
    // Handle any errors that might occur during the database query.
    console.error("Error fetching session questions:", error);
    return [];
  }
};

export const deleteAllQuestionFromSession = async (req, res) => {
  const sessionId = req.body.sessionId;

  try {
    const session = await Session.findById(sessionId).deleteMany();

    if (!session) {
      // Handle the case where the session with the provided _id does not exist.
      console.log("Session not found");
      return [];
    }

    res.status(200).json("Question Deleted");
  } catch (error) {
    console.error("Error fetching session questions:", error);
    return [];
  }
};

export const editSession = async (req, res) => {
  //checking submitted fields
  // console.log("Into the session update function")
  try {
    const _id = req.body._id;
    // console.log("Getting session");
    const session = await sessionRepo.get(_id);
    // console.log("Got Session")
    if (session == null) {
      return res.status(404).json({
        message: "Session does not exist",
        data: null,
        success: false,
        err: "404 session not found",
      });
    }
    if (req.body.title != null) {
      session.title = req.body.title;
    }
    if (req.body.description != null) {
      session.description = req.body.description;
    }
    if (req.body.conductedBy != null) {
      session.conductedBy = req.body.conductedBy;
    }
    if (req.body.createdBy != null) {
      session.createdBy = req.body.createdBy;
    }
    if (req.body.parentModule != null) {
      session.parentModule = req.body.parentModule;
    }
    if (req.body.parentTopic != null) {
      session.parentTopic = req.body.parentTopic;
    }
    if (req.body.sessionCode != null) {
      session.sessionCode = req.body.sessionCode;
    }
    if (req.body.enrollmentLimit != null) {
      session.enrollmentLimit = req.body.enrollmentLimit;
    }
    if (req.body.access_request != null) {
      session.access_request = req.body.access_request;
    }
    if (req.body.approved_request != null) {
      session.approved_request = req.body.approved_request;
    }
    if (req.body.blocked_request != null) {
      session.blocked_request = req.body.blocked_request;
    }
    if (req.body.activity_order != null) {
      session.activity_order = req.body.activity_order;
    }
    if (req.body.iteration != null) {
      session.iteration = req.body.iteration;
    }
    if (req.body.rating != null) {
      if (session.rating === undefined) {
        session.rating = [req.body.rating]
      } else {
        session.rating = [...session.rating, req.body.rating];
      }
    }
    if (req.body.endDateTime != null) {
      session.endDateTime = req.body.endDateTime;
    }
    if (req.body.current_activity != null) {
      session.current_activity = req.body.current_activity;
    }
    if (req.body.selected_questions != null) {
      session.selected_questions = req.body.selected_questions;
    }
    // console.log("Server before session update")
    const updatedSession = await session.save();
    // console.log("W00000", updatedSession);
    return res.status(200).json({
      message: "Session updated",
      data: updatedSession,
      success: true,
      err: {},
    });
  } catch (error) {
    console.log("Session error is : ");
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong with the sessions controller endpoint",
      data: null,
      success: false,
      err: error,
    });
  }
};

// Assuming you have access to the User and Question models, and a session ID.

// Function to distribute questions among students for a given session.

// export const distributeQuestions = async(req, res) => {
//   const sessionId = req.body.sessionId;
//   const z = req.body.priority;

//   try {
//     // const session = await Session.findById(sessionId).populate("questions");
//     const session = await Session.findById(sessionId);
//     console.log("Sesssion: " + session);
//     if (!session) {
//       throw new Error("Session not found.");
//     }

//     const students = await User.find({ type: "student" });
//     const sessionStudents = students.filter(stu => {
//       if (session.approved_request.includes(stu._id)) {
//         return stu;
//       }
//     })
//     console.log("Session Students: ", sessionStudents);
//     if (sessionStudents.length === 0) {
//       throw new Error("No students found for the session.");
//     }

//     const totalQuestions = session.questions.length;
//     const totalStudents = session.approved_request.length;
//     let questionsPerStudent = Math.floor(
//       (totalQuestions * z) / (totalStudents),
//     );

//     if (questionsPerStudent > 1) {
//       questionsPerStudent--;
//     }

//     // Prepare the questions array with each question repeated z times.
//     let questionsRepeated = [];
//     for (const question of session.questions) {
//       for (let i = 0; i < z; i++) {
//         questionsRepeated.push(question);
//       }
//     }

//     // Shuffle the questions randomly to ensure fairness in distribution.
//     const shuffledQuestions = questionsRepeated.sort(() => Math.random() - 0.5);

//     let startIndex = 0;
//     var ctr=0;

//     for (const student of sessionStudents) {
//       let numQuestionsToAssign = questionsPerStudent;
//       // const remainingQuestions = (totalQuestions % (totalStudents * z)) - ctr;

//       // If there are remaining questions, distribute them among students starting from the beginning.
//       // if (remainingQuestions > 0) {
//       //   numQuestionsToAssign++;
//       //   ctr++;
//       // }

//       // Distribute the questions to the student, skipping their own questions.
//       const assignedQuestions = shuffledQuestions
//         .slice(startIndex, startIndex + numQuestionsToAssign)
//         .filter(
//           // (question) => question.raisedBy.toString() !== student._id.toString(),
//           (question) => question.raisedBy !== student._id,
//         );

//       // Update the student's questions field.
//       student.questions = assignedQuestions.map((question) => question._id);
//       await student.save();

//       startIndex += numQuestionsToAssign;
//     }

//     // Save the updated session.
//     await session.save();

//     console.log("Questions distributed successfully.");

//     res.status(200).json({
//       message: "Question distributed successfully",
//       studentsupdate: sessionStudents,
//       sessionupdate: session,
//     });
//   } catch (error) {
//     console.error("Error distributing and rating questions:", error.message);
//   }
// }

// export const distributeQuestions = async (req, res) => {
//   const { sessionId, priority:z, iteration } = req.body;
//   console.log("Given Data: ", sessionId, z, iteration);

//   try {
//     const session = await Session.findById(sessionId)
//     await session.populate('questions');
//     console.log("Sesssion: " + session);
//     if (!session) {
//       throw new Error("Session not found.");
//     }

//     const students = await User.find({ type: "student" });
//     // getting the students for a particular session
//     const sessionStudents = students.filter((stu) => {
//       if (session.approved_request.includes(stu._id)) {
//         return stu;
//       }
//     });
//     console.log("Session Students: ", sessionStudents, sessionStudents.length);
//     if (sessionStudents.length === 0) {
//       throw new Error("No students found for the session.");
//     }

//     // total question based on iteration of the session
//     const totalQuestions = session.questions.filter(ques => ques.iteration === session.iteration).length;
//     // only those student are considered who are approved, those student are not considered which has 
//     // requested or blocked
//     const totalStudents = session.approved_request.length;
//     // this value indicated how many question a student can answer
//     // Eg: totalQuestions = 10
//     // totalStudents = 5 and z = 2
//     // therefore each student can answer (10*2)/5 = 4
//     let questionsPerStudent = Math.floor((totalQuestions * z) / totalStudents);
//     let totalQuestionsToAnswer = [...session.questions.filter(ques => ques.iteration === iteration)];
//     // Shuffle the questions randomly to ensure fairness in distribution.
//     const shuffledQuestions = totalQuestionsToAnswer.sort(() => Math.random() - 0.5);

//     console.log("totalQuestions: ", totalQuestions.map((q) => q.questionText));
//     console.log("totalStudents: ", totalStudents.map(s => s.name));
//     console.log("questionsPerStudent: ", questionsPerStudent);
//     console.log(shuffledQuestions);
//     console.log("Total Questions To answer: ", shuffledQuestions.length);

//     for (const student of sessionStudents) {
//       // this variable contains the question that the student will be answering
//       let questionsForStudent = [];
//       console.log(student);
//       // removing those question which are posed by the user himself, which should not be included
//       // this also takes into account the z which ques.counter variable
//       // this will all the possible question student from which some question will be assigned to the student
//       const questionStudentCanAnswer = shuffledQuestions.filter(ques => {
//         if ((ques.raisedBy.toString() !== student._id.toString()) && (ques.counter < z)) {
//           return ques;
//         }
//       })

//       console.log("Student Can answer: ", questionStudentCanAnswer.length);

//       // 1st condition is if number of question for a particular student is less the number of question he can answer
//       if (questionsForStudent.length < questionsPerStudent) {
//         // each question for the question student can answer is check with 2 parameters
//         // 1. the question is assigned less than z times
//         // 2. question is not already pushed in the question for student list
//         questionStudentCanAnswer.map(ques => {
//           if ((ques.counter < z) && (questionsForStudent.indexOf(ques) == -1)) {
//             ques.counter += 1;
//             questionsForStudent.push(ques)
//           }
//         })
//       }
      
//       // if still the student does not have the desiganated amount of question then we do not consider the z paramerter
//       // and assign question random but ensuring ques is not repeated
//       while (questionsForStudent.length < questionsPerStudent) {
//         const question = questionStudentCanAnswer[Math.floor(Math.random() * questionStudentCanAnswer.length)];
//         console.log("============================================")
//         console.log(questionStudentCanAnswer);
//         console.log(questionsForStudent);
//         console.log(question)
//         console.log("============================================")
//         if (questionsForStudent.indexOf(question) == -1) {
//           question.counter += 1;
//           questionsForStudent.push(question);
//         }
//       }
//       console.log(`Number Question Assigned for Student ${student.name} are: `, questionsForStudent.length);
//       console.log(`------------------Question Assigned to ${student.name} are:- --------------------` )
//       questionsForStudent.map((ques) => console.log(`Question: ${ques.questionText} ${ques.counter}`))
//       console.log("----------------------------------------------------------------------")

//       student.questions = questionsForStudent.map(ques => ques._id)
//       await student.save();
//     }

//     await session.save();

//     console.log("Questions distributed successfully.");

//     res.status(200).json({
//       message: "Question distributed successfully",
//       studentUpdate: sessionStudents,
//       sessionupdate: session,
//     });

//   } catch (error) {
//     console.error("Error distributing and rating questions:", error);
//   }
// };

export const distributeQuestions = async(req, res) => {
  const { sessionId, priority:z, iteration } = req.body;
  console.log(`Given Data: ${sessionId}, ${z}, ${iteration}`);

  try {
    // Getting the appropriate Session
    const session = await Session.findById(sessionId);
    await session.populate('questions');
    console.log("Session: ", session.title);
    if (!session) {
      throw new Error("Session not found");
    }

    // Gettin the student for a particular Session
    const students = await User.find({type: "student"});
    const sessionStudents = students.filter((stu) => {
      if (session.approved_request.includes(stu._id)) {
        return stu;
      }
    })
    if (sessionStudents.length === 0) {
      throw new Error("No Students found for the session");
    } else {
      console.log("Session students: ", sessionStudents.map(s => s.name));
    }

    // Pre required Data
    const totalQuestions = session.questions.filter(ques => ques.iteration === session.iteration);
    // // Only those students are considered who are in the approved list
    const totalStudents = session.approved_request.length;
    const questionsPerStudent = Math.floor((totalQuestions.length * z) / totalStudents)
    const shuffledQuestions = totalQuestions.sort(() => Math.random() - 0.5);

    // console.log(`Total Question: ${totalQuestions.length}`);
    // console.log(`Total Students: ${totalStudents}`);
    // console.log(`Question Per Student: ${questionsPerStudent}`);

    for (const student of sessionStudents) {
      console.log(`=======================${student.name}=======================`)
      // All the question which the student has not posed
      const studentQuestions = []
      const questionToAnswer = shuffledQuestions.filter((ques) => {
        console.log(`Question raised by: ${ques.raisedBy}`)
        if (ques.raisedBy.toString() !== student._id.toString()) {
          return ques;
        }
      })
      console.log(`${student.name} can answer: ${questionToAnswer.length} questions`)
      if (questionToAnswer.length > questionsPerStudent) {
        for (let i = 0; i < questionToAnswer.length; i++) {
          if (studentQuestions.length === questionsPerStudent) {
            break;
          }
          if ((questionToAnswer[i].counter < z) && (studentQuestions.indexOf(questionToAnswer[i]) == -1)) {
            studentQuestions.push(questionToAnswer[i]);
            questionToAnswer[i].counter += 1;
          }
        }
        if (studentQuestions.length < questionsPerStudent) {
          for (let i = 0; i < questionToAnswer.length; i++) {
            if (studentQuestions.length === questionsPerStudent) {
              break;
            }
            if (studentQuestions.indexOf(questionToAnswer[i]) == -1) {
              studentQuestions.push(questionToAnswer[i]);
              questionToAnswer[i].counter += 1;
            }
          }
        }
      } else if (questionToAnswer.length <= questionsPerStudent) {
        questionToAnswer.map((ques) => {
          ques.counter += 1;
          studentQuestions.push(ques)
        })
      }

      console.log(`Question Assigned to ${student.name}: ${studentQuestions.length}`)

      student.questions = studentQuestions.map(ques => ques._id);
      await student.save();
      console.log(`=======================${student.name}=======================`)
    }

    const temp = [];
    const questionNotAssigned = [];
    console.log(`Total Questions are: ${totalQuestions}`)
    for (const student of sessionStudents) {
      console.log(`${student.name} has ${student.questions} questions`);
      temp.push(...student.questions);
    }
    console.log(`Temp Questions are: ${temp}`);
    for (const question of totalQuestions) {
      if (temp.indexOf(question._id) == -1) {
        questionNotAssigned.push(question);
      }
    }
    // if (questionNotAssigned.length > 0) {
      console.log("Question that are not Assigned are: ", questionNotAssigned);
      console.log(`Extra Question will be assigned to ${sessionStudents[0].name}`);
      const x = temp.map(ques => ques._id)
      const y = [...sessionStudents[0].questions, ...questionNotAssigned]
      console.log(`Question before adding the remaing: ${sessionStudents[0].questions.length}`)
      sessionStudents[0].questions = y
      console.log(`Question afters adding the remaing: ${sessionStudents[0].questions.length}`)
      
      // await sessionStudents[0].save();
    // }

    await session.save();

    console.log("Question Distributed Successfully");

    res.status(200).json({
            message: "Question distributed successfully",
            studentUpdate: sessionStudents,
            sessionupdate: session,
          });

  } catch (error) {
    console.log(error);
  }
}

export const sessionCSV = async (req, res) => {
  let students = [];
  let questions = [];
  let sessioninfo = null;
  try {
    const { _id } = req.body;
    const session = await sessionRepo.get(_id);
    console.log(session)

    for (let i = 0; i < session.approved_request.length; i++) {
      const user = await userRepo.findByID(session.approved_request[i]);
      students.push(user.name);
    }
    console.log(students);
    console.log(session.questions.length)

    for (let i = 0; i < session.questions.length; i++) {
      const question = await questionRepo.find(session.questions[i]);
      questions.push(question.questionText);
    }
    console.log(questions);

    sessioninfo = [
      session._id, 
      session.title,
      session.description,
      session.startDateTime,
      session.endDateTime,
      session.conductedBy,
      session.sessionCode,
      questions.length,
      questions,
      students.length,
      students,
      session.activity_order
    ]

    // const fields = [
    //   {id: '_id', title: 'ID'},
    //   {id: 'description', title: 'Description'},
    //   {id: 'startDateTime', title: "Start Data and Time"},
    //   {id: 'endDateTime', title: "End Date and Time"},
    //   {id: 'conductedBy', title: 'Teacher for Session'},
    //   {id: 'sessionCode', title: 'Session Code'},
    //   {id: 'totalQuestions', title: 'Total Questions'},
    //   {id: 'questions', title: 'Question Posed in Session'},
    //   {id: 'totalStudents', title: 'Total Students'},
    //   {id: 'approved_request', title: "Students in Session"},
    //   {id: 'activity_order', title: 'Activity in Session'},
    // ]

    // const csvWriter = createObjectCsvWriter({
    //   path: 'output.csv',
    //   header: fields,
    // });

    // await csvWriter.writeRecords(session);

    // console.log("Write to output.csv successfully!")


    // res.download("output.csv")
    return res.status(200).json({
      message: "Data for CSV retrived successfully",
      data: sessioninfo,
      success: true,
      err: false,
    })
    
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while getting session CSV",
      data: {},
      success: false,
      err: error,
    });
  }
}