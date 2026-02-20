import { model } from 'mongoose'
import { findById } from '../../DB/database.service.js'
import {UserModel} from '../../DB/model/index.js'
import jwt from 'jsonwebtoken'
import { createLoginCreadintials, decodeToken } from '../../security/token.security.js'
import { TokenTypeEnum } from '../../enums/sequrity.enum.js';


export const profile   = async(user)=>{

   

return user
}

export const rotateToken   = async(user,issuer)=>{
  

 return await createLoginCreadintials(user,issuer)
}


export const updateProfileImageService = async (req) => {

  if (!req.file) {
    throw new Error("No image uploaded");
  }

  const imagePath = req.file.path;

  await UserModel.findByIdAndUpdate(req.user._id, {
    profileImage: imagePath,
  });

  return {
    message: "Profile image uploaded successfully"
  };

};