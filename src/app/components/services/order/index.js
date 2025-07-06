import { routes } from "../../../config";
import { Axios } from "../axios";
import { error } from "../error";

export const orderApi = {


  getById: (id) => {
    return Axios.get(`${routes.getOrderById}${id}`)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },

orderByStatus:(status) => {
    return Axios.get(`${routes.orderByStatus}${status}`)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },
  // orderExport:(query) => {
  //   return Axios.get(`${routes.orderExport}?${query.toString()`)
  //     .then(res => res?.data)
  //     .catch(err => {
  //       error(err);
  //       return null;
  //     });
  // },


  list: () => {
    return Axios.get(routes.getAllOrders)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },

   update: (data) => {
    return Axios.put(routes.updateOrder,data)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },
getAllPayments:()=>{
     return Axios.get(routes.getAllPayments)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
},
count:()=>{
     return Axios.get(routes.orderCount)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
}


};

