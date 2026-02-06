import { populate } from "dotenv"

export const findOne=async ({
    model,select='',filter={},options={}
}={})=>{
    const doc = model.findOne(filter)
    if(select?.length){
        doc.select(select)
    }
    if(options.populate){
        doc.populate(populate)
    }
    if(options.leen){
        doc.lean()
    }

    return await doc.exec()
}


 export const create =async ({model,data,options={validateBeforeSave:true}}={})=>{
    return await model.create(data,options)
}


 export const createOne =async ({model,data,options={validateBeforeSave:true}}={})=>{
    const [doc] =await create({model,data,options})
    return doc
}