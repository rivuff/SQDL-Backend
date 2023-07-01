//import TeacherRepository from "../repository/user-repository.js

import UserRepository from "../repository/user-repository.js";
import sendMail from './nodemailer.js'
import jwt from 'jsonwebtoken'
const userRepo = new UserRepository();

const inviteTeacher = async (req, res) => {
    //checking if user with email exists
    console.log(req.body.email)
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
    console.log(req.body.email, req.body.name)
    userRepo.create({
        email: req.body.email,
        name: req.body.name,
        enrollmentNumber: null,
        rollNumber: null,
        password: "",
        status: "invited",
        type: "teacher"
    }).then((response)=>{
        console.log(response)
        const token = jwt.sign({
            id: response._id,
            email: response.email
        }, 'emailVerification', {expiresIn: '48h'})
        //sending Email 
        sendMail(response.name, response.email, token)
        return res.status(200).json({
            success: true,
            message: "User invited successfully",
            data: response,
            err: {}
        });
        })
        .catch((error)=>{
                    console.log(error);
                    const user = userRepo.findBy(req.body.email);
                    if (user != null) {
                        const response = userRepo.delete(req.body.email);
                    }
                    return res.status(500).json({
                        message: 'Something went wrong in inviting new user',
                        data: {},
                        success: false,
                        err: error
                    })
            })

    //generating JWT
    
}

export default inviteTeacher