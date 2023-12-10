import Topic from "../model/topic.js";

class TopicRespository {
    async create(data) {
        try {
            const response = Topic.create(data);
            return response;
        } catch(error) {
            console.log("Topic repo ", error);
            throw error;
        }
    }

    async getAll(offset, limit) {
        try {
            const topics = Topic.find().skip(offset).limit(limit);
            return topics;
        } catch(error) {
            console.log("Something went wrong while accessing all topics");
            throw error;
        }
    }

    async findById(_id) {
        try {
            const response = await Topic.findOne({ _id: _id });
            return response;
        } catch(error) {
            console.log("Something went wrong in findById of topic");
            throw error;
        }
    }

    async findByTopic(title) {
        try {
            const response = await Topic.findOne({ title });
            console.log(response);
            return response;
        } catch(error) {
            console.log("Something went wrong in respository layer");
            throw error;
        }
    }
    
    async findByModuleId(_id) {
        try {
            const response = await Topic.find({ parentModule: _id});
            return response;
        } catch(error) {
            console.log("Something went wrong in respository layer");
            throw error;
        }
    }

    async delete(title) {
        try {
            const response = await Topic.findOneAndDelete({ title });
            return response;
        } catch(error) {
            console.error(`An error occurred while deleting the Topic: ${error}`);
        }
    }
}

export default TopicRespository;