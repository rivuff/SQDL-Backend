import SubjectRepository from "../repository/subject-repository.js"

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

export const getSubjectByID = async (req, res)=>{

    try {
        const _id = req.body._id
        const subject = await subjectRepo.findByID(_id)
        return res.status(200).json({
            success: true,
            message: 'subjects retrieved successfully',
            data: subject,
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

