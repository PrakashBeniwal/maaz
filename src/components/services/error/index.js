import Toast from "../notification";

const error=(err)=>{
    if (err.response?.data) {
        Toast(
            "Server Message!!",err.response.data?.mess,"info"
        )
        return;
    }
    else if (err.message) {
        Toast(
            "Server Message!!",err.message,"info"
        )
        return;
    }
}

export  {error};
