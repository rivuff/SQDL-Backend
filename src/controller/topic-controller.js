import TopicRespository from "../repository/topic-repository.js";

const topicRepo = new TopicRespository();

export const createTopic = async (req, res) => {
    try {
        const topic = await topicRepo.create({
            title: req.body.title,
            description: req.body.description,
            createdBy: req.body.createdBy,
            parentModule: req.body.parentModule,
            sessions: req.body.sessions
        });

        console.log(topic);

        return res.status(200).json({
            success: true,
            message: "Topic Created Successfully",
            data: topic,
            err: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong while creating the topic",
            data: null,
            err: error,
        });
    }
}

export const getAllTopic = async (req, res) => {
    try {
        console.log(req.query);
        const { offset, limit } = req.query;
        console.log(offset, limit);

        const topics = await topicRepo.getAll(
            parseInt(offset), parseInt(limit)
        );

        return res.status(200).json({
            success: true,
            message: "All subjects retrieved successfully",
            data: topics,
            err: {},
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Somthing went wrong while retrieving subjects",
            data: {},
            success: false,
            err: error,
        });
    }
};

export const findTopicById = async (req, res) => {
    try {
        const _id = req.body._id;

        const topic = await topicRepo.findById(_id);

        return res.status(200).json({
            success: true,
            message: "Topic by ID retrived successfully",
            data: topic,
            err: {}
        })
    } catch(error) {
        console.log(error)
        return res.status(500).json({
            message: "Not able to retrive topic",
            data: {},
            success: false,
            err: error
        })
    }
}

export const findTopic = async (req, res) => {
    console.log(req.body);
    try {
        const title = req.body.title;

        const topic = await topicRepo.findByTopic(title);

        return res.status(200).json({
            success: true,
            message: "Topic retrived successfully",
            data: topic,
            err: {}
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Not able to retrive topic",
            data: {},
            success: false,
            err: error
        });
    }
};

export const updateTopic = async (req, res) => {
    console.log(req.body);
    const topic = await topicRepo.findById(req.body._id);

    if (req.body.title != null)
        topic.title = req.body.title;
    if (req.body.description != null)
        topic.description = req.body.description;
    if (req.body.createdBy != null)
        topic.createdBy = req.body.createdBy;
    if (req.body.parentModule != null)
        topic.parentModule = req.body.parentModule;
    // req.body.sessions.map((ele) => {
    //     topic.sessions.push(ele);
    // })

    console.log(topic);

    try {
        topic.sessions.push(req.body.session)
        const newTopic = await topic.save();
        return res.status(200).json({
            message: "Update done",
            data: newTopic,
            success: topic,
            err: {}
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Update fail",
            data: {},
            success: false,
            err: error,
        })
    }
}

export const getTopicByModuleId = async(req, res) => {
    console.log("--------------------------------")
    console.log(req.body);
    try {
        const _id = req.body.parentModule;

        const response = await topicRepo.findByModuleId(_id);
        return res.status(200).json({
            message: "find topic by module id done",
            data: response,
            success: true,
            err: {}
        });
    }catch(error) {
        console.log(error);
        return res.status(404).json({
            message: "find topic by module id fail",
            data: {},
            success: false,
            err: error,
        })
    }
}

export const deleteTopic = async (req, res) => {
    try {
        const title = req.body.title;
        console.log(title);
        
        const response = await topicRepo.delete(title);

        if (response) {
            console.log("Topic deleted Successfully");
            return res.status(200).json({
                message: "Topic successfully deleted",
                success: true,
            });
        } else {
            console.log("Topic not found");
            return res.status(404).json({
                message: "Topic not found",
                success: false
            })
        }
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong while deleting Topic",
            data: {},
            success: false,
            err: error
        });
    }
};