// "use client"
import { Axios, routes } from "../../config";
import { getCookie } from "../cookie";
import {error} from "../error";
import axios from "axios";
const imageApi={   

      deleteTeacherPhoto:(data,token)=>{
        let result=  Axios.post(`${routes.upload}`,data,{
            headers: {
                "Authorization": `Bearer ${getCookie(token)}`
              }
        })
          .then(result=>{
              if (result) {
                  return result.data;
              }
              return null;
          }).catch(err=>{
              error(err);
              return
          })
  
          return result;
      },
      deleteFile:(data)=>{
        let result=  Axios.post(`${routes.upload}`,data,{
            headers: {
                "Authorization": `Bearer ${getCookie('token')}`
              }
        })
          .then(result=>{
              if (result) {
                  return result.data;
              }
              return null;
          }).catch(err=>{
              error(err);
              return
          })
  
          return result;
      },
      
      getUploadUrl:(key)=>{
        let result=  Axios.get(`${routes.uploadImg}?key=${key}`)
          .then(result=>{
              if (result) {
                  return result.data;
              }
              return null;
          }).catch(err=>{
              error(err);
              return
          })
  
          return result;
      },

      UploadToS3:(url,image)=>{
        let result=  axios.put(url,image,{headers:{
            "Content-Type":'multipart/form-data',
        }})
          .then(result=>{
              if (result) {
                  return result.data;
              }
              return null;
          }).catch(err=>{
              error(err);
              return
          })
  
          return result;
      },     

}

export{imageApi}