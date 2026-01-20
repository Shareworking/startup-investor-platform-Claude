const Startup = require('../models/Startup');

// Create a new startup
exports.createStartup = async (req, res) => {
  try {
    const { name, tagline, description, category, stage, website, logo } = req.body;
    const ownerId = req.user.userId;

    if (!name) {
      return res.status(400).json({ error: 'Startup name is required' });
    }

    const startup = await Startup.create({
      name, tagline, description, category, stage, website, logo
    }, ownerId);

    res.status(201).json({
      message: 'Startup created successfully',
      startup
    });
  } catch (error) {
    console.error('Create startup error:', error);
    res.status(500).json({ error: 'Server error during startup creation' });
  }
};

// Get all startups (public)
exports.getAllStartups = async (req, res) => {
  try {
    const startups = await Startup.getAll();
    res.json({ startups });
  } catch (error) {
    console.error('Get all startups error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get startup by ID (public)
exports.getStartupById = async (req, res) => {
  try {
    const { id } = req.params;
    const startup = await Startup.findById(id);

    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }

    res.json({ startup });
  } catch (error) {
    console.error('Get startup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user's startups
exports.getMyStartups = async (req, res) => {
  try {
    const userId = req.user.userId;
    const startups = await Startup.findByUserId(userId);
    res.json({ startups });
  } catch (error) {
    console.error('Get my startups error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update startup
exports.updateStartup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if user is owner
    const isOwner = await Startup.isOwner(id, userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Only startup owner can update' });
    }

    const updatedStartup = await Startup.update(id, req.body);
    res.json({
      message: 'Startup updated successfully',
      startup: updatedStartup
    });
  } catch (error) {
    console.error('Update startup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete startup
exports.deleteStartup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const isOwner = await Startup.isOwner(id, userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Only startup owner can delete' });
    }

    await Startup.delete(id);
    res.json({ message: 'Startup deleted successfully' });
  } catch (error) {
    console.error('Delete startup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add co-founder
exports.addCoFounder = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;
    const userId = req.user.userId;

    const isOwner = await Startup.isOwner(id, userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Only startup owner can add co-founders' });
    }

    // Find user by email
    const User = require('../models/User');
    const cofounder = await User.findByEmail(email);
    
    if (!cofounder) {
      return res.status(404).json({ error: 'User not found with this email' });
    }

    await Startup.addCoFounder(id, cofounder.id, role || 'co-founder');
    
    res.json({ message: 'Co-founder added successfully' });
  } catch (error) {
    console.error('Add co-founder error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'This user is already a team member' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove co-founder
exports.removeCoFounder = async (req, res) => {
  try {
    const { id, userId: cofounderUserId } = req.params;
    const userId = req.user.userId;

    const isOwner = await Startup.isOwner(id, userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Only startup owner can remove co-founders' });
    }

    await Startup.removeCoFounder(id, cofounderUserId);
    res.json({ message: 'Co-founder removed successfully' });
  } catch (error) {
    console.error('Remove co-founder error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
