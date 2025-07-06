import { routes } from "../../../config";
import { Axios } from "../axios";
import { error } from "../error";

const cityApi={
    list:()=>{
        let result=  Axios.get(routes.getcity)
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
    create:(data)=>{
        let result=  Axios.post(routes.createcity,data)
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
    delete:(id)=>{
        let result=  Axios.post(`${routes.deletecity}?id=${id}`)
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
    update:(data)=>{
        let result=  Axios.post(routes.updatecity,data)
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
         getCitiesBySateId:(id)=>{
        let result=  Axios.get(`${routes.getCitiesBySateId}${id}`)
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

export{cityApi}
