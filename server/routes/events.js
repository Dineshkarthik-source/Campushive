import { Router } from "express";
import Event from "../models/Event.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res) => {
  const events = await Event.find()
    .populate("club", "name")
    .populate("createdBy", "name")
    .sort({ date: 1 });
  res.json(events);
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, location, date, club } = req.body;
    const event = await Event.create({
      title,
      description,
      location,
      date,
      club: club || undefined,
      createdBy: req.user._id,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/:id/rsvp", requireAuth, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found." });
  const going = event.attendees.some((a) => a.equals(req.user._id));
  if (going) event.attendees.pull(req.user._id);
  else event.attendees.push(req.user._id);
  await event.save();
  res.json(event);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found." });
  const isOwner = event.createdBy.equals(req.user._id);
  if (!isOwner && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only the organizer can delete this event." });
  }
  await event.deleteOne();
  res.json({ message: "Event deleted." });
});

export default router;
