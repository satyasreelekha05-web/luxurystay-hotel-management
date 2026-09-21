import Room from '../models/Room.js';

export const getRooms = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, capacity, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (capacity) query.capacity = { $gte: Number(capacity) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const rooms = await Room.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Room.countDocuments(query);

    res.json({
      rooms,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { name, category, price, description, capacity, amenities, size } = req.body;
    
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const room = await Room.create({
      name,
      category,
      price,
      description,
      capacity,
      amenities: amenities ? JSON.parse(amenities) : [],
      images,
      size
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const { name, category, price, description, capacity, amenities, isAvailable, size } = req.body;
    
    room.name = name || room.name;
    room.category = category || room.category;
    room.price = price || room.price;
    room.description = description || room.description;
    room.capacity = capacity || room.capacity;
    room.size = size || room.size;
    room.isAvailable = isAvailable !== undefined ? isAvailable : room.isAvailable;
    
    if (amenities) {
      room.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
    }
    
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      room.images = [...room.images, ...newImages];
    }

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await room.deleteOne();
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.query;

    const Booking = (await import('../models/Booking.js')).default;

    // Normalize to midnight UTC — same logic as createBooking
    const newCheckIn  = new Date(checkInDate  + 'T00:00:00.000Z');
    const newCheckOut = new Date(checkOutDate + 'T00:00:00.000Z');

    // Only confirmed (paid) bookings block availability.
    // pending / cancelled / completed must never block.
    const conflictingBookings = await Booking.find({
      room: roomId,
      status: 'confirmed',
      checkInDate:  { $lt: newCheckOut },
      checkOutDate: { $gt: newCheckIn }
    });

    res.json({ available: conflictingBookings.length === 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
