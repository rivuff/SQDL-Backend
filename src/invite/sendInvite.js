//import TeacherRepository from "../repository/user-repository.js";

import UserRepository from "../repository/user-repository.js";
import sendMail from './nodemailer.js'
import jwt from 'jsonwebtoken'

const userRepo = new UserRepository();

const inviteTeacher = async (req, res) => {
    //checking if user with email exists
    const user = await userRepo.findBy(req.body.email);
    if (user!=null){
        console.log('User exists')
        return res.status(500).json({
            success:false,
            message: 'User with this email already exists',
            data: user,
            err: {}
        })
    }
    //creating teacher account
    const newUser = userRepo.create({
        email: req.body.email,
        name: req.body.name,
        enrollmentNumber: null,
        rollNumber: null,
        password: "",
        status: "invited",//save JWT token data here and send email with jwt 
        type: "teacher"
    })
    newUser.then((response)=>{
        response.then((res)=>{
            console.log(newUser)
        })
    }).catch((error)=>{

    })
}

export default inviteTeacher