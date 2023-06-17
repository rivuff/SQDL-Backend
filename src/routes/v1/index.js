import express from "express";
import { userLogin,userSignup } from "../../controller/user-controller.js";


const router = express.Router();

router.post('/user/signup', userSignup);
router.post('/user/login', userLogin);

export default router