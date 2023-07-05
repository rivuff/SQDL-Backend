import sessionRepository from "../repository/session-repository.js";
import User from "../model/user.js";
import Session from "../model/session.js";
const sessionRepo = new sessionRepository();

export const createSession = async (req, res) => {
    try {
      const response = await sessionRepo.create({
        title: req.body.title,
        topic: req.body.topic,
        startTime: req.body.startTime, // Corrected field assignment
        createdBy: req.body.createdBy
      });
  
      console.log(response);
  
      return res.status(200).json({
        success: true,
        message: 'Successfully created new session',
        data: response,
        err: {}
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong in the controller',
        data: {},
        err: error
      });
    }
};


export const getAllSession = async (req, res)=>{

    try {
        console.log(req.query);
        const {offset, limit} = req.query;
        console.log(offset, limit);
        const session =await sessionRepo.getAll(parseInt(offset), parseInt(limit));

        return res.status(200).json({
            success: true,
            message: 'Session retrieved successfully',
            data: session,
            err: {}
        });
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in in Session controller',
            data: {},
            success: false,
            err: error
        })
    }
}


export const getSession = async (req, res)=>{
    try {
        const response = await sessionRepo.get(req.body._id);
        console.log(response);


        return res.status(200).json({
            success: true,
            message: 'Session retrived succcessfully',
            data: response,
            err: {}
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in in Session controller',
            data: {},
            success: false,
            err: error
        })
    }
}


export const addUserSession = async (req, res)=>{

    const {userId, sessionIds} = req.body;

    try {
        console.log(userId);
        const user = await User.findOne({_id: userId});

        console.log(user);
        if(!user){
            return res.status(200).json({error: "user not found"});
        }


        const sessions = await Session.find({_id: {$in: sessionIds}});

        user.sessions.push(...sessions);

        await user.save();

        res.status(200).json({ message: 'sessions added successfully' });
        console.log("sessions added");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}
