import React,{useEffect,useState} from "react";
import { useParams ,useNavigate} from "react-router-dom";
import toast,{Toaster} from 'react-hot-toast'
import './Register.css'
import API from "../api/Axios";
function Register(){
    const [name,setName]=useState('')
    const [place,setPlace]=useState('')
    const [address,setAddress]=useState('')
    const {id} =useParams()
    const navigate=useNavigate()
    const [suLoading,setSuLoading]=useState('')
    const submit=()=>{
        
        if(suLoading)
         return;
        setSuLoading(true)
        try{
        API.post('/register',{
            name,
            place,
            address,
            bookId:id
        },{withCredentials:true})
        .then((res)=>{
            console.log("reg is workking",res.data)
            toast.success("Registration Is Successfully!")
            setName('')
            setAddress('')
            setPlace('')
            
         if(res.data.status){
              navigate('/tabel')
              console.log("status",res.data.status)
              
         }else{
            toast.error(res.data.message)
         }
        })
    }catch(err){
            console.log("reg is some problams",err)
            toast.error(err.response?.data?.error ||"You Alrady Used ")
        }
    }
    const handleSubmit=(e)=>{
        e.preventDefault()
        submit()
        
    }
    useEffect(()=>{
      
},[])
    return(
        <div className="form-register-parent">
            <Toaster position="top-center" reverseOrder={false} />
          
          <form action="" className="register-row" onSubmit={handleSubmit}>
            <h2 className="register-row-h2" >Book Registration</h2>
            <div className="mb-3">
            <div className="form-group">
            <label htmlFor="" className="label-register">Name</label><br />
             <input 
             type="text"
             value={name}
             onChange={(e)=>setName(e.target.value)}
             placeholder="Name"
             required
             className="register-in"
             />
             </div>
             </div>
             <div className="mb-3">
             <div className="form-group">
             <label htmlFor="" className="label-register">Place</label><br />
             <input type="text"
             value={place}
             onChange={(e)=>setPlace(e.target.value)}
            className="register-in"
            placeholder="Place"
             />
             </div>
             </div>
             <div className="mb-3">
             <div className="form-group">
             <label htmlFor="" className="label-register">Address</label><br />
             <input type="text" 
             value={address}
             onChange={(e)=>setAddress(e.target.value)}
             required
             placeholder="Address"
             className="register-in"
             />
             
             </div>
</div>
             <button className="register-btn" onClick={()=>submit()} type="submit">Submit</button><br />
          </form>
       <div className="btn-container">

        <div className="btn-row">
           
        </div>
       </div>
         
        </div>
        

    )
}
export default Register;