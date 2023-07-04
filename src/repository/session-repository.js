import Session from "../model/session.js";

class sessionRepository{
    async create(data){
        try {
            const response = Session.create(data);
            return response
        } catch (error) {
            console.log("session repo ",error);
            throw error;
        }
    }

    async getAll(offset, limit){
        try {
            const session = Session.find().skip(offset).limit(limit);
            return session;
        } catch (error) {
            console.log("Something went wrong in session repository layer");
            throw error
        }
    }

    async get(_id){
        try {
            const session = await Session.findOne({_id:_id})
            console.log(session);
            return session;
        } catch (error) {
            console.log("Something went wrong in session repository layer");
            throw error
        }
    }
}

export default sessionRepository