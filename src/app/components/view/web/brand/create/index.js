import React, { Component } from 'react';
import styles from './index.module.scss'
import { brandApi } from '../../../../services/brandApi';
import { Navigate } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../../loading';

class Create extends Component {
   
constructor(){
    super();
    this.state={
        name:"",
        slug:"",
        redirect:false
    }
}

    handleInput=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    
createstate = () => {
  const { name, slug } = this.state;
  const data = { name, slug };

  this.setState({ loading: true });

  brandApi.create(data)
    .then(response => {
      if (response) {
        NotificationManager.success(response.mess);
        this.setState({ redirect: true });
      }
    })
    .catch(err => {
      console.error("Create state failed:", err);
      NotificationManager.error("Failed to create state");
    })
    .finally(() => {
      this.setState({ loading: false });
    });
}

    render() { 
        const {createstate,handleInput} =this;
             
      if (this.state.loading) {
      return <Loader />
    }
        return ( 
            <div>
             <div className={styles.create}>
            <h3>Add state</h3>
            <label htmlFor="">Name*</label>
            <input type="text" name="name" placeholder='brand name' onChange={(e) => {handleInput(e) }} />
            {/* <div> */}
            <label htmlFor="">Slug*</label>
            <input type="text" name="slug" placeholder='brand slug' onChange={(e) => {handleInput(e) }} />
            {/* </div> */}
            <button className="submit" onClick={createstate}>Add New</button>
          </div>
          {
            this.state.redirect && <Navigate to={'/brand/brand-list'} replace={false} />
          }
            </div>
         );
    }
}
 
export default Create;
