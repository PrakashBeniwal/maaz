import { routes } from "../../../config";
import { Axios } from "../axios";
import { error } from "../error";

const stateApi={
    list:()=>{
        let result=  Axios.get(routes.getstate)
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
        let result=  Axios.post(routes.createstate,data)
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
        let result=  Axios.post(`${routes.deletestate}?id=${id}`)
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
        let result=  Axios.post(routes.updatestate,data)
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

export{stateApi}