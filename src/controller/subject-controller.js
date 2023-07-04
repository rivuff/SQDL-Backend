import SubjectRepository from "../repository/subject-repository.js"
import Subject from "../model/subject.js";
import User from "../model/user.js";

const subjectRepo = new SubjectRepository();


export const createSubject = async(req, res)=> {
    try {
        const response  = await subjectRepo.create({
            name: req.body.name,
            description: req.body.description,
            createdBy: req.body.createdBy
        })

        console.log(response);

        return res.status(200).json({
            success: true,
            message:'Successfully created new user',
            data: response,
            err: {}
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong in controller",
            data: {},
            err: error
        })
    }
}


export const getAllSubject = async (req, res)=>{

    try {
        console.log(req.query);
        const {offset, limit} = req.query;
        console.log(offset, limit);
        const subjects =await subjectRepo.getAll(parseInt(offset), parseInt(limit));
        return res.status(200).json({
            success: true,
            message: 'subjects retrieved successfully',
            data: subjects,
            err: {}
          });
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in in subject controller',
            data: {},
            success: false,
            err: error
        })
    }
   
}


export const addUserSubject = async (req, res)=>{

    const {userId, subjectIds} = req.body;

    try {
        console.log(userId);
        const user = await User.findOne({_id: userId});

        console.log(user);
        if(!user){
            return res.status(200).json({error: "user not found"});
        }


        const subjects = await Subject.find({_id: {$in: subjectIds}});

        user.subjects.push(...subjects);

        await user.save();

        res.status(200).json({ message: 'Subjects added successfully' });
        console.log("subject added");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}


