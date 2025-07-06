import { routes } from "../../../config";
import { Axios } from "../axios";
import { error } from "../error";

const productApi = {
    list: () => {
        let result = Axios.get(routes.getProduct)
            .then(result => {
                if (result) {
                    return result.data;
                }
                return null;
            }).catch(err => {
                error(err);
                return
            })

        return result;
    },
    getAllPhotos: () => {
        let result = Axios.get(routes.getAllPhotos)
            .then(result => {
                if (result) {
                    return result.data;
                }
                return null;
            }).catch(err => {
                error(err);
                return
            })

        return result;
    },
    create: (data) => {
        let result = Axios.post(routes.createProduct, data)
            .then(result => {
                if (result) {
                    return result.data;
                }
                return null;
            }).catch(err => {
                error(err);
                return
            })

        return result;
    },
    delete: (id) => {
        let result = Axios.delete(`${routes.deleteProduct}?id=${id}`)
            .then(result => {
                if (result) {
                    return result.data;
                }
                return null;
            }).catch(err => {
                error(err);
                return
            })

        return result;
    },
       deletePhotoById: (id) => {
        let result = Axios.delete(`${routes.deletePhotoById}?id=${id}`)
            .then(result => {
                if (result) {
                    return result.data;
                }
                return null;
            }).catch(err => {
                error(err);
                return
            })

        return result;
    },
    update: (data) => {
        let result = Axios.post(routes.updateProduct, data)
            .then(result => {
                if (result) {
                    return result.data;
                }
                return null;
            }).catch(err => {
                error(err);
                return
            })

        return result;
    },
    getProductById: (id) => {
        let result = Axios.get(`${routes.getProductById}?id=${id}`)
            .then(result => {
                if (result) {
                    return result.data;
                }
                return null;
            }).catch(err => {
                error(err);
                return
            })

        return result;
    },

    imageUpload: (urlData, file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('signature', urlData.signature);
        formData.append('timestamp', urlData.timestamp);
        formData.append('public_id', urlData.public_id);
        formData.append('api_key', urlData.api_key);
        let result = Axios.post(`https://api.cloudinary.com/v1_1/${urlData.cloud_name}/upload`, formData, {
            headers: {
                "Content-Type": 'multipart/form-data',
            }
        })
            .then(result => {
                if (result) {
                    return result.data;
                }
                return null;
            }).catch(err => {
                error(err);
                return
            })

        return result;
    },

    getUploadUrl: () => {
        let result = Axios.get(routes.uploadImg)
            .then(result => {
                if (result) {
                    return result.data;
                }
                return null;
            }).catch(err => {
                error(err);
                return
            })

        return result;
    },

    getImgUrl: (key) => {
        let result = Axios.get(`${routes.getImgUrl}?key=${key}`)
            .then(result => {
                if (result) {
                    return result.data;
                }
                return null;
            }).catch(err => {
                error(err);
                return
            })

        return result;
    },

    uploadMoreImg: (data) => {
        let result = Axios.post(routes.uploadImg, data)
            .then(result => {
                if (result) {
                    return result.data;
                }
                return null;
            }).catch(err => {
                error(err);
                return
            })

        return result;
    },


}

export { productApi }
