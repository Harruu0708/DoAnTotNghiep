import User from '../models/User.js'

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    delete: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.json({msg: "Deleted a User"});
        }
        catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
}

export default userController