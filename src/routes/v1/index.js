import express from "express";
import {
  associateTeacher,
  userLogin,
  userSignup,
  updateInfo,
  getAlluser,
  get,
  getByID,
  deleteUser,
  getUserSession,
  addTeacherToStudent,
  addQuestionToUser,
  getByIDs,
  handleRequest
} from "../../controller/user-controller.js";
import inviteTeacher from "../../invite/sendInvite.js";
import acceptInvite from "../../invite/acceptInvite.js";


//import { userSignup,updateInfo,getAlluser, get, getByID, deleteUser, getUserSession, addTeacherToStudent, addQuestionToUser, getByIDs } from "../../controller/user-controller.js";
//import inviteTeacher from "../../invite/sendInvite.js"
//import acceptInvite from "../../invite/acceptInvite.js"

//import { addUserSubject, createSubject, getAllSubject, getSubjectByID } from "../../controller/subject-controller.js";
//import { createModule, getModuleById, getModulesBySubjectId , moduleUpdate} from "../../controller/module-controller.js";
//import {createSession, getSession, getSessionsByModuleId, addUserSession, editSession, addQuestionToSession, getAllQuestionFromSession, addCurrsession, deleteAllQuestionFromSession} from "../../controller/session-controller.js"
//import { addPriorityByPeer, createQuestion, getQuestionUserIterationn, getQuestionsByUserId } from "../../controller/question-controller.js";
// import { userLogin,userSignup,updateInfo,getAlluser, get, getByID, deleteUser, getUserSession, addTeacherToStudent, addQuestionToUser, getByIDs } from "../../controller/user-controller.js";
// import inviteTeacher from "../../invite/sendInvite.js"
// import acceptInvite from "../../invite/acceptInvite.js"

// import { addUserSubject, createSubject, getAllSubject, getSubjectByID } from "../../controller/subject-controller.js";
// import { createModule, getModuleById, getModulesBySubjectId , moduleUpdate} from "../../controller/module-controller.js";
// import {createSession, getSession, getSessionsByModuleId, addUserSession, editSession, addQuestionToSession, getAllQuestionFromSession, addCurrsession, deleteAllQuestionFromSession} from "../../controller/session-controller.js"
// import { addPriorityByPeer, createQuestion, getQuestionUserIterationn, getQuestionsByUserId } from "../../controller/question-controller.js";


import {
  addUserSubject,
  createSubject,
  getAllSubject,
  getSubjectBySem,
  getSubjectByID,
  subjectUpdate,
} from "../../controller/subject-controller.js";
import {
  createModule,
  getModuleById,
  getModulesBySubjectId,
  moduleUpdate,
} from "../../controller/module-controller.js";
import {
  createTopic,
  getAllTopic,
  findTopicById,
  findTopic,
  getTopicByModuleId,
  updateTopic,
  deleteTopic
} from "../../controller/topic-controller.js";
import {
  createSession,
  getSession,
  getSessionsByModuleId,
  addUserSession,
  editSession,
  getSessionByCode,
  addQuestionToSession,
  getAllQuestionFromSession,
  addCurrsession,
  deleteAllQuestionFromSession,
  distributeQuestions,
} from "../../controller/session-controller.js";
import {
  addPriorityByPeer,
  createQuestion,
  getQuestionsByUserId,
  getQuestions,

  getQuestionUserIterationn,
  getQuestionById,
  updateQuestion

} from "../../controller/question-controller.js";

const router = express.Router();

//SIGNUP Route
router.post("/user/signup", userSignup);
//LOGIN Route
router.post("/user/login", userLogin); //user login
router.post("/user/delete", deleteUser); //delete user
router.post("/user/addcurrsession", addCurrsession); // adding current session

//Data Update ROUTES
router.post("/user/update", updateInfo); // update information
router.get("/user/getSession", getUserSession);
router.post("/user/addTeacher", addTeacherToStudent); //array of teachers allowed that student to enter
router.post("/user/addquestion", addQuestionToUser); //array of question a student asked //array of question a student asked

//Data Query ROUTES
router.get("/user/get", get); // get a user
router.get("/user/getall", getAlluser); // for getting all the users
router.post("/user/getID", getByID);
router.post("/user/getIDs", getByIDs);

// Request Transactions
router.post("/user/request", handleRequest);

//Registration ROUTES
router.post("/user/signup", userSignup); //student sign up
router.post("/admin/invite", inviteTeacher); //send invite to a teacher
router.post("/teacher/accept", acceptInvite); //send invite to a teacher

//Subject routes
router.post("/subject/create", createSubject);
router.get("/subject/getAll", getAllSubject);
router.post("/subject/getByID", getSubjectByID);
router.post("/subject/getBySem", getSubjectBySem);
router.post("/subject/addUserSubject", addUserSubject);
router.post("/subject/update", subjectUpdate);

//Module routes
router.post("/module/create", createModule);    
router.post("/module/getAllFromSubjectID", getModulesBySubjectId);
router.post("/module/getID", getModuleById);
router.post("/module/update", moduleUpdate);

// Topic routes
router.post("/topic/create", createTopic);
router.get("/topic/getAll", getAllTopic);
router.post("/topic/getById", findTopicById);
router.post("/topic/findByTopic", findTopic);
router.post("/topic/getByModuleId", getTopicByModuleId);
router.post("/topic/update", updateTopic);
router.post("/topic/delete", deleteTopic);

//session routes
router.post("/session/create", createSession);
router.post("/session/get", getSession);
router.post("/session/getByCode", getSessionByCode);
router.post("/session/getAllFromModuleID", getSessionsByModuleId);
router.post("/session/add", addUserSession);
router.post("/session/update", editSession);
router.post("/session/addQuestion", addQuestionToSession);
router.get("/session/getsessionquestion", getAllQuestionFromSession);
router.post("/session/distributedQuestions", distributeQuestions);
router.get("/session/questios/delete", deleteAllQuestionFromSession);



//Question routes
router.post("/question/create", createQuestion);
router.post("/question/priorityByPeer", addPriorityByPeer);
router.post("/question/get", getQuestions);
router.post("/question/getById", getQuestionById);
router.get("/question/usrId", getQuestionsByUserId);
router.post("/question/update", updateQuestion);
router.post('/question/create', createQuestion)
router.post('/question/priorityByPeer', addPriorityByPeer)
router.get('/question/usrId', getQuestionsByUserId);
// router.get('/question/usrId', getQuestionsByUserId);

export default router;
