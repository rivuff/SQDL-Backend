import QuestionRepository from "../repository/question-repository.js";
import Question from "../model/question.js";

const questionRepo = new QuestionRepository();

export const createQuestion = async (req, res) => {
  try {
    const question = await questionRepo.create({
      questionText: req.body.questionText,
      session: req.body.session,
      iterationIndex: req.body.iterationIndex,
      raisedBy: req.body.raisedBy,
      raisedByName: req.body.raisedByName,
      priorityBySelf: req.body.priorityBySelf,
      iteration: req.body.iteration,
      questionTag: req.body.questionTag,
      session: req.body.session,
      counter: 0,
    });

    return res.status(200).json({
      success: true,
      message: "Successfully created new session",
      data: question,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in the controller",
      data: {},
      err: error,
    });
  }
};


export const getAllQuestion = async (req, res) => {
  try {
    const response = questionRepo.getAll({
      offset: req.body.offset,
      limit: req.body.limit,
    });

    return res.status(200).json({
      success: true,
      message: "Successfully got all the question",
      data: response,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in the controller",
      data: {},
      err: error,
    });
  }
};

export const getQuestionUserIterationn = async(req, res)=> {
    try {
        const { userId, sessionIteration } = req.query;
    
        // Get the user's questions based on the provided userId and sessionIteration
        // You can use the Mongoose query to find the questions that match the conditions.
        const questions = await Question.find({
          raisedBy: userId,
          iteration: sessionIteration,
        });
    
        res.status(200).json(questions);
      } catch (error) {
        console.error('Error fetching user questions:', error);
        res.status(500).json({ error: 'Failed to fetch user questions.' });
      }
}

export const getQuestionById = async (req, res) => {
  try{
    const {_id} = req.body;
    console.log("From getQuestionById: ", _id)
    const question = await Question.find({_id: _id});
    res.status(200).json({message: "Question found successfully", data: question});
  } catch(error) {
    res.status(500).json({error: 'Question controller error'})
  }
}


export const getQuestionsByUserId = async (req, res) => {
  try {
    const { userId } = req.query;
    const questions = await Question.find({ raisedBy: userId });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const session = req.body.session;
    const index = req.body.index;
    const questions = await Question.find({
      iterationIndex: index,
      session: session,
    });

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const _id = req.body._id;
    const question = await questionRepo.find(_id)
    if (question === null) {
      return res.status(404).json({
        message: "Question not found",
        data: null,
        success: false,
        err: "404 Question not found"
      })
    }
    if (req.body.questionText != null) {
      question.questionText = req.body.questionText;
    }
    if (req.body.questionTag != null) {
      question.questionTag = req.body.questionTag;
    }
    if (req.body.session != null) {
      question.session = req.body.session;
    }
    if (req.body.iterationIndex != null) {
      question.iterationIndex = req.body.iterationIndex;
    }
    if (req.body.raisedBy != null) {
      question.raisedBy = req.body.raisedBy;
    }
    if (req.body.priorityBySelf != null) {
      question.priorityBySelf = req.body.priorityBySelf;
    }
    if (req.body.priorityByPeer != null) {
      question.priorityByPeer = req.body.priorityByPeer;
    }
    if (req.body.priorityBySystem != null) {
      question.priorityBySystem = req.body.priorityBySystem;
    }
    if (req.body.iteration != null) {
      question.iteration = req.body.iteration;
    }
    if (req.body.pickedBySystem != null) {
      question.pickedBySystem = req.body.pickedBySystem;
    }
    const updatedQuestion = await question.save();
    console.log("updatedQuestion", updatedQuestion);
    return res.status(200).json({
      message: "Question updated",
      data: updatedQuestion,
      success: true,
      err: {},
    });
  } catch(error) {
    console.log("Question error is : ");
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong with the question controller endpoint",
      data: null,
      success: false,
      err: error,
    });
  }
}

export const addPriorityByPeer = async (req, res) => {
  try {
    const { rating, questionId, studentId } = req.body;
    const question = await Question.findById(questionId);
    console.log(question);
    if (!question) {
      return res.status(200).json({ error: "question not found" });
    }

    const priorityByPeer = {
      // _id: prioritizedBy,
      // prioritizedBy: prioritizedBy,
      prioritizedBy: studentId,
      priority: rating,
    };

    question.priorityByPeer.push(priorityByPeer);

    question.save();

    res.status(200).json({ message: "rating added successfully" });
    console.log("ratting added");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Controller error" });
  }
};
