import React, { Component } from 'react';
import styles from './index.module.scss';
import Select from 'react-select';
import axios from 'axios';
import { BiSolidEdit } from 'react-icons/bi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { cityApi } from '../../../../services/areaApi';
import { stateApi } from '../../../../services/stateApi';
import { courierApi } from '../../../../services/courierApi';
import {formatDate} from '../../../../services/formatDate';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../../loading';

export class CourierPricing extends Component {
  state = {
    couriers: [],
    states: [],
    cities: [],
    courierPricings: [],
    selectedCourier: null,
    selectedState: null,
    selectedCity: null,
    price: '',
    estimatedDays: '',
    edit: false,
    editId: null,
  };

  componentDidMount() {
    this.fetchCouriers();
    this.getstate();
    this.fetchCourierPricings();
  }
   fetchCouriers = () => {
  this.setState({ loading: true });
  courierApi.list()
    .then(list => {
      if (list) {
        this.setState({ couriers: list.data });
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

 fetchCourierPricings = () => {
  this.setState({ loading: true });
  courierApi.priceList()
    .then(list => {
    console.log(list)
    
      if (list) {
        this.setState({ courierPricings: list.data });
      }
    })
    .catch(err => {
      console.error("Failed to fetch courierPrice:", err);
      NotificationManager.error("Failed to fetch courierPrice");
    })
    .finally(() => {
      this.setState({ loading: false });
    });
}

   getstate = () => {
  this.setState({ loading: true });
  stateApi.list()
    .then(list => {
      if (list) {
        this.setState({ states: list.list });
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

  fetchCities = async (stateId) => {
     this.setState({ loading: true });
  cityApi.getCitiesBySateId(stateId)
    .then(list => {
      if (list) {
        this.setState({ cities: list.data?.cities });
      }
    })
    .catch(err => {
      console.error("Failed to fetch states:", err);
      NotificationManager.error("Failed to fetch states");
    })
    .finally(() => {
      this.setState({ loading: false });
    });
  };



  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCourierSelect = (selectedCourier) => this.setState({ selectedCourier });
  handleStateSelect = (selectedState) => {
    this.setState({ selectedState, selectedCity: null });
    if (selectedState) this.fetchCities(selectedState.value);
  };
  handleCitySelect = (selectedCity) => this.setState({ selectedCity });

  handleSubmit = async () => {
    const {
      selectedCourier,
      selectedState,
      selectedCity,
      price,
      estimatedDays,
      edit,
      editId,
    } = this.state;

    if (!selectedCourier || !selectedState || !selectedCity || !price || !estimatedDays) {
      return alert('Please fill all required fields');
    }

    const payload = {
      courierId: selectedCourier.value,
      cityId: selectedCity.value,
      price,
      estimatedDays,
    };

    try {
      if (edit) {
        await courierApi.updatePrice(editId, payload);
      } else {
        await courierApi.createPrice(payload);
      }

      this.setState({
        selectedCourier: null,
        selectedState: null,
        selectedCity: null,
        price: '',
        estimatedDays: '',
        edit: false,
        editId: null,
      });

      this.fetchCourierPricings();
    } catch (err) {
      console.error(err);
    }
  };

  handleEdit = (item) => {
    this.setState({
      selectedCourier: { label: item.courier.name, value: item.courier.id },
      selectedState: { label: item.city.state.name, value: item.city.state.id },
      selectedCity: { label: item.city.name, value: item.city.id },
      price: item.price,
      estimatedDays: item.estimatedDays,
      edit: true,
      editId: item.id,
    });

    this.fetchCities(item.city.state.id);
  };

  handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this courier?')) return;
  
    try {
      this.setState({ loading: true });
      await courierApi.deletePriceList(id);
      this.fetchCourierPricings();
    } catch (err) {
      console.error(err);
    } finally{
      this.setState({ loading: false });
    }
  };

  cancelEdit = () => {
    this.setState({
      selectedCourier: null,
      selectedState: null,
      selectedCity: null,
      price: '',
      estimatedDays: '',
      edit: false,
      editId: null,
    });
  };

  mapToOptions = (data, label, value) =>
    Array.isArray(data) ? data.map((item) => ({ label: item[label], value: item[value] })) : [];

  render() {
    const {
      couriers,
      states,
      cities,
      courierPricings,
      selectedCourier,
      selectedState,
      selectedCity,
      price,
      estimatedDays,
      edit,
    } = this.state;

   if (this.state.loading) {
     return <Loader />
    }
    
    return (
      <div className={styles.container}>
        <div className={styles.category}>
          <div className={styles.create}>
            <h3>{edit ? 'Edit Pricing' : 'Add Courier Pricing'}</h3>

            <label>Courier*</label>
            <Select options={this.mapToOptions(couriers, 'name', 'id')} value={selectedCourier} onChange={this.handleCourierSelect} />

            <label>State*</label>
            <Select options={this.mapToOptions(states, 'name', 'id')} value={selectedState} onChange={this.handleStateSelect} />

            <label>City*</label>
            <Select options={this.mapToOptions(cities, 'name', 'id')} value={selectedCity} onChange={this.handleCitySelect} />

            <label>Base Price*</label>
            <input type="number" name="price" value={price} onChange={this.handleChange} placeholder="e.g. 100" />

            <label>Estimated Days*</label>
            <input type="number" name="estimatedDays" value={estimatedDays} onChange={this.handleChange} placeholder="e.g. 3" />

            <div>
              <button className="submit" onClick={this.handleSubmit}>{edit ? 'Update' : 'Add New'}</button>
              {edit && <button className="cancel" onClick={this.cancelEdit}>Cancel</button>}
            </div>
          </div>

          <div className={styles.list}>
            <h3>All Courier Pricing</h3>
            <table>
              <thead>
                <tr>
                  <th>Courier</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Price</th>
                  <th>Days</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courierPricings.map((item) => (
                  <tr key={item.id}>
                    <td>{item.courier?.name}</td>
                    <td>{item.city?.state?.name}</td>
                    <td>{item.city?.name}</td>
                    <td>{item.price}</td>
                    <td>{item.estimatedDays}</td>
                    <td>{formatDate(item.createdAt)}</td>
                    <td className="pointer">
                      <BiSolidEdit onClick={() => this.handleEdit(item)} />
                      <RiDeleteBinLine onClick={() => this.handleDelete(item.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default CourierPricing;

