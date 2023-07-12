import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    title:{ //same as topic
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    // topic:{
    //     type: String,
    // },
    startTime: {
        type: Date,
    },
    conductedBy:{
        type: String,
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
    },
    enrollmentLimit:{
        type: Number,
        default: 40,
    },
    access_request:{
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        default: [],
    },
    approved_request:{
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        default: [],
    },
    blocked_request:{
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        default: [],
    },
    activity_order:{ 
        type:[{
            type: String,
            default: null
        }]
        },
    iteration:{
        type: [{
            type: String
        }]
    }

},{timestamps: true})

const Session = mongoose.model('Session', sessionSchema);
export default Session