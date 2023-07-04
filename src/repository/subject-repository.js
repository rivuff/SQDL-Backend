import Subject from "../model/subject.js";


class SubjectRepository{
    async create(data){
        try {
            const response = Subject.create(data);
            return response
        } catch (error) {
            console.log("user repo ",error);
            throw error;
        }
    }
    async findByID(_id) {
        try {
            const response = await Subject.findOne({ _id: _id });
            return response;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error
        }
    }

    async getAll(offset, limit){
        try {
            const subjects = Subject.find().skip(offset).limit(limit);
            return subjects;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error
        }
    }

   
}

export default SubjectRepository;