import { routes } from "../../../config";
import { Axios } from "../axios";
import { error } from "../error";

export const imgApi = {


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
     deleteImg: (url) => {
        let result = Axios.put(routes.deleteImg,{url})
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
}


