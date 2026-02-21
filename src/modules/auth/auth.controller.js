import { Router } from 'express'
import {  signup,login, loginWithGmail } from './auth.service.js';
import joi from'joi'
import nodemailer from "nodemailer";
import { Otp } from '../../DB/model/otp.model.js';
import { sendOtpService } from './auth.service.js';
import { verifyOtpService } from './auth.service.js';
const router = Router(); 
router.post("/signup", async (req, res, next) => {
    console.log(req.body.password)
    const loginSchema=joi.object().keys({
    
        email:joi.string().email({maxDomainSegments:3,minDomainSegments:2,tlds:{allow:['com','net','edu']}}).required(),
        password:joi.string().required(),
        //cpassword:joi.string()
        //gender:joi.string().valid("male","female").insensitive(),
        //age:joi.number().integer().positive().min(20).max(80).required(),
        //confirm:joi.boolean().truthy("1","done").falsy("0",fail).sensitive(),
        //DOB:joi.date().greater('1-1-2026'),
        //colours:joi.array().min(1).max(5).required().items(joi.string().required())

    }).required()

    const signupSchema =loginSchema.append({
     username: joi.string().min(2).max(20).required().messages({
    "any.required":"email is mandatory"
    }).insensitive().not("male","female").alphanum(),
    phone: joi.string().required(),
    cpassword:joi.string().valid(joi.ref("password"))
    }).required()

    
     const validationResult =signupSchema.validate(req.body,{abortEarly:false})
     if(validationResult.error){
        const messages = validationResult.error.details.map(err => err.message)
         throw new Error(messages.join(", "))
     }

    const result = await signup(req.body)
    return res.status(201).json({ message: "Done signup", result })
})

router.post("/login", async (req, res, next) => {
    console.log(`${req.protocol}://${req.host}`);
    
    //console.log(req.protocol);
    //console.log(req.host);
    const result = await login(req.body,`${req.protocol}://${req.host}`)
    return res.status(201).json({ message: "Done login", result })
})


router.post("/signup/gmail", async (req, res, next) => {
    console.log(req.body);
    const {account,status} =await signupWithGmail(req.body,`${req.protocol}://${req.host}`)
    return res.status(201).json({ message: "Done signupwith gmail", account })
})


router.post("/login/gmail", async (req, res, next) => {
    console.log(req.body);
    const account =await loginWithGmail(req.body,`${req.protocol}://${req.host}`)
    return res.status(201).json({ message: "Done signupwith gmail", account })
})


router.post("/send-otp", async (req, res, next) => {
    try {
        console.log(req.body);
        const result = await sendOtpService(req.body.email);
        return res.status(201).json(result);
    } catch (err) {
        next(err); 
    }
});


router.post("/verify-otp", async (req, res, next) => {
    try {
        console.log(req.body);
        const result = await verifyOtpService(req.body.email, req.body.code);
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
});



export default router