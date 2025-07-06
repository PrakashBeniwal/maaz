import React, { Component } from 'react';
import styles from './index.module.scss';
import { bannerApi } from '../../../../services/bannerApi';
import { imgApi } from '../../../../services/imgApi';
import Loader from '../../../../../loading';
import { NotificationManager } from 'react-notifications';
import { Navigate, useParams } from 'react-router-dom';

class UpdateBannerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      imgDesktop: '',
      imgTablet: '',
      imgMobile: '',
      link: '',
      altText: '',
      position: 'main-banner',
      sortOrder: 1,
      isActive: true,
      newFiles: {}, // { imgDesktop: File, imgTablet: File, imgMobile: File }
      loading: true,
      redirect: false,
    };
  }

  componentDidMount() {
    const id = this.props.params.id;
    this.setState({ id });
    bannerApi.getById(id)
      .then((res) => {
        if (res) {
        console.log(res)
          const {
            imgDesktop, imgTablet, imgMobile, link, altText, position, sortOrder, isActive
          } = res.data;
          this.setState({
            imgDesktop, imgTablet, imgMobile,
            link, altText, position, sortOrder, isActive,
            loading: false
          });
        }
      })
      .catch((err) => {
        NotificationManager.error('Failed to load banner');
        this.setState({ loading: false });
      }).finally(()=>{
        this.setState({ loading: false });
        
      })
  }

  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      this.setState((prev) => ({
        newFiles: { ...prev.newFiles, [key]: file }
      }));
    }
  };

  handleToggle = () => {
    this.setState((prev) => ({ isActive: !prev.isActive }));
  };

  uploadImageIfChanged = async (field) => {
    const file = this.state.newFiles[field];
    if (!file) return this.state[field];

    const { data: sigData } = await imgApi.getUploadUrl();
    const result = await imgApi.imageUpload(sigData, file);
      NotificationManager.info(`${field} photo is uploaded`);
    
    return result.secure_url;
  };

  deleteOldImageIfReplaced = async (oldUrl, field) => {
    const file = this.state.newFiles[field];
    if (file && oldUrl) {
      try {
        await imgApi.deleteImg(oldUrl);
      NotificationManager.info(`${field} Old photo is deleted`);
      } catch (err) {
        console.warn(`Failed to delete old ${field}:`, err);
      }
    }
  };

  updateBanner = async () => {
    const { id, link, imgDesktop, newFiles } = this.state;

    // if (!link) {
    //   NotificationManager.error('Link is required');
    //   return;
    // }

    if (!imgDesktop && !newFiles.imgDesktop) {
      NotificationManager.error('imgDesktop is required');
      return;
    }

    this.setState({ loading: true });

    try {
      const newImgDesktop = await this.uploadImageIfChanged('imgDesktop');
      const newImgTablet = await this.uploadImageIfChanged('imgTablet');
      const newImgMobile = await this.uploadImageIfChanged('imgMobile');

      await this.deleteOldImageIfReplaced(this.state.imgDesktop, 'imgDesktop');
      await this.deleteOldImageIfReplaced(this.state.imgTablet, 'imgTablet');
      await this.deleteOldImageIfReplaced(this.state.imgMobile, 'imgMobile');

      const data = {
        imgDesktop: newImgDesktop,
        imgTablet: newImgTablet || null,
        imgMobile: newImgMobile || null,
        link: this.state.link,
        altText: this.state.altText,
        position: this.state.position,
        sortOrder: this.state.sortOrder,
        isActive: this.state.isActive
      };

      await bannerApi.update(id, data);
      NotificationManager.success('Banner updated');
      this.setState({ redirect: true });

    } catch (err) {
      console.error('Update failed:', err);
      NotificationManager.error('Failed to update banner');
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    if (this.state.loading) return <Loader />;
    if (this.state.redirect) return <Navigate to="/banner" replace />;

    const {
      imgDesktop, imgTablet, imgMobile,
      link, altText, position, sortOrder, isActive
    } = this.state;

    return (
      <div className={styles.create}>
        <h3>Update Banner</h3>

        <label>Position</label>
        <select name="position" value={position} onChange={this.handleInput}>
          <option value="main-banner">Main Banner</option>
          <option value="side-banner">Side Banner</option>
          <option value="hot-banner">Hot Banner</option>
          <option value="gear-up-banner">Gear Up Banner</option>
        </select>

        <label>Link*</label>
        <input type="text" name="link" value={link} onChange={this.handleInput} />

        <label>Alt Text</label>
        <input type="text" name="altText" value={altText} onChange={this.handleInput} />

        <label>Sort Order</label>
        <input type="number" name="sortOrder" value={sortOrder} onChange={this.handleInput} />

      <div className={styles['checkbox-container']}>
  <input
    type="checkbox"
    checked={isActive}
    onChange={this.handleToggle}
    id="isActive"
  />
  <label htmlFor="isActive">Status</label>
</div>


        <label>Image Desktop* (current: {imgDesktop ? "✔️" : "❌"})</label>
        <input type="file" accept="image/*" onChange={(e) => this.handleFileChange(e, 'imgDesktop')} />

        <label>Image Tablet (current: {imgTablet ? "✔️" : "❌"})</label>
        <input type="file" accept="image/*" onChange={(e) => this.handleFileChange(e, 'imgTablet')} />

        <label>Image Mobile (current: {imgMobile ? "✔️" : "❌"})</label>
        <input type="file" accept="image/*" onChange={(e) => this.handleFileChange(e, 'imgMobile')} />

        <button className='update' onClick={this.updateBanner}>Update Banner</button>
      </div>
    );
  }
}

const UpdateBanner = () => {
  const params = useParams();
  return <UpdateBannerComponent params={params} />;
};

export default UpdateBanner;

