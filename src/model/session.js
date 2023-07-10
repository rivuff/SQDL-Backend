import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },    description:{
        type: String,
        required: true
    },
    topic:{
        type: String,

    },
    startTime: {
        type: Date,
    },
    createdBy:{
        type: String,
        required: true
    },
    parentModule:{
        type: String,
        required: true
    }
},{timestamps: true})

const Session = mongoose.model('Session', sessionSchema);
export default Session