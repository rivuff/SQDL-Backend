import express from "express";
import { userLogin,userSignup,updateInfo,getAlluser, get, getByID, deleteUser } from "../../controller/user-controller.js";
import inviteTeacher from "../../invite/sendInvite.js"
import acceptInvite from "../../invite/acceptInvite.js"
import { createSubject, getAllSubject } from "../../controller/subject-controller.js";

const router = express.Router();

//SIGNUP Route
router.post('/user/signup', userSignup);
//LOGIN Route
router.post('/user/login', userLogin);  //user login
router.delete('/user/delete', deleteUser);//delete user
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

export default router
