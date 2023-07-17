import express from "express";
import { userLogin,userSignup,updateInfo,getAlluser, get, getByID, deleteUser, getUserSession, addTeacherToStudent, addQuestionToUser } from "../../controller/user-controller.js";
import inviteTeacher from "../../invite/sendInvite.js"
import acceptInvite from "../../invite/acceptInvite.js"

import { addUserSubject, createSubject, getAllSubject, getSubjectByID } from "../../controller/subject-controller.js";
import { createModule, getModuleById, getModulesBySubjectId , moduleUpdate} from "../../controller/module-controller.js";
import {createSession, getSession, getSessionsByModuleId, addUserSession, editSession} from "../../controller/session-controller.js"
import { addPriorityByPeer, createQuestion } from "../../controller/question-controller.js";

const router = express.Router();

//SIGNUP Route
router.post('/user/signup', userSignup);
//LOGIN Route
router.post('/user/login', userLogin);  //user login
router.post('/user/delete', deleteUser);//delete user
//Data Update ROUTES
router.post('/user/update', updateInfo) // update information
router.get('/user/getSession', getUserSession)
router.post('/user/addTeacher', addTeacherToStudent) //array of teachers allowed that student to enter
router.post('/user/addquestion', addQuestionToUser); //array of question a student asked

//Data Query ROUTES
router.get('/user/get', get); // get a user
router.get('/user/getall', getAlluser); // for getting all the users
router.post('/user/getID', getByID);

//Registration ROUTES
router.post('/user/signup', userSignup); //student sign up
router.post('/admin/invite', inviteTeacher); //send invite to a teacher
router.post('/teacher/accept', acceptInvite); //send invite to a teacher

//Subject routes
router.post('/subject/create', createSubject);
router.get('/subject/getAll', getAllSubject);
router.post('/subject/getByID', getSubjectByID);
router.post('/subject/addUserSubject', addUserSubject)

//Module routes
router.post('/module/create', createModule);
router.post('/module/getAllFromSubjectID', getModulesBySubjectId)
router.post('/module/getID', getModuleById)
router.post('/module/update', moduleUpdate)

//session routes
router.post('/session/create', createSession);
router.post('/session/get', getSession);
router.post('/session/getAllFromModuleID', getSessionsByModuleId)
router.post('/session/add', addUserSession)
router.post('/session/update', editSession)

//Question routes

router.post('/question/create', createQuestion)
router.post('/question/priorityByPeer', addPriorityByPeer)

export default router
