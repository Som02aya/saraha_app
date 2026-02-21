import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import nodemailer from "nodemailer";


const otpSchema = new mongoose.Schema({
    email: String,
    code: String,
    expireAt: Date,
});

export const Otp = mongoose.model("Otp", otpSchema);

