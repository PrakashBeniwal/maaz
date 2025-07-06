import { routes } from "../../../config";
import { Axios } from "../axios";
import { error } from "../error";

const customerApi={
    list:()=>{
        let result=  Axios.get(routes.customerList)
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
        let result=  Axios.post(routes.customerDelete,id)
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

export{customerApi}