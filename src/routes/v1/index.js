import express from "express";
import { userLogin,userSignup,updateInfo,getAlluser, get, getByID, deleteUser } from "../../controller/user-controller.js";
import inviteTeacher from "../../invite/sendInvite.js"
import acceptInvite from "../../invite/acceptInvite.js"

import { addUserSubject, createSubject, getAllSubject } from "../../controller/subject-controller.js";

import { addUserSession, createSession, getAllSession, getSession } from "../../controller/session-controller.js";

import {createModule, getModuleById, getModulesBySubjectId} from '../../controller/module-controller.js'

const router = express.Router();

//SIGNUP Route
router.post('/user/signup', userSignup);
//LOGIN Route
router.post('/user/login', userLogin);  //user login
router.post('/user/delete', deleteUser);//delete user
//Data Update ROUTES
router.post('/user/update', updateInfo) // update information


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
router.get('/subject/getAll', getAllSubject)

//Module routes
router.post('/module/create', createModule);
router.post('/module/getAllFromSubjectID', getModulesBySubjectId)
router.post('/module/getID', getModuleById)



router.post('/subject/add', addUserSubject);


//session routes

router.post('/session/create', createSession);
router.get('/session/get', getSession);
router.get('/session/getAll', getAllSession)

router.post('/session/add', addUserSession)

export default router
