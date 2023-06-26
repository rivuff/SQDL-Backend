import User from "../model/user.js";

class UserRepository{

    async create(data){
        try {
            const response = User.create(data);
            return response
        } catch (error) {
            console.log("user repo ",error);
            throw error;
        }
    }

    async findBy(email){
        try {
            const response  = await User.findOne({email});
            return response;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error
        }
    }
   async findByID(_id){
        try {
            const response = await User.findOne({_id:_id});
            return response;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error
        }
    }

    async delete(email){
        try {
            const response = await User.findOneAndDelete({ email });
           
            return response;
        } catch (error) {
            console.error(`An error occurred while deleting the user: ${error}`);
        }
    }

    async findBystudId(studentId){
        try {
            const response  = await User.findOne({studentId: studentId});
            return response;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error
        }
    }

    async getAll(offset, limit){
        try {
            const user = User.find().skip(offset).limit(limit);
            return user;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error
        }
    }
    
}

export default UserRepository