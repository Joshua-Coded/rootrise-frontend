import mongoose from "mongoose";

// lib/mongodb/schemas/farmer-application.ts

const FarmerApplicationSchema = new mongoose.Schema({
  farmerId: { type: String, required: true },
  documents: [{ type: String }], // Cloudinary URLs
  mobileMoneyAccount: { type: String, required: true },
  verificationStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  walletAddress: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
  approvedBy: { type: String },
  approvedAt: { type: Date },
}, { collection: 'FarmerApplications' });

export const FarmerApplication = mongoose.models.FarmerApplication || mongoose.model('FarmerApplication', FarmerApplicationSchema);