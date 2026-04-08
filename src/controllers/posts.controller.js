import { Post } from "../models/posts.model.js";
import fs from "node:fs/promises";
import path from "node:path";
import { NotFoundException } from "../exceptions/not-found.exception.js";
import { ForbiddenException } from "../exceptions/forbidden.exception.js";

class PostController {
    #_postModel;
    constructor() {
        this.#_postModel = Post;
    }

    getAllPosts = async (req, res, next) => {
        const posts = await this.#_postModel.find();

        res.send({
            success: true,
            posts
        });
    }

    getSinglePost = async (req, res, next) => {
        const { id } = req.params;

        const post = await this.#_postModel.find({ _id: id });

        res.send({
            success: true,
            post
        });
    }

    createPost = async (req, res, next) => {
        try {
            const { title, content, created_by } = req.body;

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
        } catch (error) {
            if (req.files.image[0].filename) {
                await fs.unlink(
                    path.join(process.cwd(), `/uploads/${req.files?.image?.[0]?.filename}`)
                )
            }

            if (req.files.video[0].filename) {
                await fs.unlink(
                    path.join(process.cwd(), `/uploads/${req.files?.video?.[0]?.filename}`)
                )
            }
            next(error)
        }
    }

    updatePost = async (req, res, next) => {
        try {
            const user = req.user
            const { id } = req.params;
            const { title, content } = req.body;

            const foundedPost = await this.#_postModel.findById(id);


            if(!foundedPost){
                throw new NotFoundException("Post is not found")
            }

            let imageUrl = foundedPost.image_url;
            let videoUrl = foundedPost.video_url;

            if (user.role !== "ADMIN" && foundedPost.created_by != user.id) {
                throw new ForbiddenException("You can only change your posts");
            }

            if(req.files?.image?.[0]?.filename){
                if(foundedPost.image_url){
                    fs.unlink(path.join(process.cwd(), foundedPost.image_url));
                }

                imageUrl = `/uploads/${req.files?.image?.[0]?.filename}`
            }

            if(req.files?.video?.[0]?.filename){
                if(foundedPost.video_url){
                    fs.unlink(path.join(process.cwd(), foundedPost.video_url));
                }

                videoUrl = `/uploads/${req.files?.video?.[0]?.filename}`
            }

            await this.#_postModel.updateOne(
                { _id: id },
                {
                    title,
                    content,
                    image_url: imageUrl,
                    video_url: videoUrl
                }
            );

            res.status(200).send({
                success: true,
                message: "Sucessfully updated"
            });

        } catch (error) {
            if (req.files?.image?.[0]?.filename) {
                await fs.unlink(
                    path.join(process.cwd(), `/uploads/${req.files.image[0].filename}`)
                )
            }

            if (req.files?.video?.[0]?.filename) {
                await fs.unlink(
                    path.join(process.cwd(), `/uploads/${req.files.video[0].filename}`)
                )
            }
            next(error)
        }
    }

    deletePost = async (req, res, next) => {
        try {
            const user = req.user;
            const { id } = req.params;

            const foundedPost = await this.#_postModel.findById(id);

            if (user.role !== "ADMIN" && foundedPost.created_by != user.id) {
                throw new ForbiddenException("You can only delete your posts");
            }

            await this.#_postModel.deleteOne({ _id: id });

            res.status(200).send({
                success: true,
                message: "Sucessfully deleted"
            });
            
        } catch (error) {
            next(error)
        }
    }

}

export default new PostController();