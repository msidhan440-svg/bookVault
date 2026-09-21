import axios from "axios";


const Api=axios.create({
    baseURL:'https://bookvault-ugyu.onrender.com',// /admin,
     withCredentials:true
})

export default Api;