const express =require('express');
const mongoose=require('mongoose');
const router=express.Router('');
const app = express();
const adminHelpers = require('../connect/admin-helpers')
const route =require('../routes/users')
const multer = require('multer')
const path = require('path');
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')
const { profileEnd } = require('console');
const { imageDelete } = require('../connect/user-helper');
   
     cloudinary.config({
      cloud_name:'viuldfvw',
      api_key:'958278575139294',
      api_secret:'4XW70TQDdFj2XzLhJu5NJf3dO9o'
     });
     const storageImg = new CloudinaryStorage({
      cloudinary:cloudinary,
     params:{
      folder:'profile-image',
      allowed_formats:['jpg','png','jpeg']
     }
     })
     const upload = multer({storage:storageImg})
router.post('/signing',async(req,res)=>{
    try{
       
      const data =req.body
      const result= await adminHelpers.doSignup(data)
      req.session.userId = result._id
      req.session.signup = true
       res.status(200).json({success:true,result })
    }catch(err){
      res.status(500).json(err)
    }
})
router.post('/login',async(req,res)=>{
  try{
    const data =  req.body
    const result = await adminHelpers.doLoging(data)
     
      if(result.status){
        req.session.userId =  result.user._id
        req.session.logged =  true
        res.status(200).json({result,status:true})
        
       
      }else{
        req.session.loginErr= true
        res.status(200).json({status:false})
      }
    
   
    
  }catch(err){
    console.log("err catch",err)
    res.status(500).json({error:err.message})
    
  }
 
} )
router.post('/upload-profile-img',upload.single('image'),async(req,res)=>{
  try{
    console.log("iamage",req.file)
    console.log("body",req.body)
     const profileId = req.body.profileId;
     const imagePath = req.file ? req.file.path:null
     if(!imagePath){
      return res.status(400).json({error:"Image file is required"})
      
     }
     const response = await adminHelpers.profileImageAdd(profileId,imagePath)
     res.json({status:true,response})
  }catch(err){
   res.status(500).json({error:err.message})
   console.log("iamage",req.file)
  }
})
router.get('/admin-image',async(req,res)=>{
  
  try{
      const ImageUserId =  req.session.userId 
      if(!ImageUserId){
        
        return res.status(200).json({image:"",status:false,message:"NO session found"})
      }
      const adminImage = await adminHelpers.getImageAdmin(ImageUserId)
      res.status(200).json({image:adminImage ? adminImage.image  : "",status:true})
  } catch (err) {
    res.status(500).json({ error: err.message, status: false });
  }
});

router.post('/delete-profile-img', async (req, res) => {
  try {
    const profileId = req.body.profileId || req.session.userId;
    if (!profileId) {
      return res.status(400).json({ error: "Profile ID required", status: false });
    }
    const response = await adminHelpers.profileImageDelete(profileId);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message, status: false });
  }
});

module.exports = router;
