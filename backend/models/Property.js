const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    ar: { type: String, required: false },
    en: { type: String, required: true }
  },
  location: {
    ar: { type: String, required: false },
    en: { type: String, required: true }
  },
  city: {
    type: String,
    enum: ['jubail', 'dhahran', 'ahsa', 'dammam', 'khobar', 'hofuf'],
    required: false
  },
  propertyCode: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true 
  },
  images: [{ type: String }], // Base64 encoded images
  video: { type: String },
  description: { type: String }, // Property description
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  area: { 
    type: Number, 
    required: true,
    min: 0 
  },
  bedrooms: { 
    type: Number, 
    required: false,
    min: 0,
    default: 0
  },
  bathrooms: { 
    type: Number, 
    required: false,
    min: 0,
    default: 0
  },
  type: { 
    type: String, 
    required: true,
    enum: ['villa', 'apartment_tower', 'apartment_building', 'land', 'building', 'townhouse', 'mansion', 'farm', 'istraha', 'store', 'office', 'resort', 'showroom']
  },
  purpose: { 
    type: String, 
    required: true,
    enum: ['sale', 'rent', 'investment']
  },
  features: {
    floors: { type: Number, default: 0 },
    guestLounge: { type: Number, default: 0 },
    facade: { type: String },
    streetWidthNorth: { type: Number, default: 0 },
    dailyLivingRoom: { type: Number, default: 0 },
    diningRoom: { type: Number, default: 0 },
    maidRoom: { type: Number, default: 0 },
    driverRoom: { type: Number, default: 0 },
    kitchen: { type: Number, default: 0 },
    storageRoom: { type: Number, default: 0 },
    elevator: { type: Number, default: 0 }
  },
  services: [{ type: String }],
  usage: { 
    type: String, 
    required: true,
    enum: ['Residential', 'Commercial']
  },
  advertiser: {
    number: { type: String, required: true },
    license: { type: String, required: true }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
propertySchema.index({ propertyCode: 1 });
propertySchema.index({ type: 1, purpose: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ area: 1 });
propertySchema.index({ isActive: 1 });

module.exports = mongoose.model('Property', propertySchema);
