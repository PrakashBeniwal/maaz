import React, { Component } from 'react';
import styles from './index.module.scss'
import Select from 'react-select';
import { cityApi } from '../../../../services/areaApi';
import { stateApi } from '../../../../services/stateApi';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../../loading';
import { Navigate } from 'react-router-dom';

class Create extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            status: 1,
            redirect: false,
            stateId: null,
            loading:false
        }
    }

  getstate = () => {
  this.setState({ loading: true });
  stateApi.list()
    .then(list => {
      if (list) {
        this.setState({ stateList: list.list });
      }
    })
    .catch(err => {
      console.error("Failed to fetch states:", err);
      NotificationManager.error("Failed to fetch states");
    })
    .finally(() => {
      this.setState({ loading: false });
    });
}

createcity = () => {
  const { name, status, stateId } = this.state;
  const data = { name, status, stateId };

  this.setState({ loading: true });

  cityApi.create(data)
    .then(response => {
      if (response) {
        NotificationManager.success(response.mess);
        this.setState({ redirect: true });
      }
    })
    .catch(err => {
      console.error("Failed to create city:", err);
      NotificationManager.error("Failed to create city");
    })
    .finally(() => {
      this.setState({ loading: false });
    });
}


    componentDidMount() {
        this.getstate();
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleStatus = (e) => {
        this.setState({
            status: e.value
        })
    }


    handlestate = (e) => {
        this.setState({
            stateId: e.value
        })
    }



    options = [
        {
            "label": "Active", "value": "1"
        },
        {
            "label": "InActive", "value": "0"
        },
    ]

    Array = (data, label, value) => {
        const arrayItems = [];
        if (data && Array.isArray(data)) {
            data.map(items => {
                return (
                    arrayItems.push({ label: items[label], value: items[value] })
                )
            })
        }
        return arrayItems;
    }
    render() {
        const { createcity, handleStatus, handleInput, handlestate } = this;
                
      if (this.state.loading) {
      return <Loader />
      }
      
        return (
            <div>
                <div className={styles.create}>
                    <h3>Add city</h3>
                    <label htmlFor="">Name*</label>
                    <input type="text" name="name" placeholder='city name' onChange={(e) => { handleInput(e) }} />
                    <div>
                        <label htmlFor="">Status*</label>
                        <Select options={this.options} defaultInputValue='Active' onChange={(e) => { handleStatus(e) }} />
                    </div>

                    <div>
                        <label htmlFor="">state*</label>
                        <Select options={this.Array(this.state.stateList, "name", "id")} onChange={(e) => { handlestate(e) }} />
                    </div>
                    <button className="submit" onClick={createcity}>Add New</button>
                </div>
                {
            this.state.redirect && <Navigate to={'/city/city-list'} replace={false} />
          }
      
            </div>
        );
    }
}

export default Create;
