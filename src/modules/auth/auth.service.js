import { UserModel,create,findOne } from "../../DB/index.js";
import { providerEnum, RoleEnum } from "../../enums/user.enums.js";
import {hash,compare, genSalt} from 'bcrypt'
import { compareHash, generateHash } from "../../security/hash.security.js";
import { encrypt ,decrypt} from "../../security/encryption.sequrity.js";
import jwt from 'jsonwebtoken'
import { Access_Expire_In, Refresh_Expire_In, System_TOKEN_SECRET_KEY, User_TOKEN_SECRET_KEY } from "../../../config/config.service.js";
import { generateToken } from "../../security/token.security.js";
import { TokenTypeEnum } from '../../enums/sequrity.enum.js';
import { verifyToken } from "../../security/token.security.js";

import { getTokenSignauture,createLoginCreadintials } from '../../security/token.security.js'
import {  AudienceEnum } from  '../../enums/sequrity.enum.js'
import {OAuth2Client} from 'google-auth-library';
import { model } from "mongoose";

export const signup = async (inputs) => {
    const {username,email,password,phone}=inputs;
    const checkuserexist = await findOne({model:UserModel,filter:{email},select :'email',options: {
        //populate:[{path:"lol"}]
        leen:true
    }})
    if(checkuserexist){
           throw new Error("USER EXISTS");
    }
    
    const user = await create({model:UserModel,
        data:[{username,email,password:await generateHash(password),phone:await encrypt(phone),provider:providerEnum.system}]
    })

    return user
}


export const login = async (inputs,issuer) => {
    const {email,password}=inputs;
   const user = await findOne({
  model: UserModel,
  filter: { email, provider: providerEnum.system }
})

    if(!user){
          throw new Error("no user");
    }
   const match= await compareHash(password,user.password)
   if(!match){
    throw new Error("invalid password");
   }
console.log(user.role);

const {access_signature,refresh_signature,audience}=await getTokenSignauture(user.role)
const access_token = await generateToken({
  payload: { sub: user._id },
  secret: access_signature,
  options: {
    issuer,
    audience: [TokenTypeEnum.access, audience],
    expiresIn: Access_Expire_In
  }
})

const refresh_token = await generateToken({
  payload: { sub: user._id },
  secret: refresh_signature,
  options: {
    issuer,
    audience: [TokenTypeEnum.refresh, audience],
    expiresIn: Refresh_Expire_In
  }
})

return await createLoginCreadintials(user,issuer)
}



export const signupWithGmail=async({idToken,issuer})=>{
   const client = new OAuth2Client();
   const ticket = await client.verifyIdToken({ idToken, audience: ["133989944357-7m8uh13ksmsuu3pn2jssuc4l73kidp2k.apps.googleusercontent.com"] });
   const payload = ticket.getPayload();
   console.log(payload); 
   if(!payload?.email_verified){
    throw new Error("fail to authentcate this account with google")
   }
   const checkuserexist = await findOne({model:UserModel,filter:{email:payload.email}})
   console.log(checkuserexist);
   if (checkuserexist) {
    if (checkuserexist.provider==providerEnum.system) {
      throw new Error("account already exist with different provider")
    }
    const result= await loginWithGmail({idToken},issuer)
    return {result,status}
   }

   const user =await create({model:UserModel,data:[{
    firstName:payload.given_name,
    lastName:payload.family_name,
    email:payload.email,
    provider:providerEnum.google,
    profilepic:payload.picture,
    confirmEmail:new Date()
   }]})
   return{result: await createLoginCreadintials(user[0],issuer)}
   
  
  }

 export const loginWithGmail=async({idToken,issuer})=>{
   const client = new OAuth2Client();
   const ticket = await client.verifyIdToken({ idToken, audience: ["133989944357-7m8uh13ksmsuu3pn2jssuc4l73kidp2k.apps.googleusercontent.com"] });
   const payload = ticket.getPayload();
   console.log(payload); 
   if(!payload?.email_verified){
    throw new Error("fail to authentcate this account with google")
   }
   const user = await findOne({model:UserModel,filter:{email:payload.email,provider:providerEnum.google}})
   console.log(user);
   if (!user) {
    
      throw new Error("invalid login creaditals or invalid login approch")
   
    
   }

   return await createLoginCreadintials(user,issuer)
   
  
  }