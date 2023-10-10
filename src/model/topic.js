import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        parentModule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module"
        },
        sessions: {
            type: Array,
        }
    }

)

const Topic  = mongoose.model("Topic", topicSchema);
export default Topic;