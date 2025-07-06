import { routes } from "../../../config";
import { Axios } from "../axios";
import { error } from "../error";

const brandApi={
    list:()=>{
        let result=  Axios.get(routes.getbrand)
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
    listById:(id)=>{
        let result=  Axios.get(`${routes.getbrandById}?id=${id}`)
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
        let result=  Axios.post(routes.createbrand,data)
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
        let result=  Axios.post(`${routes.deletebrand}?id=${id}`)
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
        let result=  Axios.post(routes.updatebrand,data)
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

export{brandApi}