import { Post } from "../models/posts.model.js";

class PostController {
    #_postModel;
    constructor() {
        this.#_postModel = Post;
    }

        getAllPosts = async (req, res) => {
        const posts = await this.#_postModel.find();

        res.send({
            success: true,
            posts
        });
    }

    getSinglePost = async (req, res) => {
        const {id} = req.params;

        const post = await this.#_postModel.find({_id: id});

        res.send({
            success: true,
            post
        });
    }

    createPost = async (req, res) => {
        const {title, content, created_by} = req.body;

        await this.#_postModel.insertOne({
            title,
            content,
            created_by,
            image_url: `/uploads/${req.files.image[0].filename}`,
            video_url: req.files?.video?.[0]?.filename ? `/uploads/${req.files?.video?.[0]?.filename}` : null
        });

        res.status(201).send({
            success: true,
            message: "Sucessfully created"
        });
    }

    updatePost = async (req, res) => {
        const {id} = req.params;
        const {title, content, created_by} = req.body;

        await this.#_postModel.updateOne(
            {_id: id},
            {
            title,
            content,
            created_by,
            image_url: `/uploads/${req.files.image[0].filename}`,
            video_url: req.files?.video?.[0]?.filename ? `/uploads/${req.files?.video?.[0]?.filename}` : null
            }
        );

        res.status(200).send({
            success: true,
            message: "Sucessfully updated"
        });
    }

    deletePost = async (req, res) => {
        const {id} = req.params;

        await this.#_postModel.deleteOne({_id: id});

        res.status(200).send({
            success: true,
            message: "Sucessfully deleted"
        });
    }
}

export default new PostController();