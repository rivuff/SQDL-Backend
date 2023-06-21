import express from "express";
import { userLogin,userSignup,updateInfo,getAlluser, get, getByID } from "../../controller/user-controller.js";
import inviteTeacher from "../../invite/sendInvite.js"
import acceptInvite from "../../invite/acceptInvite.js"

const router = express.Router();

//SIGNUP Route
router.post('/user/signup', userSignup);
//LOGIN Route
router.post('/user/login', userLogin);  //user login

//Data Update ROUTES
router.post('/user/update', updateInfo) // update information


//Data Query ROUTES
router.get('/user/get', get); // get a user
router.get('/user/getall', getAlluser); // for getting all the users
router.post('/user/getID', getByID);

//Registration ROUTES
router.post('/user/signup', userSignup); //student sign up
router.post('/admin/invite', inviteTeacher); //send invite to a teacher
router.post('/teacher/accept/:token', acceptInvite); //send invite to a teacher

export default router
