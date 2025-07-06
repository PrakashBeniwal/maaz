import React, { Component } from 'react'
import styles from './index.module.scss';
import Select from 'react-select'
import { RiDeleteBinLine } from 'react-icons/ri';
import { productApi } from '../../../../services/productApi';
import Loader from '../../../../../loading';
import { NotificationManager } from 'react-notifications';
export class AddImage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			list: [],
			selectedProductId: null,
			products: [],
			files: null
		}
	}

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

handleDelete = async (photoId) => {
  try {
    this.setState({ loading: true });
    const res = await productApi.deletePhotoById(photoId);

    if (res) {
      NotificationManager.success("Photo deleted successfully");
      this.getAllProducts(); // refresh list after deletion
    } else {
      NotificationManager.error("Failed to delete photo");
    }
  } catch (error) {
    console.error("Delete error:", error);
    NotificationManager.error("An error occurred during deletion");
  } finally {
    this.setState({ loading: false });
  }
};


	getAllProducts = () => {
		this.setState({ loading: true })
		productApi.getAllPhotos()
			.then(result => {
				if (result) {
					this.setState({ list: result.list, products: result.list, loading: false });
					return;
				}
				this.setState({ loading: false })
				return;
			})
	}

	   handleFileChange = (event) => {
    this.setState({ files: Array.from(event.target.files) });
  };

	componentDidMount() {
		this.getAllProducts()
	}

	onSelectProduct = (e) => {
		this.setState({ selectedProductId: e.value })
	}

uploadImg = async () => {
  this.setState({ loading: true });
  const { files, selectedProductId } = this.state;

  if (!selectedProductId || !files) {
    NotificationManager.error("Please provide photo and productId");
    this.setState({ loading: false });
    return;
  }

  const uploadedUrls = [];

  try {
    for (const file of files) {
      // Request signature for this file
      const { data: sigData } = await productApi.getUploadUrl();

      // Upload the image to Cloudinary
      const imageResult = await productApi.imageUpload(sigData, file);
      uploadedUrls.push(imageResult.secure_url);
      NotificationManager.info("Image uploaded successfully");
    }

    const data = { productId: selectedProductId, urls: uploadedUrls };
    const uploadImgOnDb = await productApi.uploadMoreImg(data);

    if (uploadImgOnDb) {
      NotificationManager.success("Images uploaded to the Database successfully");
      this.getAllProducts();
    }
  } catch (error) {
    console.error("Upload failed:", error);
    NotificationManager.error("Image upload failed");
  } finally {
    this.setState({ loading: false });
    this.getAllProducts();
  }
};



	render() {
		const { list, products, loading, selectedProductId, photo } = this.state;
		if (loading) {
			return <Loader />;
		}
		return (
			<div className={styles.addImg}>

				<div className={styles.upload}>
					<h4>Upload Product Images</h4>

					<div className={styles.uploadImg}>
						<div className={styles.category}>
							<label htmlFor="">Product*</label>
							<Select options={this.Array(products, "name", "id")} onChange={(e) => { this.onSelectProduct(e) }} />
						</div>
						<div className={styles.selectImg}>
							<label htmlFor="">Slider Image*</label>
							<input type="file" multiple disabled={selectedProductId ? false : true} onChange={ this.handleFileChange} />
						</div>
						<button className='pointer' onClick={()=>{this.uploadImg()}} > upload </button>
						
					</div>

				</div>

			<div className={styles.list}>
					{/*	<div className={styles.search}>
						<Select className={styles.select} />
						<button >Search</button>
						<button>Refresh</button>
					</div>*/}

					<div className={styles.allproducts}>
						<h4>All products</h4>
						<table>
							<thead>
								<th>Id</th>
								<th>Product Name</th>
								<th>Brand</th>
								<th>Images</th>
							</thead>
							<tbody>
								{
									list.map((data) => {
										return (
											<tr key={data.id}>
												<td>{data.id}</td>
												<td>{data.name}</td>
												<td>{data.brand?.name}</td>
												<td className={styles.productImg}>
													<table>
														<thead >
															<th>Photo</th>
															<th>Action</th>
														</thead>
														<tbody>
															{data.productPhotos?.map(p => {
																return (
																	<tr>
																		<td>
																			<img src={p.imgUrl} alt="" />
																		</td>
																		<td>
																			<RiDeleteBinLine onClick={() => { this.handleDelete(p.id) }} />

																		</td>
																	</tr>
																)
															})}
														</tbody>
													</table>
												</td>


											</tr>
										)
									})
								}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}

export default AddImage
