import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {

name: {type:String,required:true}  ,
description:{type:String,required:true},
price:{type:Number,requred:true},
image:{type:String,required:true},
category:{type:String,required:true},
quantity:{type:String,rquired:true},
stockCount:{type:Number,required:true},



    },
    {timestamps:true})
export default mongoose.model("Product",productSchema)