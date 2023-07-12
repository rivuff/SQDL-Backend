import sessionRepository from "../repository/session-repository.js";
import User from "../model/user.js";
import Session from "../model/session.js";
const sessionRepo = new sessionRepository();

export const createSession = async (req, res) => {
    try {
      const response = await sessionRepo.create({
        title: req.body.title,
        description: req.body.description,
        parentModule: req.body.parentModule,
        conductedBy: req.body.conductedBy,
        enrollmentLimit: req.body.enrollmentLimit,
        activity_order: req.body.activity_order,
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


export const getSessionsByModuleId = async (req, res)=>{
    try {
        const _id = req.body._id
        if (_id == null){
            const session = await sessionRepo.getAll(0, 50)
            return res.status(200).json({
                success: true,
                message: 'Sessions retrieved successfully',
                data: session,
                err: {}
            });

        }
        const session = await sessionRepo.getAllFromModuleId(_id)
        return res.status(200).json({
            success: true,
            message: 'Sessions retrieved successfully',
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


export const editSession = async (req,res)=>{
    //checking submitted fields
    try{
        const _id = req.body._id
        const session = await sessionRepo.get(_id)
        if (session == null){
            return res.status(404).json({
                message: 'Session does not exist',
                data: null,
                success: false,
                err: '404 session not found'
            })
        }
        if (req.body.title != null) {
            session.title = req.body.title
        }
        if (req.body.description != null) {
            session.description = req.body.description
        }
        if (req.body.conductedBy != null) {
            session.conductedBy = req.body.conductedBy
        }
        if (req.body.createdBy != null) {
            session.createdBy = req.body.createdBy
        }
        if (req.body.parentModule != null) {
            session.parentModule = req.body.parentModule
        }
        if (req.body.enrollmentLimit != null) {
            session.enrollmentLimit = req.body.parentModule
        }
        if (req.body.access_request != null) {
            session.access_request = req.body.access_request
        }
        if (req.body.approved_request != null) {
            session.approved_request = req.body.approved_request
        }
        if (req.body.blocked_request != null) {
            session.blocked_request = req.body.blocked_request
        }
        if (req.body.activity_order != null) {
            session.activity_order = req.body.activity_order
        }
        if (req.body.iteration != null) {
            session.iteration = req.body.iteration
        }
        const updatedSession = await session.save()
        return res.status(200).json({
            message: 'Session updated',
            data: updatedSession,
            success: true,
            err: {}
        })
    }
    catch(error){
        return res.status(500).json({
            message: 'Something went wrong with the sessions controller endpoint',
            data: null,
            success: false,
            err: error
        })
    }
}