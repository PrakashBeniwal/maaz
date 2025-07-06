import React, { Component } from 'react'
import styles from './index.module.scss'
import Select from 'react-select'
import RichTextEditor from '../../../../richtexteditor'
import { productApi } from '../../../../services/productApi';
import { NotificationManager } from 'react-notifications';
import Loader from '../../../../../loading';
import { Navigate } from 'react-router-dom';
import { brandApi } from '../../../../services/brandApi';
import { categoryApi } from '../../../../services/categoryApi';

export class Edit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hideAddBtn: true,
      photo: null,
      brandId:null,
      brandlist:[],
      childCategory:[],
      childCategoryId:null
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

  handleContentChange = (text) => {
    this.setState({
      desc: text
    })
  }

 getChildCategory(id) {
    categoryApi.childListById({ id })
      .then(result => {
        if (result) {
          this.setState({ childCategory: result?.data?.childCategories })
        }
      })
  }

 getUplodUrl() {
    this.setState({ loading: true })
    productApi.getUploadUrl()
      .then(result => {
        if (result) {
          this.setState({ urlData: result.data});
          this.setState({ loading: false })
        }
      })
  }


  getProductById = () => {
    const id = document.location.href.split('/').pop();
    productApi.getProductById(id)
      .then(result => {
        if (result) {
          this.setState({
            status: result.data.status,
            name: result.data.name,
            shortDesc: result.data.shortDesc,
            slug: result.data.slug,
            brandId: result.data.brandId,
            desc: result.data.desc,
            buyerPrice: result.data.buyerPrice,
            price: result.data.price,
            discount: result.data.discount,
            discountPrice: result.data.discountPrice,
            netPrice: result.data.netPrice,
            quantity: result.data.quantity,
            stock: result.data.stock,
            total: result.data.total,
            id: result.data.id,
            childCategoryId:result?.data?.childCategoryId,
            brand:result.data?.brand?.name,
            childCat:result.data?.childCategory?.name
          });
          this.getChildCategory(result?.data?.subCategoryId)
          return;
        }
      })

  }

  getBrand() {
    brandApi.list( )
      .then(result => {
        if (result) {
          this.setState({ brandlist: result.list })
        }
      })
  }

  componentDidMount() {
    this.getProductById();
    this.getUplodUrl();
    this.getBrand();
  }



  options = [
    {
      "label": "Active", "value": "1"
    },
    {
      "label": "InActive", "value": "0"
    },
  ]

  onSelectStatus = (e) => {
    this.setState({ status: e.value })
  }

  handleOnChange = (e) => {
    this.setState({ [e.target.name]: e.target.value,hideAddBtn:true });
  }

  handleSelectImg = (e) => {
    this.setState({ photo: e.target.files[0], updateImg: true });

  }

  onSelectBrand = (e) => {
    this.setState({ brandId: e.value,brand:e.label });
  }


  handleCheckPrice = () => {
    const { price, quantity, discount } = this.state;
    if (price==null || quantity==null || discount==null) {
      NotificationManager.info("please fill all required field price,qantiy and discount");
      return;
    }
    let total = price * quantity;
    let discountPrice = total * discount / 100;
    let netPrice = parseFloat(total) - parseFloat(discountPrice) ;
    this.setState({ total, discountPrice, netPrice, hideAddBtn: false })
  }

 onSelectChildCategory = (e) => {
    this.setState({ childCategoryId: e.value,childCat:e.label });
  }
  
  handleUpdate = async () => {
  this.setState(prevState => ({ ...prevState, loading: true }));

  const {
    id, status, name, shortDesc, slug, brandId, desc,
    buyerPrice, price, discount, discountPrice, netPrice,
    quantity, stock, total,
    photo, urlData,childCategoryId
  } = this.state;

  // Required field validation
  const requiredFields = {
    id, status, name, shortDesc, slug, desc,
     price, discount, discountPrice,
    netPrice, quantity, stock, total
  };

  const missingField = Object.entries(requiredFields).find(
    ([key, value]) => value === null || value === undefined || value === ""
  );

  if (missingField) {
    NotificationManager.info(`Please fill the required field: ${missingField[0]}`);
    this.setState(prevState => ({ ...prevState, loading: false }));
    return;
  }

  try {
    let imageUrl = null;

    // Upload image if provided
    if (photo) {
      const imageResult = await productApi.imageUpload(urlData, photo);
      imageUrl = imageResult?.secure_url || null;
      NotificationManager.success("Image uploaded successfully");
    }

    // Construct payload
    const data = {
      id,
      status,
      name,
      shortDesc,
      slug,
      brandId,
      desc,
      buyerPrice,
      price,
      discount,
      discountPrice,
      childCategoryId,
      netPrice,
      quantity,
      stock,
      total,
      ...(imageUrl && { key: imageUrl })
    };

    const result = await productApi.update(data);

    if(result){
     NotificationManager.success("Product updated successfully");

    this.setState(prevState => ({
      ...prevState,
      loading: false,
      redirect: true
    }));
    }
   

  } catch (err) {
    console.error("Update Error:", err);
    NotificationManager.error(err.message || "An error occurred while updating the product");
    this.setState(prevState => ({
      ...prevState,
      loading: false,
      redirect: false
    }));
  }finally{
   this.setState(prevState => ({
      ...prevState,
      loading: false
    }))
    }
};


  render() {
    if (this.state.loading) {
      return <Loader />
    }
    const { status, name, shortDesc,childCategory, slug, brandId, desc,
     buyerPrice, price, discount, discountPrice, netPrice, quantity, stock,childCat,childCategoryId,brand, total, hideAddBtn,brandlist } = this.state;
    return (
      <div className={styles.create}>
        {
          this.state.redirect && <Navigate to={'/product/productList'} replace={false} />
        }
        <div className={styles.addProduct}>
          <h3>Add New Product</h3>
          <div className={styles.productItems}>
            <div>
              <label htmlFor="">Product Name</label>
              <input type="text" placeholder='product name' name='name' value={name} onChange={(e) => { this.handleOnChange(e) }} />
            </div>
            {<div>
                    <label htmlFor="">Child Category*</label>
                    <Select value={{value:childCategoryId,label:childCat}} options={this.Array(childCategory,"name","id")} onChange={(e)=>{this.onSelectChildCategory(e)}}/>
                </div>}
            <div>
              <label htmlFor="">Slug*</label>
              <input type="text" placeholder='product slug' name='slug' value={slug} onChange={(e) => { this.handleOnChange(e) }} />
            </div>
            
            <div>
              <label htmlFor="">Brand*</label>
              <Select value={{value:brandId,label:brand}} options={this.Array(brandlist, "name", "id")} onChange={(e) => { this.onSelectBrand(e) }} />
            </div>
            
            <div>
              <label htmlFor="">Stock*</label>
              <input type="text" placeholder='1000' name='stock' value={stock} onChange={(e) => { this.handleOnChange(e) }} />
            </div>
            <div>
              <label htmlFor="">Product Image*</label>
              <input type="file" placeholder='1000' onChange={(e) => { this.handleSelectImg(e) }} />
            </div>
            <div>
              <label htmlFor="">Status*</label>
              <Select options={this.options} defaultInputValue={`${status ? "Active" : "InActive"}`} onChange={(e) => { this.onSelectStatus(e) }} />
            </div>
            <div>
              <label htmlFor="">Cost*</label>
              <input type="number" placeholder='100' name='buyerPrice' value={buyerPrice} onChange={(e) => { this.handleOnChange(e) }} />
            </div>
            <div>
              <label htmlFor="">Seller Price*</label>
              <input type="number" placeholder='105' name='price' value={price} onChange={(e) => { this.handleOnChange(e) }} />
            </div>
            <div>
              <label htmlFor="">Quantity*</label>
              <input type="number" placeholder='1' name='quantity' value={quantity} onChange={(e) => { this.handleOnChange(e) }} />
            </div>
            <div>
              <label htmlFor="">Discount % *</label>
              <input type="float" placeholder='1' name='discount' value={discount} onChange={(e) => { this.handleOnChange(e) }} />
            </div>
            <div>
              <label htmlFor="">Discount Price*</label>
              <input type="float" value={discountPrice} disabled />
            </div>
          
            <div>
              <label htmlFor="">Total*</label>
              <input type="float" disabled value={total} />
            </div>
            <div >
              <label htmlFor="">Grand Total*</label>
              <input type="float" disabled value={netPrice} />
            </div>
            <div className={styles.desc}>
              <label htmlFor="" >Sort Description*</label>
              <textarea rows={3} name='shortDesc' value={shortDesc} onChange={(e) => { this.handleOnChange(e) }} />
            </div>
            <div className={styles.desc}>
              <label htmlFor="">Description*</label>
              <RichTextEditor content={desc} placeholder={'enter description here'} handleContentChange={this.handleContentChange} />
            </div>
          </div>

          <div className={styles.btn}>
            <button onClick={this.handleCheckPrice}>Check Price</button>
            {!hideAddBtn && <button onClick={() => this.handleUpdate()}>Update Product</button>}
          </div>
        </div>
      </div>
    )
  }
}

export default Edit
