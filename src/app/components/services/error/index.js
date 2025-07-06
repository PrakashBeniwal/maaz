import { NotificationManager } from 'react-notifications';


const error=(err)=>{
     if (err.response?.data?.mess?.parent) {
        NotificationManager.error(err.response.data?.mess?.parent?.sqlMessage);
        console.log(err)
        return;
    }
     else if (err.response?.data?.status==500) {
        NotificationManager.error(err.response.data?.statusText);
        console.log(err)
        return;
    }
    
   else if (err.response?.data) {
        NotificationManager.error(err?.response?.data?.mess);
        console.log('hi')
        console.log(err)
        return;
    }
    else if (err.message) {
        NotificationManager.error(err.message);
        return;
    }
}

export{error};
