import React, { Component } from 'react';
import styles from './index.module.scss';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../../loading';
import { bannerApi } from '../../../../services/bannerApi'; // your API service
import { imgApi } from '../../../../services/imgApi'; // your API service
import { Navigate } from 'react-router-dom';

class Create extends Component {
  state = {
    position: 'main-banner',
    imgDesktopFile: null,
    imgTabletFile: null,
    imgMobileFile: null,
    imgDesktopUrl: '',
    imgTabletUrl: '',
    imgMobileUrl: '',
    link: '',
    altText: '',
    loading: false,
    redirect:false
  };

  handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      this.setState({ [`${name}File`]: files[0] });
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  uploadSingleImage = async (file) => {
    if (!file) return null;

    try {
      // Get signed URL or signature from your backend
      const { data: sigData } = await imgApi.getUploadUrl();

      // Upload file to Cloudinary (adjust your productApi or bannerApi accordingly)
      const uploadResult = await imgApi.imageUpload(sigData, file);
      NotificationManager.info('Image upload successfully');
      
      return uploadResult.secure_url;
    } catch (err) {
      console.error('Image upload failed:', err);
      NotificationManager.error('Image upload failed');
      throw err;
    }
  };

  handleSubmit = async () => {
    const { imgDesktopFile, imgTabletFile, imgMobileFile, link, altText, position } = this.state;

    if (!imgDesktopFile) {
      return NotificationManager.error('imgDesktop image is required!');
    }
    // if (!link.trim()) {
    //   return NotificationManager.error('Link is required!');
    // }

    this.setState({ loading: true });

    try {
      // Upload required and optional images
      const imgDesktopUrl = await this.uploadSingleImage(imgDesktopFile);
      const imgTabletUrl = await this.uploadSingleImage(imgTabletFile);
      const imgMobileUrl = await this.uploadSingleImage(imgMobileFile);

      // Prepare payload
      const payload = {
        position,
        imgDesktop: imgDesktopUrl,
        imgTablet: imgTabletUrl || '',
        imgMobile: imgMobileUrl || '',
        link,
        altText,
        isActive: true,
        sortOrder: 0,
      };

      // Call API to create banner
      const res = await bannerApi.create(payload);

      if (res && res.data) {
        NotificationManager.success('Banner created successfully');
        this.setState({ redirect: true }); // or use Navigate or your routing method
      }
    } catch (err) {
      // Errors handled in uploadSingleImage or here
      NotificationManager.error('Failed to create banner');
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      position, loading,
      imgDesktopFile, imgTabletFile, imgMobileFile,
      link, altText,
    } = this.state;

    if (loading) return <Loader />;

    return (
      <div className={styles.create}>
       {
          this.state.redirect && <Navigate to={'/banner/list'} replace={false} />
        }
        <h3>Create Banner</h3>

        <label>Position</label>
        <select name="position" value={position} onChange={this.handleInputChange}>
          <option value="main-banner">Main Banner</option>
          <option value="side-banner">Side Banner</option>
          <option value="hot-banner">Hot Banner</option>
          <option value="gear-up-banner">Gear Up Banner</option>
        </select>

        <label>Desktop Image (required)</label>
        <input
          type="file"
          name="imgDesktop"
          accept="image/*"
          onChange={this.handleFileChange}
          required
        />
        {imgDesktopFile && <small>Selected: {imgDesktopFile.name}</small>}

        <label>Tablet Image (optional)</label>
        <input
          type="file"
          name="imgTablet"
          accept="image/*"
          onChange={this.handleFileChange}
        />
        {imgTabletFile && <small>Selected: {imgTabletFile.name}</small>}

        <label>Mobile Image (optional)</label>
        <input
          type="file"
          name="imgMobile"
          accept="image/*"
          onChange={this.handleFileChange}
        />
        {imgMobileFile && <small>Selected: {imgMobileFile.name}</small>}

        <label>Link (required)</label>
        <input
          type="text"
          name="link"
          value={link}
          onChange={this.handleInputChange}
          placeholder="products/fresh-picks"
          
        />

        <label>Alt Text (optional)</label>
        <input
          type="text"
          name="altText"
          value={altText}
          onChange={this.handleInputChange}
          placeholder="Image description"
        />

        <button onClick={this.handleSubmit}>Create Banner</button>
      </div>
    );
  }
}

export default Create;

