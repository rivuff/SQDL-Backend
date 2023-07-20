import sessionRepository from "../repository/session-repository.js";
import User from "../model/user.js";
import Session from "../model/session.js";
import Subject from "../model/subject.js";
import Question from "../model/question.js";
const sessionRepo = new sessionRepository();


export const createSession = async (req, res) => {
    try {

        const existingSubject = await Subject.findById(req.body.subject);

        if (!existingSubject) {
          return res.status(404).json({ error: 'Subject not found' });
        }


      const response = await sessionRepo.create({
        title: req.body.title,
        description: req.body.description,
        parentModule: req.body.parentModule,
        conductedBy: req.body.conductedBy,
        enrollmentLimit: req.body.enrollmentLimit,
        activity_order: req.body.activity_order,
        topic: req.body.topic,
        startTime: req.body.startTime, // Corrected field assignment
        createdBy: req.body.createdBy,
        parentModule: req.body.parentModule,
        subject: req.body.subject
      });
  


  
      return res.status(200).json({
        success: true,
        message: 'Successfully created new session',
        data: response,
        err: {}
      });
    } 
    catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong in the controller',
        data: {},
        err: error
      });
    }
};


export const addCurrsession = async(req, res)=>{
    try {
        
        const {sessionId, userId} = req.body
        const user = await User.findByIdAndUpdate(userId, { currSession: sessionId }, { new: true });

        if (!user) {
        console.log('User not found');
        } else {
        console.log('Updated user:', user);
        }
        
        res.status(200).json({
            message: "successfully added current session"
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


export const addQuestionToSession = async(req, res)=>{
    
    try {
        const {sessionId, questionId} = req.query;

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(200).json({ error: "session not found" });
        }

        const question = await Question.findById(questionId);

        if (!session) {
            return res.status(200).json({ error: "question not found" });
        }

        session.questions.push(question);
        
        session.save();

        res.status(200).json({ message: "Question added successfully" });
        console.log("Question added");

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Controller error' });
    }
}

export const getAllQuestionFromSession = async(req, res)=>{
    const sessionId = req.body.sessionId;

    try {
        // Find the session by its _id and populate the questions field with the full question data.
        const session = await Session.findById(sessionId).populate('questions');
    
        if (!session) {
          // Handle the case where the session with the provided _id does not exist.
          console.log('Session not found');
          return [];
        }
    
        // Access the full question data from the populated questions field.
        const questions = session.questions;
        res.status(200).json(questions);
        console.log(questions);
      } catch (error) {
        // Handle any errors that might occur during the database query.
        console.error('Error fetching session questions:', error);
        return [];
    }
}


export const editSession = async (req,res)=>{
    //checking submitted fields
    console.log(req.body)
    try{
        const _id = req.body._id
        const session = await sessionRepo.get(_id)
        console.log(session)
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
        console.log('W00000',updatedSession)
        return res.status(200).json({
            message: 'Session updated',
            data: updatedSession,
            success: true,
            err: {}
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            message: 'Something went wrong with the sessions controller endpoint',
            data: null,
            success: false,
            err: error
        })
    }
}


