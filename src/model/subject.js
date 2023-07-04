import mongoose, { Mongoose } from "mongoose";

const subjectSchema = new mongoose.Schema({
    subjectId:{
        type: String,
        unique: true
    },
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String
    },
    createdBy:{
        type: String,
        required: true
    },
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]            
}, {timestamps: true})


subjectSchema.pre('save', async function(next) {
    if (!this.subjectId) {
        // Generate the student ID if it doesn't exist
        this.subjectId = await generateUniqueSubjectId();
    }
    next();
});

async function generateUniqueSubjectId() {
    let subjectId;
    const Subject = mongoose.model('Subject'); // Move the Subject model reference here
    do {
        // Generate a potential subject ID
        subjectId = 'SUB' + Math.random().toString().substring(2, 5);
        // Check if the subject ID already exists
        const count = await Subject.countDocuments({ subjectId });
        if (count === 0) {
            // Unique subject ID generated
            return subjectId;
        }
    } while (true);
}


const Subject = mongoose.model('Subject', subjectSchema);

export default Subject