import express from "express";
import { userLogin,userSignup,updateInfo,getAlluser, get } from "../../controller/user-controller.js";
import inviteTeacher from "../../invite/sendInvite.js"
import acceptInvite from "../../invite/acceptInvite.js"

const router = express.Router();

router.post('/user/signup', userSignup); //student sign up
router.post('/user/login', userLogin);  //user login
router.get('/user/getall', getAlluser); // for getting all the users
router.post('/user/update', updateInfo) // update information
router.post('/admin/invite', inviteTeacher); //send invite to a teacher
router.post('/teacher/accept/:token', acceptInvite); //send invite to a teacher
router.get('/user/get', get); // get a user

export default router