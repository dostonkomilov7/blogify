import { ForbiddenException} from "../exceptions/forbidden.exception.js";
import { NotFoundException } from "../exceptions/not-found.exception.js";
import { sendEmail } from "../helpers/mail.helper.js";
import { Comment } from "../models/coments.model.js";
import { Post } from "../models/posts.model.js";
import { User } from "../models/users.model.js";

class CommentController {
    #_commentModel;
    constructor() {
        this.#_commentModel = Comment
    }

    getAllComment = async (req, res) => {
        const comments = await this.#_commentModel.find();

        res.send({
            success: true,
            comments
        });
    }


    createComment = async (req, res) => {
        const userModel = User;
        const postModel = Post;
        const {text, post_id, user_id} = req.body;

        const foundedUser = await userModel.findOne({_id: user_id});
        const foundedPost = await postModel.findOne({_id: post_id});

        if(!foundedUser){
            throw new NotFoundException("User is not found");
        }

        if(!foundedPost){
            throw new NotFoundException("Post is not found");
        }

        await this.#_commentModel.insertOne({
            text,
            post_id,
            user_id
        });
        // foundedUser.email
        sendEmail(
            "dostonkomilov070@gmail.com",
            "You have a new comment 📨",
            `<html>
            <head>
                <title>Document</title>
                <style>
                    body {
                        background-image: url(/uploads/Screenshot\ 2026-04-10\ at\ 22.19.20.png);
                        background-size: cover;
                        background-position: center;
                    }

                    main {
                        width: 200px;
                        margin-left: 50px;
                    }

                    h1 {
                        color: rgb(76, 43, 226);
                        font-size: 40px;
                    }
                </style>
            </head>
            <body>
                <main>
                    <h1>BLOGIFY</h1>
                    <h4>⬇️ COMMENT ⬇️</h4>
                    <p><b>👤 ${foundedUser.name}: </b> ${text}</p>
                </main>
            </body>
            </html>
`
        );

        res.status(201).send({
            success: true,
            message: "Sucessfully created"
        });
    }

    deleteComment = async (req, res) => {
        const user = req.user;
        const {id} = req.params;

        const foundedComment = this.#_commentModel.findById(id);

        if(user.role !== "ADMIN" && foundedComment.user_id !== user.id){
            throw new ForbiddenException("You can only delete your comment")
        }

        await this.#_commentModel.deleteOne({_id: id});

        res.status(200).send({
            success: true,
            message: "Sucessfully deleted"
        });
    }
}

export default new CommentController();