import { Router } from "express";
import { profile, rotateToken } from "./user.service.js";
import { authentication, authorization } from "../../middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../enums/sequrity.enum.js";
import { RoleEnum } from "../../enums/user.enums.js";
import { endpoint } from "./user.authorization.js";
import { verifyToken } from "../../security/token.security.js";
import { User_TOKEN_SECRET_KEY } from "../../../config/config.service.js";
import { upload } from "../../middleware/multer.middleware.js";
import { UserModel } from "../../DB/model/user.model.js";
const router=Router()

router.get("/" ,authentication(),authorization(endpoint.profile), async(req,res,next)=>{
    console.log(req.headers);
    const {authorization}=req.headers
    console.log(authorization);
    const {flag,credential}=authorization.split(" ")
    console.log(flag,credential);
    if(!flag||!credential){
        throw new Error("missing authorization parts")
    }
    switch (flag) {
        case 'Basic':
             const data= Buffer.from(credential,'base64').toString();
             const [username,password]=data.split(":")
             console.log(data);
             console.log(username,password);
              break;
       case 'Bearer':
         const result =verifyToken({token:credential,secret:User_TOKEN_SECRET_KEY})
         console.log(result);
         
              break;
        default:
            break;
    }

    const account  = await profile(req.user)
    return res.status(200).json({message:"Profile" , account})
})
  
router.put(
  "/profile-image",
  authentication(), 
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) return res.json({ message: "No image uploaded" });

      const imagePath = req.file.path;

      await UserModel.findByIdAndUpdate(req.user._id, { profileImage: imagePath });

      res.json({ message: "Profile image uploaded successfully" });
    } catch (error) {
      next(error);
    }
  }
);
   
    
    
    
    
    
    


router.get("/rotate" ,authentication(TokenTypeEnum.refresh), async(req,res,next)=>{
    
    const account  = await rotateToken(req.user,`${req.protocol}://${req.host}`)
    return res.status(200).json({message:"Profile" , account})
})
export default router