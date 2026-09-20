const express = require('express')
const bcrypt = require('bcrypt')
const { Admin } = require('../cofig/collection')
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
const fs = require('fs')
const path = require('path')

module.exports = {
    
    doSignup:(data)=>{
        return new Promise(async(resolve,reject)=>{
             try{
                   const existingAdmin = await Admin.findOne({username:data.username,email:data.email})
                      if(existingAdmin){
                        resolve({status:false,message:"This Id already used sorry 😔"})
                        return;
                      }
                    const handlePassword = await bcrypt.hash(data.password,10)
                    const newAdmin= new Admin({
                    username:data.username,
                    email:data.email,
                    password:handlePassword
                   })

                   const result= await newAdmin.save()
                   
                   resolve(result._id)
                   
                  
             }catch(err){
                   reject(err)
             }
        })
     
    },doLoging:(userId)=>{
      return new Promise(async(resolve,reject)=>{
        try{
          const response = {}
            const user =await  Admin.findOne({email:userId.email})
            if(user){
              bcrypt.compare(userId.password,user.password).then((res)=>{
                 
                if(res){
                console.log("Logins is successfully!")
                response.user = user,
                response.status = true
                resolve(response)
               
                }else{
                  console.log("Password is incorect")
                  resolve({status:false})
                }
              })
            }else{
              console.log("reject error")
              resolve({status:false})
              
            }
        }catch(err){
        reject(err)
        }
      })


    },
    profileImageAdd:(profileId,imageId)=>{
      return new Promise(async(resolve,reject)=>{
        try{
             const profileImag = await Admin.findByIdAndUpdate(profileId,{
              $set:{image:imageId}
             })
             resolve(profileImag)
        
        }catch(err){
            reject(err)
        }
      })
    },
    getImageAdmin:(userId)=>{
      return new Promise(async(resolve,reject)=>{
        try{
          const adminId = await Admin.findById({_id:userId})
          if(adminId){
              resolve(adminId)
              
          }  
         
        resolve({image:""})
        }catch(err){
          reject(err)
        }
      })
    },
    profileImageDelete:(profileId)=>{
      return new Promise(async(resolve,reject)=>{
        try{
          const admin = await Admin.findById(profileId)
          if(!admin){
            return resolve({status:false,message:"Admin profile not found"})
          }
          if(admin.image){
            const filePath = path.join(__dirname,'..',admin.image)
            if(fs.existsSync(filePath)){
              fs.unlinkSync(filePath)
            }
          }
          admin.image = ""
          await admin.save()
          resolve({status:true,message:"Profile image deleted successfully"})
        }catch(err){
          reject(err)
        }
      })
    }

}


