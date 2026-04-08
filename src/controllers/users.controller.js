import { User } from "../models/users.model.js";

class UserController {
    #_userModel;
    constructor() {
        this.#_userModel = User;
    }

    getAllUsers = async (req, res) => {
        const users = await this.#_userModel.find();

        res.send({
            success: true,
            users
        });
    }

    getSingleUser = async (req, res) => {
        const {id} = req.params;

        const user = await this.#_userModel.find({_id: id});

        res.send({
            success: true,
            user
        });
    }

    upload = async (req, res) => {
        const {id} = req.params;
        const {image} = req.files;

        await this.#_userModel.updateOne(
            {_id: id},
            {profile_image: `/uploads/${image?.[0]?.filename}`}
        );

        res.send({
            success: true,
            message: "Profile image successfully uploaded"
        })
    }

    deleteUser = async (req, res) => {
        const {id} = req.params;

        await this.#_userModel.deleteOne({_id: id});

        res.status(200).send({
            success: true,
            message: "Sucessfully deleted"
        });
    }
}

export default new UserController();