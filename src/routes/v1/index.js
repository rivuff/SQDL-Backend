import express from "express";
import { userLogin,userSignup } from "../../controller/user-controller.js";
import inviteTeacher from "../../invite/sendInvite.js"
import acceptInvite from "../../invite/acceptInvite.js"

const router = express.Router();

router.post('/user/signup', userSignup); //student sign up
router.post('/user/login', userLogin);  //user login
router.post('/admin/invite', inviteTeacher); //send invite to a teacher
router.post('/teacher/accept/:token', acceptInvite); //send invite to a teacher

export default router