import QuestionRepository from "../repository/question-repository.js";
import Question from "../model/question.js";

const questionRepo = new QuestionRepository();

export const createQuestion = async(req, res)=>{
    try {

        const question = await questionRepo.create({
            questionText: req.body.questionText,
            session: req.body.session,
            iterationIndex: req.body.iterationIndex,
            raisedBy: req.body.raisedBy,
            priorityBySelf: req.body.priorityBySelf,
    
        })

        return res.status(200).json({
            success: true,
            message: 'Successfully created new session',
            data: question,
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
}



export const getAllQuestion = async(req, res)=>{
    try {
        const response = questionRepo.getAll({
            offset : req.body.offset,
            limit : req.body.limit
        })

        return res.status(200).json({
            success: true,
            message:"Successfully got all the question",
            data: response,
            err: {}
        })

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong in the controller',
            data: {},
            err: error
        });

    }
}


export const getQuestionsByUserId = async (req, res) => {
    try {

      const { userId } = req.query;
      const questions = await Question.find({ raisedBy: userId });
      res.status(200).json(questions);

    } catch (error) {

      res.status(500).json({ error: 'Internal server error' });

    }
};
  

export const addPriorityByPeer = async(req, res)=>{
    try {

        const {rating, questionId} = req.body;
        const question = await Question.findById(questionId);
        console.log(question);
        if(!question){
            return res.status(200).json({ error: "question not found" });
        }

        const priorityByPeer = {
            // _id: prioritizedBy,
            // prioritizedBy: prioritizedBy,
            priority: rating,
          };
      
        question.priorityByPeer.push(priorityByPeer);

        question.save();

        res.status(200).json({ message: "rating added successfully" });
        console.log("ratting added");

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Controller error' });

    }
}