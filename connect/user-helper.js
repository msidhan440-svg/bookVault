const express =require('express')
const mongoose=require('mongoose');
const {TopCollection,User,Register,Admin}=require('../cofig/collection');
const { ObjectId } = require('mongodb');
const path =require ('path')
const fs =require('fs');
const { resolve } = require('dns');
const { json } = require('stream/consumers');
module.exports={
    
    doRegister:(userData,userId)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const existingUser= await Register.findOne({
                bookId:userData.bookId}
            )
              
            if(existingUser){
                return reject(new Error("This User Alredy Used"))

            }else{
                
            }
            const newRegister= new Register({...userData,userId:new ObjectId( userId)})
            const saveData= await newRegister.save()
            resolve({status:true,data:saveData})
            
        }catch(error){
            reject(error)
        }
    })

},
       getRegisterDetials:(bookId)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                
                const existingData=await Register.findOne({bookId:bookId});
                resolve(existingData)
            }catch(error){
                reject(error)
            }
        })
       },
    rejectAndToplist:(bookId,userId)=>{
      return new Promise(async(resolve,reject)=>{
      
        try{
              console.log("12345",userId)
            //const userIdCheck = Admin.findById({_id:rejectUserId})
            const bookData= await Register.findOne({bookId:bookId})
            const bookDeatials=await User.findOne({_id:bookId});
            console.log("book detials",bookDeatials)
            if(bookData){
               
                const defaultDueDate = new Date();
                defaultDueDate.setDate(defaultDueDate.getDate() + 14); // 14-day schedule by default

                const topData=new TopCollection({
                    bookName:bookDeatials? bookDeatials.name:"N/A",
                    category:bookDeatials ? bookDeatials.category:'N/A',
                    name:bookData.name,
                    address:bookData.address,
                    borrowDate: new Date(),
                    dueDate: defaultDueDate,
                    status: 'Active',
                    userId:userId
     
            })
                await topData.save()
                await Register.findOneAndDelete({bookId:bookId})
                resolve({status:true,message:"Data moved in topcollection"})
               

                   
            }else{
                resolve({status:false,message:"Item not found"})
            }
        }catch(error){
            reject(error)
        }
      })
     
     },
     
     getGrouped:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                 const data=await TopCollection.aggregate([
                     {
                        $match:{userId:new ObjectId(userId)}
                     },
                    {
                        $group:{
                            _id:"$name",
                            first: { $first: "$address"},
                        
                        totalBookCount:{
                            $sum:1
                        },
                        profileImage:{$first:"$profileImage"},
                       
                        books:{
                            $push:{
                                _id: "$_id",
                                bookName: "$bookName",
                                category: "$category",
                                borrowDate: "$borrowDate",
                                dueDate: "$dueDate",
                                status: "$status"
                            }
                        },
                       
                    }
                    },
                    {
                        $sort:{totalBookCount:-1}
                    }
                 ])
                 resolve(data)
            }catch(error){
                reject(error)
            }
        })
     },
     updateUserImage:(userId,image)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const updataUser=await TopCollection.findOneAndUpdate(
                    {name:userId},
                    {$set:{profileImage:image}},
                    {userId:userId},
                    {returnDocument:'after'}
                );
                resolve(updataUser)
            }catch(err){
                reject(err)
            }
        })
     },
     imageDelete:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const user = await TopCollection.findOne({name:userId})
                if(!user){
                    return resolve ({success:false,message:"user not found"})
                }
                if(user.profileImage){
                    const filePath= path.join(__dirname,'../uploads',user.profileImage)
                    if(fs.existsSync(filePath)){
                        fs.unlinkSync(filePath)
                    }
                }
                user.profileImage="";
                await user.save()
                resolve({success:true,message:"Image deleted successfully"})
            }catch(err){
                reject(err)
            }
            
        })
     },
     updateBookSchedule:(scheduleId, updateData)=>{
        return new Promise(async(resolve, reject)=>{
            try{
                const updated = await TopCollection.findByIdAndUpdate(
                    scheduleId,
                    { $set: updateData },
                    { new: true }
                );
                resolve(updated);
            }catch(err){
                reject(err);
            }
        });
     },
     getBooks:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let books = await User.find({userId:new ObjectId(userId)})
                if(books){
                     resolve(books)
                }
               resolve({status:false})
            }catch(err){
             return reject(err)
            }
        })
     },
     deleteBook:(bookId)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const deletedBook = await User.findByIdAndDelete(bookId);
                await Register.findOneAndDelete({bookId: bookId});
                resolve({success:true, message:"Book deleted successfully", deletedBook});
            }catch(err){
                reject(err);
            }
        });
     },
     updateBook:(bookId, updateData)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const updatedBook = await User.findByIdAndUpdate(
                    bookId,
                    {$set: updateData},
                    {new: true}
                );
                resolve({success:true, message:"Book updated successfully", updatedBook});
            }catch(err){
                reject(err);
            }
        });
     }
} 
