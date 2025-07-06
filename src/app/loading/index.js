import React from 'react'
import  Loading  from 'react-fullscreen-loading';
// import ReactLoading from 'react-loading';
const Loader = () => {
  return (
    // <ReactLoading  type='cubes' color={"green"} loaderColor="#f55d2c" height={'10%'} width={'10%'} />
    <Loading loading   loaderColor="#f55d2c" />
    // background="#e75a12c7" loaderColor="#e75a12"
  )
}

export default Loader