import Module from "../model/module.js";


class ModuleRepository {
    async create(data) {
        try {
            const response = Module.create(data);
            return response
        } catch (error) {
            console.log("Module repo ", error);
            throw error;
        }
    }
    async findByID(_id) {
        try {
            const response = await Module.findOne({ _id: _id });
            return response;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error
        }
    }

    async getAllFromSubjectId(_id) {
        try {
            const modules = Module.findAll({parentSubject: _id});
            return modules;
        } catch (error) {
            console.log("Something went wrong in repository layer");
            throw error
        }
    }
}

export default ModuleRepository;