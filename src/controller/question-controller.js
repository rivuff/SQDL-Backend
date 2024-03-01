import QuestionRepository from "../repository/question-repository.js";
import UserRepository from "../repository/user-repository.js";
import Question from "../model/question.js";

const questionRepo = new QuestionRepository();
const userRepo = new UserRepository();

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

export const getQuestionUserIteration = async(req, res)=> {
    try {
        const { userId, sessionIteration } = req.query;
        // console.log(userId, sessionIteration);
    
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
    const question = await Question.find({_id: _id});
    // console.log(question);
    res.status(200).json({message: "Question found successfully", data: question});
  } catch(error) {
    res.status(500).json({error: 'Question controller error'})
  }
}

export const getQuestionByIDs = async (req, res) => {
  try {
    const _ids = req.body._ids;
    const questions = [];
    for (let i = 0; i < _ids.length; i++) {
      const question = await Question.find({_id: _ids[i]}).populate("priorityByPeer.prioritizedBy");
      // console.log(_ids[i])
      questions.push(question);
    }
    return res.status(200).json({
      success: true,
      message: "Questions retrived successfully",
      data: questions,
      err: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong in querying user information",
      data: {},
      success: false,
      err: error,
    });
  }
};


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
    // console.log("updatedQuestion", updatedQuestion);
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
    // console.log(question);
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
    // console.log("ratting added");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Controller error" });
  }
};

export const QuestionCSV = async (req, res) => {
  let questions = [];
  let questioninfo = null;
  let peersData = [];
  try {
    const { _ids } = req.body;
    for (let i = 0; i < _ids.length; i++) {
      const question = await questionRepo.find(_ids[i]);
      questions.push(question);
    }

    for (let question of questions) {
      for (let peer of question.priorityByPeer) {
        const peerData = await userRepo.findByID(peer.prioritizedBy)
        const x = {quesId: question._id, name: peerData.name, priority: peer.priority}
        peersData.push(x)
      }
    }
    // console.log("-----------------------------------")
    // console.log(peersData);
    // console.log("-----------------------------------")

    questioninfo = questions.map(
      (ques) => {
          let names = []
          let priority = []
          const questionPeers = peersData.filter(peer => {
            // console.log(peer.quesId, _id._id)
            if (peer.quesId === ques._id) {
              return peer;
            }
          })
          names = questionPeers.map(ques => ques.name)
          priority = questionPeers.map(ques => ques.priority)
          // console.log("======================================");
          // console.log(questionPeers)
          // console.log(names);
          // console.log(priority);
          // console.log("======================================");
          return [
            ques._id, ques.questionText, ques.questionTag, ques.raisedByName, ques.priorityBySelf, names, priority, 
            ques.iteration
          ]
        }
    )
    // console.log("-----------------------------------")
    // console.log(questioninfo);
    // console.log("-----------------------------------")

    // for (let question of questions) {
    //   for (let peer of question.priorityByPeer) {
    //     const peerData = await userRepo.findByID(peer.prioritizedBy)
        
    //   }
    // }
    // console.log("------------------------------------");
    // console.log(peersData);
    // console.log("------------------------------------");

    // questioninfo = questions.map(ques => {
    //   let peers = [], peerPriorities = []

    //   [ques._id, ques.questionText, ques.questionTag, ques.raisedByName, ques.priorityBySelf]
    // })

    // sessioninfo = [
    //   session._id, 
    //   session.title,
    //   session.description,
    //   session.startDateTime,
    //   session.endDateTime,
    //   session.conductedBy,
    //   session.sessionCode,
    //   questions.length,
    //   questions,
    //   students.length,
    //   students,
    //   session.activity_order
    // ]

    // const fields = [
    //   {id: '_id', title: 'ID'},
    //   {id: 'description', title: 'Description'},
    //   {id: 'startDateTime', title: "Start Data and Time"},
    //   {id: 'endDateTime', title: "End Date and Time"},
    //   {id: 'conductedBy', title: 'Teacher for Session'},
    //   {id: 'sessionCode', title: 'Session Code'},
    //   {id: 'totalQuestions', title: 'Total Questions'},
    //   {id: 'questions', title: 'Question Posed in Session'},
    //   {id: 'totalStudents', title: 'Total Students'},
    //   {id: 'approved_request', title: "Students in Session"},
    //   {id: 'activity_order', title: 'Activity in Session'},
    // ]

    // const csvWriter = createObjectCsvWriter({
    //   path: 'output.csv',
    //   header: fields,
    // });

    // await csvWriter.writeRecords(session);

    // console.log("Write to output.csv successfully!")


    // res.download("output.csv")
    return res.status(200).json({
      message: "Data for CSV retrived successfully",
      data: questioninfo,
      success: true,
      err: false,
    })
    
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while getting Question CSV",
      data: {},
      success: false,
      err: error,
    });
  }
}