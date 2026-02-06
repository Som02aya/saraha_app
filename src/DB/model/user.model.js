import mongoose from "mongoose";
import { GenderEnum, providerEnum } from "../../enums/index.js";
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:[true,'firstname is mandatory'],
        minLenght:2,
        maxLenght:25

    },
  lastName:{
        type:String,
        require:[true,'lastname is mandatory'],
        minlength:2,
        maxlength:25

    },

    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
     type:String,
     require:true,
    },
    DOB:Date,
    phone: String,
    gender:{type:String , enum: Object.values(GenderEnum),default:GenderEnum.male},
    provider:{
     type:String,
     enum:Object.values(providerEnum),
     default:providerEnum.system

    },
    confirmEmail:Date,
    profilepic:String,

},
{
    collection:"Route_Users",
    timestamps:true,
    strict:true,
    strictQuery:true
})
userSchema.virtual('username').set(function(value){
    const [firstName,lastName]= value.split(' ')|| []
    this.set({firstName,lastName})
}).get(function(){
    return this.firstName +" " +this.lastName

})

export const UserModel =mongoose.models.User|| mongoose.model("User",userSchema)