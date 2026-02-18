//to store user data 

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },

}, { timestamps: true });


const user = mongoose.model('user', userSchema);
export default user;
