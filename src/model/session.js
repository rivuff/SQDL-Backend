import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    title:{
        type: String,
        unique: true,
        required: true
    },
    topic:{
        type: String,
        unique: true,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    createdBy:{
        type: String,
        required: true
    },
    parentModule:{
        type: String,
        required: true
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject' // Reference the "Subject" model from the "subject" database
    }

},{timestamps: true})

const Session = mongoose.model('Session', sessionSchema);
export default Session