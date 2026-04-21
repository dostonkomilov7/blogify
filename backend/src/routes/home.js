import express from "express";
import { Post } from "../models/posts.model.js";

const router = express.Router();

router.get('/posts', async (req, res) => {
  const posts = await Post.find()
    .populate('created_by', 'username email')
    .sort({ createdAt: -1 })
    .lean();

  // avatar initials ni model-dan olish uchun qo'shimcha field
  posts.forEach(p => {
    if (p.created_by) {
      const name = p.created_by.username || p.created_by.email || 'User';
      p.created_by.initials = name.trim().split(' ')
        .map(w => w[0]?.toUpperCase() || '').slice(0, 2).join('');
    }
  });

  res.render('posts', {
    posts,
    totalPosts : posts.length,
    totalUsers : [...new Set(posts.map(p => String(p.created_by?._id)))].length,
    mediaCount : posts.filter(p => p.image_url || p.video_url).length,
  });
});

router.get("/posts/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("created_by", "name")
            .lean();

        if(!post) return res.status(404).render("error", {message: "Post not found"});

        res.render("post", {post});
    } catch (error) {
        console.log(error);
        res.status(500).render("error", {message: "Failed to load posts"});
    }
})

export default router;