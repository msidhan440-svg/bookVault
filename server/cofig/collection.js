const { ObjectId } = require('mongodb');
const mongoose=require('mongoose')
const topCollectionSchema=new mongoose.Schema({
            bookName:String,
            name:String,
            category:String,
            address:String,
            profileImage:String,
            borrowDate:{ type: Date, default: Date.now },
            dueDate:{ type: Date },
            status:{ type: String, default: 'Active' },
             userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Admin'
            }
           
        })
        const TopCollection=mongoose.model('topCollections',topCollectionSchema)

    const UserSchema=new mongoose.Schema({
        name:String,
        price:String,
        category:String,
        userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Admin'
            }
    });
     const User =mongoose.model('User',UserSchema)
     
    const AdminSchema=new mongoose.Schema({
            username:String,
            password:String,
            email:String,
            image:String
           
           
        });
        const Admin=mongoose.model('Admin',AdminSchema)

      

const RegisterSchema=new mongoose.Schema({
    name:String,
    place:String,
    address:String,
   bookId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'users',

    
   },
    userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Admin'
            }
});
const Register =mongoose.model('Register',RegisterSchema)

        module.exports={
            TopCollection,
            User,
            Register,
            Admin,

        }

        