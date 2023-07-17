import SubjectRepository from "../repository/subject-repository.js"
import Subject from "../model/subject.js";
import User from "../model/user.js";

const subjectRepo = new SubjectRepository();


export const createSubject = async(req, res)=> {
    try {
        const subject  = await subjectRepo.create({
            name: req.body.name,
            description: req.body.description,
            createdBy: req.body.createdBy
        })

        console.log(subject);

        return res.status(200).json({
            success: true,
            message:'Successfully created new user',
            data: subject,
            err: {}
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong in controller",
            data: null,
            err: error
        })
    }
}

export const getSubject = async(req, res)=>{
    try {
        const data = await subjectRepo.findByID(req.query.subjectId);

        return res.json({data: data})

    } catch (error) {
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
        res.status(500).json({ error: 'Controller error' });
    }
}


export const getSubjectByID = async(req,res) =>{
    
    try{
        const  _id  = req.body._id
        console.log(_id)
        const subject = await subjectRepo.findByID(_id );
        if (subject == null){
            res.status(500).json({ success:false, message: 'Subject Not Found', err:{}, data:null });
        }
        else{
            
        res.status(200).json({
            success:true,
            data:subject,
            message: 'Subject information fetch',
            err: {}
        })
         }

    }
    catch(error){
        console.error(error); 
        res.status(500).json({ error: 'Contoller error' });
    }
}

export const userSubject = async(req,res)=>{
    try{
        const subject_ids = req.body._id
        const subjects = []
        for (let i =0; i<subject_ids.length; i++){
            subjects.push(await subjectRepo.findByID(subject_ids[i]));
        }
        res.status(200).json({
            success:true,
            data:subjects,
            message: "Subjects fetched successfully",
            err: {}
        })
    }
    catch(error){
    console.log(error)
    res.status(500).json({
        success: false,
        message: 'Something went wrong with the controller layer'
    })

    }
}

export const subjectUpdate = async (req, res) => {
    const subject = await subjectRepo.findByID(req.body._id)
    console.log(req.body._id)
    if (req.body.name != null) {
        subject.name = req.body.name
    }
    if (req.body.description != null) {
        subject.description = req.body.description
    }
    try {
        const newsub = await subject.save()
        return res.status(200).json({
            message: 'Succesfully updated subject',
            data: newsub,
            success: subject,
            err: {}
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Something went wrong in in subject controller',
            data: {},
            success: false,
            err: error
        })
    }

}
