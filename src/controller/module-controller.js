import ModuleRepository from "../repository/subject-repository.js"

const moduleRepo = new ModuleRepository();


export const createModule = async (req, res) => {
    try {
        const response = await moduleRepo.create({
            name: req.body.name,
            description: req.body.description,
            createdBy: req.body.createdBy,
            parentSubject: req.body.parentSubject,
        })

        console.log(response);

        return res.status(200).json({
            success: true,
            message: 'Successfully created new module',
            data: response,
            err: {}
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "something went wrong in module controller",
            data: {},
            err: error
        })
    }
}




export const getAllFromSubjectId = async (req, res) => {

    try {
        const _id = req.body._id
        const module = await moduleRepo.getAllFromSubjectId(_id)
        return res.status(200).json({
            success: true,
            message: 'Modules retrieved successfully',
            data: module,
            err: {}
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in in module controller',
            data: {},
            success: false,
            err: error
        })
    }

}


export const getById = async (req, res) => {

    try {
        const _id = req.body._id
        const module = await moduleRepo.findByID(_id)
        return res.status(200).json({
            success: true,
            message: 'Module retrieved successfully',
            data: module,
            err: {}
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in in module controller',
            data: {},
            success: false,
            err: error
        })
    }

}

