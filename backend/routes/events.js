const express = require('express');
const router = express.Router();
const { eventsDb } = require('../db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// @route   GET api/events
// @desc    Get all calendar events (Admin only)
router.get('/', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const events = eventsDb.read();
    res.json(events);
  } catch (error) {
    console.error('Fetch events error:', error.message);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

// @route   POST api/events
// @desc    Create a new calendar event (Admin only)
router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { title, type, date, clientId } = req.body;

    if (!title || !type || !date) {
      return res.status(400).json({ error: 'Please enter title, type, and date' });
    }

    const events = eventsDb.read();
    const newEvent = {
      id: 'ev-' + Math.random().toString(36).substring(2, 11),
      title,
      type, // call, deadline, milestone
      date, // YYYY-MM-DD
      clientId: clientId || null,
      createdAt: new Date().toISOString()
    };

    events.push(newEvent);
    eventsDb.write(events);

    res.status(201).json({ success: true, event: newEvent });
  } catch (error) {
    console.error('Create event error:', error.message);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// @route   DELETE api/events/:id
// @desc    Delete a calendar event (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const events = eventsDb.read();
    const filtered = events.filter(e => e.id !== id);

    if (events.length === filtered.length) {
      return res.status(404).json({ error: 'Event not found' });
    }

    eventsDb.write(filtered);
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error.message);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
