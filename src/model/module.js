import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
    moduleId: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    parentSubject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }
}, { timestamps: true })


moduleSchema.pre('save', async function (next) {
    if (!this.moduleId) {
        // Generate the student ID if it doesn't exist
        this.moduleId = await generateUniqueModuleId();
    }
    next();
});

async function generateUniqueModuleId() {
    let moduleId;
    const Module = mongoose.model('Module'); // Move the Subject model reference here
    do {
        // Generate a potential subject ID
        moduleId = 'MOD' + Math.random().toString().substring(2, 5);
        // Check if the subject ID already exists
        const count = await Module.countDocuments({ moduleId });
        if (count === 0) {
            // Unique subject ID generated
            return moduleId;
        }
    } while (true);
}


const Module = mongoose.model('Module', moduleSchema);

export default Module