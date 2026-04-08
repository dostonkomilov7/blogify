import { ForbiddenException } from "../exceptions/forbidden.exception.js";
import { Like } from "../models/likes.model.js";

class LikeController {
    #_likeModel;
    constructor() {
        this.#_likeModel = Like
    }

    createLike = async (req, res) => {
        const {id: post_id} = req.params;
        const {user_id} = req.body;

        await this.#_likeModel.insertOne({
            post_id,
            user_id
        });

        res.status(201).send({
            success: true,
            message: "Sucessfully created"
        });
    }

    deleteLike = async (req, res) => {
        const user = req.user;
        const {id} = req.params;

        const foundedLike = this.#_likeModel.findById(id);

        if(user.role !== "ADMIN" && foundedLike.user_id !== user.id){
            throw new ForbiddenException("You can only delete your like")
        }

        await this.#_likeModel.deleteOne({_id: id});

        res.status(200).send({
            success: true,
            message: "Sucessfully deleted"
        });
    }
}

export default new LikeController();