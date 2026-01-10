import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "photographer", "admin"], default: "customer" },
  phone: { type: String },
  gender: { type: String, enum: ["Female", "Male", "Other"] },
  country: { type: String },
  languages: { type: [String] },
  profilePic: { type: String },
  isVerified: { type: Boolean, default: false },
  
  // New location field
  location: {
    type: {
      type: String,           // "Point"
      enum: ["Point"],        
      default: "Point",
    },
    coordinates: {            // [longitude, latitude]
      type: [Number],
      default: [0, 0],
    },
  },
}, { timestamps: true });

// Create geospatial index
userSchema.index({ location: "2dsphere" });

const User = mongoose.model('User', userSchema);
export default User;
