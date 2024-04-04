import { Schema, model } from "mongoose";

const vehicleSchema = new Schema({
    ownerId : { type: String, required: true },
    vehicle: { type: String, required: true },
    color: { type: String, required: true },
    licensePlate: { type: String, required: true },
    vehicleId: { type: Number, default: null },
    date: { type: Number, default: Date.now() },
});

const ticketSchema = new Schema({
    recipient: { type: String, required: true },
    officer: { type: String, required: true },
    charges: { type: String, required: true },
    fine: { type: Number, default: "" },
    case: { type: Number, default: null},
    date: { type: Number, default: Date.now() },
});

const modLog = new Schema({
  recipient: { type: String, required: true },
  moderator: { type: String, required: true },
  type: { type: String, required: true },
  reason: { type: String, required: true },
  evidence: { type: String, required: true },
  case: { type: Number, default: null},
  date: { type: Number, default: Date.now() },
})

export const modlog = model("modLog", modLog);

export const vehicle = model("Vehicles", vehicleSchema);

export const ticket = model("Tickets", ticketSchema);