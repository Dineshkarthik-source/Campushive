import { Router } from "express";
import Post from "../models/Post.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res) => {
  const posts = await Post.find().populate("author", "name department").sort({ createdAt: -1 }).limit(50);
  res.json(posts);
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const post = await Post.create({ author: req.user._id, text: req.body.text });
    await post.populate("author", "name department");
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/:id/like", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found." });
  const liked = post.likes.some((l) => l.equals(req.user._id));
  if (liked) post.likes.pull(req.user._id);
  else post.likes.push(req.user._id);
  await post.save();
  res.json({ id: post._id, likes: post.likes });
});

router.delete("/:id", requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found." });
  if (!post.author.equals(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ message: "You can only delete your own posts." });
  }
  await post.deleteOne();
  res.json({ message: "Post deleted." });
});

export default router;
