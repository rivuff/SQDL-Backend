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
        status: "invited",
        type: "teacher"
    })
    //generating JWT
    const token = jwt.sign({
        id: newUser._id,
        email: newUser.email
    },'emailVerification')
    //sending Email 
    try{
        sendMail(newUser.name, newUser.email, token)
        return res.status(200).json({
            success: true,
            message: "User invited successfully",
            data: newUser,
            err: {}
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in inviting new user',
            data: {},
            success: false,
            err: error
        })

    }
}

export default inviteTeacher