import { routes } from "../../../config";
import { Axios } from "../axios";
import { error } from "../error";

export const courierApi = {
  // courier CRUD
  
  create: (data) => {
    return Axios.post(routes.createCourier, data)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },

  update: (id, data) => {
    return Axios.put(`${routes.updateCourier}${id}`, data)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },

  getById: (id) => {
    return Axios.get(`${routes.getCourierById}${id}`)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },

  list: () => {
    return Axios.get(routes.getCourier)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },
    priceList: () => {
    return Axios.get(routes.courierPriceList)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },
    createPrice: (data) => {
    return Axios.post(routes.courierPriceCreate,data)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },
  updatePrice: (id,data) => {
    return Axios.put(`${routes.courierPriceUpdate}${id}`, data)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },
    deletePriceList: (id) => {
    return Axios.delete(`${routes.courierPriceDelete}${id}`)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },
  
  delete: (id) => {
    return Axios.delete(`${routes.deleteCourier}${id}`)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },

};

