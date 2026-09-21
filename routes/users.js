const express =require('express');
const mongoose=require('mongoose');
const userHelpers =require('../connect/user-helper')
const router=express.Router('');
const app = express();
const {User,TopCollection,Admin}=require('../cofig/collection')
const multer = require('multer')
const path =require('path')
const {ObjectId} = require('mongodb');
const { profile } = require('console');
const verfy = (req,res,next)=>{
    if(req.session.logged){
        next()
    }else{
        res.status(200).json({loginStatus:false})
       
    }
    
}
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname))
    }
})
const upload= multer({storage:storage})
    
    router.post('/user',verfy,async (req,res)=>{
        try{
           const userId = req.session.userId;
            const newUser= new User({...req.body,
                userId:userId
        })
            await newUser.save()
            
            res.status(201).json({message:"Data saved",newUser,loginStatus:true})
           
        }catch(error){  
            res.status(500).json({error:error.message})     
            console.error("data no",error)
        }
    });
    router.get('/user',verfy,async (req,res)=>{
     try{
             const userIdbook = req.session.userId
             const books = await userHelpers.getBooks(userIdbook)
             res.status(200).json({users:books,loginStatus:true})
     }catch(error){
        res.status(500).json({error:error.message})
     }
    })
    router.get('/register/:id',async (req,res)=>{
        try{
            
            const bookId=req.params.id;
            const registerData=await userHelpers.getRegisterDetials(bookId)
            
            if(registerData){
                return res.status(200).json({
                isAlredyRegistered:true,
                userName:registerData.name,
                data:registerData
                  
                })
            }else{
                return res.status(200).json({
                   isAlredyRegistered:false
                })
            }
        }catch(error){
            res.status(500).json({error:error.message})
        }
           })

    router.post('/register',async (req,res)=>{
       try{
        
        const registeUserId = req.session.userId
        const result= await userHelpers.doRegister(req.body,registeUserId) 
       
         res.status(200).json(result)
         
       }catch(error){
        res.status(400).json({error:error.message})
       }
    })
    router.get('/reject/:id',async (req,res)=>{
        try{
       const rejectuser = req.session.userId
       const bookId = req.params.id
        const result=await userHelpers.rejectAndToplist(bookId,rejectuser)
       
        if(result){
             res.status(200).json({result,
              isDeleted:true

        })
        }
        }catch(error){
            res.status(400).json({error:error.message})
        }
    })
   
    router.get('/top-collection',verfy,async(req,res)=>{
    try{
    const topUserId = req.session.userId
    const groupedTop=await userHelpers.getGrouped(topUserId)
    res.status(200).json({result:groupedTop,loginStatus:true})
    }catch(error){
        res.status(500).json({error:error.message})
        console.log(error)

    }
    

    })
    router.post('/upload-image',upload.single('image'),async(req,res)=>{
        try{
            const userId=req.body.userId;
            const imageFile=req.file?req.file.filename:null
              if(!userId || !imageFile){
                return res.status(400).json({succuss:false,message:"User id or image is missing"})
              }
              const response = await userHelpers.updateUserImage(userId,imageFile)
              res.status(200).json({success:true,message:"Image uploaded",data:response})
        }catch(err){
            console.log("Error in uploaded:",err)
            res.status(500).json({succuss:false,error:err.message})
        }
    })
    router.post('/delete-image',async(req,res)=>{
        try{
           const {userId}=req.body;
          
           const result =userHelpers.imageDelete(userId)
           res.status(200).json({success:true,data:result})
        }catch(err){
            console.error("Error deleting image",err)
            res.status(500).json({success:false,error:err.message})
        }
    })
    router.post('/update-schedule', async (req, res) => {
        try {
            const { scheduleId, dueDate, status } = req.body;
            if (!scheduleId) {
                return res.status(400).json({ success: false, message: "scheduleId is required" });
            }
            const updateData = {};
            if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
            if (status !== undefined) updateData.status = status;

            const response = await userHelpers.updateBookSchedule(scheduleId, updateData);
            res.status(200).json({ success: true, message: "Schedule updated successfully", data: response });
        } catch (err) {
            console.error("Error updating schedule", err);
            res.status(500).json({ success: false, error: err.message });
        }
    });
    
    router.get('/profile',async(req,res)=>{
        try{
        const userData= req.session.userId
        const user = await Admin.findOne({_id:userData})
        if(userData){
            
            res.status(200).json({userName :user ? user.username : null ,profileStatus:true,user_id:user ? user._id : null})
        }else{
              res.json({userName:"",profileStatus:false})
        }
       
        }catch(err){
            console.log("catch error in profile",err)
            res.status(500).json(err)
        }
        
    })
    router.get('/logout',async(req,res)=>{
        try{
       req.session.destroy((err)=>{
        if(err){
            console.log(err,"error")
            res.json({logoutStatus:false})
        }else{
            res.json({logoutStatus:true})
        }

       })
       }catch(err){
        console.log("logout error")
        res.status.apply(500).json(err)
       }
       
    })

    router.delete('/delete-book/:id', verfy, async (req, res) => {
        try {
            const bookId = req.params.id;
            const result = await userHelpers.deleteBook(bookId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.put('/update-book/:id', verfy, async (req, res) => {
        try {
            const bookId = req.params.id;
            const { name, category, price } = req.body;
            const result = await userHelpers.updateBook(bookId, { name, category, price });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    module.exports=router;
