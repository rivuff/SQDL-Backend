import ModuleRepository from "../repository/module-repository.js"

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



export const getModulesBySubjectId = async (req, res) => {

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


export const getModuleById = async (req, res) => {

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

export const moduleUpdate = async (req,res)=>{
    const module = await moduleRepo.findByID(req.body._id)
    if(req.body.name!=null){
        module.name = req.body.name
    }
    if (req.body.description!=null){
        module.description= req.body.description
    }
    try{
        const newmod = await module.save()
        return res.status(200).json({
            message: 'Succesfully updated module',
            data: newmod,
            success: true,
            err: {}
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            message: 'Something went wrong in in module controller',
            data: {},
            success: false,
            err: error
        })
    }

}
