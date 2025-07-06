import React, { Component } from 'react';
import styles from './index.module.scss';
import { bannerApi } from '../../../../services/bannerApi';
import Loader from '../../../../../loading';
import { RiDeleteBinLine } from 'react-icons/ri';
import { BiSolidEdit } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banners: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchBanners();
  }

  fetchBanners = async () => {
    this.setState({ loading: true });
    try {
      const response = await bannerApi.list();
      if (response) {
        this.setState({ banners: response.data || [] });
      }
    } catch (error) {
      console.error("Failed to fetch banners", error);
      NotificationManager.error("Failed to load banners");
    } finally {
      this.setState({ loading: false });
    }
  };

  handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    this.setState({ loading: true });
    try {
      const result = await bannerApi.delete(id);
      if (result?.success) {
        NotificationManager.success("Banner deleted successfully");
        this.fetchBanners();
      } else {
        NotificationManager.error("Failed to delete banner");
      }
    } catch (err) {
      console.error("Delete error:", err);
      NotificationManager.error("Error deleting banner");
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { banners, loading } = this.state;

    if (loading) return <Loader />;

    return (
      <div className={styles.bannerList}>
        <h3>All Banners</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Link</th>
              <th>Desktop</th>
              <th>Mobile</th>
              <th>Tablet</th>
              <th>Sort Order</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr key={banner.id}>
                <td>{index + 1}</td>
                <td>{banner.position}</td>
                <td>{banner.link}</td>
                <td>{banner.imgDesktop && <img src={banner.imgDesktop} alt="Desktop" />}</td>
                <td>{banner.imgMobile && <img src={banner.imgMobile} alt="Mobile" />}</td>
                <td>{banner.imgTablet && <img src={banner.imgTablet} alt="Tablet" />}</td>
                <td>{banner.sortOrder}</td>
                <td>{banner.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <RiDeleteBinLine
                    onClick={() => this.handleDelete(banner.id)}
                    className={styles.deleteIcon}
                  />
                        <Link to={`/banner/update/${banner.id}`}><BiSolidEdit /></Link>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default List;

