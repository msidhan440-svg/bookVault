import axios from "axios";

const API=axios.create({
    baseURL:'https://bookvault-ugyu.onrender.com/api',
    withCredentials:true
})
export default API;