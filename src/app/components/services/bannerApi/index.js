import { routes } from "../../../config";
import { Axios } from "../axios";
import { error } from "../error";

export const bannerApi = {
  // Product CRUD
  create: (data) => {
    return Axios.post(routes.createBanner, data)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },

  update: (id, data) => {
    return Axios.put(`${routes.updateBanner}${id}`, data)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },

  getById: (id) => {
    return Axios.get(`${routes.getBannerById}${id}`)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },

  list: () => {
    return Axios.get(routes.getBanner)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },

  delete: (id) => {
    return Axios.delete(`${routes.deleteBanner}${id}`)
      .then(res => res?.data)
      .catch(err => {
        error(err);
        return null;
      });
  },

};

