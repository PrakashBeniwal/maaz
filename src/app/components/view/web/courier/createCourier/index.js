import React, { Component } from 'react';
import axios from 'axios';
import styles from './index.module.scss';
import { BiSolidEdit } from 'react-icons/bi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { courierApi } from '../../../../services/courierApi';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../../loading';

export class Courier extends Component {
  state = {
    couriers: [],
    name: '',
    edit: false,
    editId: null,
  };

  componentDidMount() {
    this.fetchCouriers();
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

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async () => {
    const { name, edit, editId } = this.state;

    if (!name.trim()) return alert('Name is required');

    try {
      if (edit) {
        await courierApi.update(editId,{ name });
      } else {
        await courierApi.create({ name });
      }

      this.setState({ name: '', edit: false, editId: null });
      this.fetchCouriers();
    } catch (err) {
      console.error(err);
    }
  };

  handleEdit = (courier) => {
    this.setState({
      name: courier.name,
      edit: true,
      editId: courier.id,
    });
  };

  cancelEdit = () => {
    this.setState({ name: '', edit: false, editId: null });
  };

  handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this courier?')) return;
    try {
      await courierApi.delete(id);
      this.fetchCouriers();
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { couriers, name, edit } = this.state;
  if (this.state.loading) {
     return <Loader />
    }
    return (
      <div className={styles.container}>
        <div className={styles.category}>
          <div className={styles.create}>
            <h3>{edit ? 'Edit Courier' : 'Add Courier'}</h3>
            <label>Name*</label>
            <input
              type="text"
              name="name"
              placeholder="Courier name"
              value={name}
              onChange={this.handleChange}
            />
            <div>
              <button className="submit" onClick={this.handleSubmit}>
                {edit ? 'Update' : 'Add New'}
              </button>
              {edit && (
                <button className="cancel" onClick={this.cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className={styles.list}>
            <h3>All Couriers</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {couriers?.map((courier) => (
                  <tr key={courier.id}>
                    <td>{courier.name}</td>
                    <td>{courier.createdAt?.split('T')[0]}</td>
                    <td className="pointer">
                      <BiSolidEdit onClick={() => this.handleEdit(courier)} />
                      <RiDeleteBinLine onClick={() => this.handleDelete(courier.id)} />
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

export default Courier;

