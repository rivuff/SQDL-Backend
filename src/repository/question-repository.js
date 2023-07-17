import Question from "../model/question.js";

class QuestionRepository{

    async create(data){
        try {
            const response = Question.create(data);
            return response
        } catch (error) {
            console.log("question repo ",error);
            throw error;
        }
    }

    async getAll(offset, limit){
        try {
            const response = Question.find().skip(offset).limit(limit);
            return response;
        } catch (error) {
            console.log("Something went wrong in session repository layer");
            throw error
        }
    }

    async find(_id){
        try {
            const response = Question.findOne({_id : _id})
            return response;
        } catch (error) {
            console.log("Something went wrong in session repository layer");
            throw error
        }
        
    }
}



export default QuestionRepository