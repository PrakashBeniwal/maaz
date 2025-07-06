import React, { Component } from 'react';
import styles from './index.module.scss'
import Select from 'react-select';
import { stateApi } from '../../../../services/stateApi';
import { Navigate } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../../loading';

class Create extends Component {
   
constructor(){
    super();
    this.state={
        name:"",
        status:1,
        redirect:false,
        loading:false
    }
}

    handleInput=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleStatus=(e)=>{
        this.setState({
            status:e.value
        })
    }    
    
createstate = () => {
  const { name, status } = this.state;
  const data = { name, status };

  this.setState({ loading: true });

  stateApi.create(data)
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

    options=[
        {
            "label":"Active","value":"1"
        },
        {
            "label":"inActive","value":"0"
        },
    ]


    render() { 
        const {createstate,handleStatus,handleInput} =this;
             
      if (this.state.loading) {
      return <Loader />
    }
        return ( 
            <div>
             <div className={styles.create}>
            <h3>Add state</h3>
            <label htmlFor="">Name*</label>
            <input type="text" name="name" placeholder='state name' onChange={(e) => {handleInput(e) }} />
            <div>
            <label htmlFor="">Status*</label>
            <Select options={this.options} defaultInputValue='Active' onChange={(e)=>{handleStatus(e)}} />
            </div>
            <button className="submit" onClick={createstate}>Add New</button>
          </div>
          {
            this.state.redirect && <Navigate to={'/state/state-list'} replace={false} />
          }
            </div>
         );
    }
}
 
export default Create;
