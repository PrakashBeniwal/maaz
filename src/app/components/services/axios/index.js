import axios from "axios";
import { API } from "../../../config";

const Axios=axios.create({
    baseURL:API,
    headers:{
        "Content-Type":'application/json',
        // "Access-Control-Allow-Origin":"*"
    }
})

export{Axios};