import { Router } from "express";
import Club from "../models/Club.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res) => {
  const clubs = await Club.find().sort({ createdAt: -1 });
  res.json(clubs);
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const club = await Club.create({
      name,
      description,
      category,
      createdBy: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json(club);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/:id/join", requireAuth, async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (!club) return res.status(404).json({ message: "Club not found." });
  const joined = club.members.some((m) => m.equals(req.user._id));
  if (joined) club.members.pull(req.user._id);
  else club.members.push(req.user._id);
  await club.save();
  res.json(club);
});

export default router;
