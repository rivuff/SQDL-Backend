//import TeacherRepository from "../repository/user-repository.js";

import UserRepository from "../repository/user-repository.js";
import sendMail from './nodemailer.js'
import jwt from 'jsonwebtoken'


const inviteTeacher = async (req, res) => {
    let token = req.params.token
    try {
        //creating teacher account
        const response = await userRepo.create({
            email: req.body.email,
            name: req.body.name,
            enrollmentNumber: "",
            rollNumber: "",
            password: "",
            status: "invited",//save JWT token data here and send email with jwt 
            type: "teacher"
        });
        //generate JWT token here
        let token = jwt.sign(
            {
                email: response.email, //token contains email id of pending user, can 
            }, 'emailVerification', {expiresIn: '24h'}
        )
        sendMail(response.email, response.name, token)
        return res.status(200).json({
            success: true,
            message: 'Successfully invited new teacher',
            data: response,
            err: {}
        })

    }
    catch (error) {
        res.send(error)
    }
}

export default inviteTeacher