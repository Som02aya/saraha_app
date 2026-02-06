import { UserModel,createOne,findOne } from "../../DB/index.js";
import { providerEnum } from "../../enums/user.enums.js";
import {hash,compare, genSalt} from 'bcrypt'
import { compareHash, generateHash } from "../../security/hash.security.js";
import { encrypt ,decrypt} from "../../security/encryption.sequrity.js";
export const signup = async (inputs) => {
    const {username,email,password,phone}=inputs;
    const checkuserexist = await findOne({model:UserModel,filter:{email},select :'email',option: {
        //populate:[{path:"lol"}]
        leen:true
    }})
    if(checkuserexist){
           throw new Error("USER EXISTS");
    }
    
    const user = await createOne({model:UserModel,
        data:[{username,email,password:await generateHash(password),phone:await encrypt(phone),provider:providerEnum.system}]
    })

    return user
}


export const login = async (inputs) => {
    const {email,password}=inputs;
    const user = await UserModel.findOne({model:UserModel,
        filter:{email,provider:providerEnum.system}
    })
    if(!user){
          throw new Error("no user");
    }
   const match= await compareHash(password,user.password)
   if(!match){
    throw new Error("invalid password");
   }
 user.phone=await decrypt(user.phone)
 return user
}