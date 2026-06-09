const express = require('express');
const router = express.Router();
const { inquiriesDb } = require('../db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// @route   POST api/inquiries
// @desc    Submit a new project inquiry (Client only)
router.post('/', authMiddleware, (req, res) => {
  try {
    const { service, budget, message, clientCompany } = req.body;

    if (!service || !budget || !message) {
      return res.status(400).json({ error: 'Please fill out all required fields' });
    }

    const inquiries = inquiriesDb.read();

    const newInquiry = {
      id: 'inq-' + Math.random().toString(36).substring(2, 11),
      clientId: req.user.id,
      clientName: req.user.name,
      clientEmail: req.user.email,
      clientCompany: clientCompany || '',
      service,
      budget,
      message,
      status: 'pending', // pending, discovery, design, dev, live, rejected
      paymentStatus: 'unpaid', // unpaid, deposit_paid, fully_paid
      timeline: 'TBD',
      notes: [], // array of { id, text, author, createdAt }
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inquiries.push(newInquiry);
    inquiriesDb.write(inquiries);

    res.status(201).json({ success: true, inquiry: newInquiry });
  } catch (error) {
    console.error('Submit inquiry error:', error.message);
    res.status(500).json({ error: 'Failed to submit inquiry. Server error.' });
  }
});

// @route   GET api/inquiries
// @desc    Get all project inquiries (Admin only)
router.get('/', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const inquiries = inquiriesDb.read();
    // Sort by newest first
    inquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(inquiries);
  } catch (error) {
    console.error('Fetch inquiries error:', error.message);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// @route   PUT api/inquiries/:id
// @desc    Update project inquiry status, payment, or notes (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, timeline, notes, message } = req.body;

    const inquiries = inquiriesDb.read();
    const index = inquiries.findIndex(i => i.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    // Merge updates
    const current = inquiries[index];
    
    if (status) current.status = status;
    if (paymentStatus) current.paymentStatus = paymentStatus;
    if (timeline) current.timeline = timeline;
    if (notes) current.notes = notes; // Already formatted note list or single note push
    if (message) current.message = message;
    
    current.updatedAt = new Date().toISOString();

    inquiries[index] = current;
    inquiriesDb.write(inquiries);

    res.json({ success: true, inquiry: current });
  } catch (error) {
    console.error('Update inquiry error:', error.message);
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

// @route   POST api/inquiries/:id/notes
// @desc    Add a note to a project inquiry (Admin only)
router.post('/:id/notes', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Note content cannot be empty' });
    }

    const inquiries = inquiriesDb.read();
    const index = inquiries.findIndex(i => i.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    const current = inquiries[index];
    const newNote = {
      id: 'note-' + Math.random().toString(36).substring(2, 6),
      text,
      author: req.user.name,
      createdAt: new Date().toISOString()
    };

    current.notes.push(newNote);
    current.updatedAt = new Date().toISOString();

    inquiries[index] = current;
    inquiriesDb.write(inquiries);

    res.json({ success: true, note: newNote, notes: current.notes });
  } catch (error) {
    console.error('Add note error:', error.message);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

module.exports = router;
