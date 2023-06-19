import User from "../model/user.js";

class UserRepository{

    async create(data){
        try {
            console.log(data);
            const response = User.create(data);
            console.log(response);
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
    
}

export default UserRepository