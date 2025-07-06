import React, { Component } from 'react'
import styles from './index.module.scss'
import Select from 'react-select'
import RichTextEditor from '../../../../richtexteditor'
import { categoryApi } from '../../../../services/categoryApi';
import { productApi } from '../../../../services/productApi';
import { brandApi } from '../../../../services/brandApi';
import { NotificationManager } from 'react-notifications';
import { Navigate } from 'react-router-dom';
import Loader from '../../../../../loading';
export class Create extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hideAddProduct: true,
      hideAddBtn: true,
      category: [],
      brandlist: [],
      subCategory: [],
      childCategory: [],
      categoryId: null,
      subCategoryId: null,
      childCategoryId: null,
      status: 1,
      name: null,
      shortDesc: null,
      slug: null,
      brandId: null,
      desc: null,
      buyerPrice: null,
      price: null,
      discount: 0,
      discountPrice: 0,
      netPrice: null,
      quantity: 1,
      photo: null,
      stock: 0,
      total: null,
      urlData:{}
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
    } return arrayItems;
  }

  handleContentChange = (text) => {
    this.setState({
      desc: text
    })
  }


getMainCategoryList() {
  this.setState({ loading: true });
  categoryApi.listMainCategory()
    .then(result => {
      if (result) {
        this.setState({ category: result.data });
      }
    })
    .catch(err => {
      console.error("Failed to fetch main categories:", err);
      NotificationManager.error("Failed to load categories");
    })
    .finally(() => {
      this.setState({ loading: false });
    });
}

getBrand() {
  this.setState({ loading: true });
  brandApi.list()
    .then(result => {
      if (result) {
        this.setState({ brandlist: result.list });
      }
    })
    .catch(err => {
      console.error("Failed to fetch brands:", err);
      NotificationManager.error("Failed to load brands");
    })
    .finally(() => {
      this.setState({ loading: false });
    });
}

getUplodUrl() {
  this.setState({ loading: true });
  productApi.getUploadUrl()
    .then(result => {
      if (result) {
        this.setState({ urlData: result.data });
      }
    })
    .catch(err => {
      console.error("Failed to get upload URL:", err);
      NotificationManager.error("Failed to fetch upload URL");
    })
    .finally(() => {
      this.setState({ loading: false });
    });
}


  componentDidMount() {
    this.getMainCategoryList();
    this.getBrand();
    this.getUplodUrl()
  }
  

  getSubCategoryList(id) {
    categoryApi.subListById({ id })
      .then(result => {
        if (result) {
          this.setState({ subCategory: result.data.subCategories })
        }
      })
  }

  getChildCategory(id) {
    categoryApi.childListById({ id })
      .then(result => {
        if (result) {
          this.setState({ childCategory: result.data.childCategories })
        }
      })
  }

 

  onSelectMainCategory = (e) => {
    this.setState({ categoryId: e.value })
    this.getSubCategoryList(e.value);

  }

  onSelectSubCategory = (e) => {
    this.setState({ subCategoryId: e.value, hideAddProduct: false });
    this.getChildCategory(e.value);
  }

  onSelectChildCategory = (e) => {
    this.setState({ childCategoryId: e.value });
  }
  onSelectBrand = (e) => {
    this.setState({ brandId: e.value });
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
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSelectImg = (e) => {
    this.setState({ photo: e.target.files[0] })
  }

  handleCheckPrice = () => {
    const { price, quantity, discount } = this.state;
    if (price==null || quantity==null || discount==null ) {
      console.log({ price, quantity, discount })
      NotificationManager.info("please fill all required field price,quantiy and discount");
      return;
    }
    let total = price * quantity;
    let discountPrice = total * discount / 100;
    let netPrice = total - discountPrice;
    this.setState({ total, discountPrice, netPrice, hideAddBtn: false })

  }

 handleCreate = async () => {
  this.setState(prevState => ({
  ...prevState,
  loading: true
}));


  const {
    urlData, subCategoryId, childCategoryId, status, name, shortDesc, slug,
    brandId, desc, buyerPrice, price, discount, discountPrice, quantity, photo,
    netPrice, total, categoryId, stock
  } = this.state;

  // Validate required fields
  const requiredFields = {
    subCategoryId, status, name, shortDesc, slug, desc,
   price, discount, discountPrice, netPrice, quantity, total,
     categoryId, stock
  };

  const missingFields = Object.entries(requiredFields)
    .filter(([key, value]) => value === null || value === undefined || value === "")
    .map(([key]) => key);

  if (missingFields.length > 0) {
    NotificationManager.info(`Please fill all required fields: ${missingFields.join(', ')}`);
    this.setState(prevState => ({
  ...prevState,
  loading: false
}));

    return;
  }

  try {
    let imageUrl = null;

    // Upload image if photo exists
    if (photo) {
      const imageResult = await productApi.imageUpload(urlData, photo);
      imageUrl = imageResult?.secure_url;
      if (imageUrl) {
        NotificationManager.success("Image uploaded successfully");
      }
    }

    // Create product
    const productData = {
      subCategoryId, childCategoryId, status, name, shortDesc, slug,
      brandId, desc, buyerPrice, price, discount, discountPrice,
      netPrice, quantity, stock, total, categoryId,
      key: imageUrl
    };

    const createdProduct = await productApi.create(productData);

      if(createdProduct.success){
    NotificationManager.success(createdProduct.mess);
    this.setState({ redirect: true });
    }else{
    NotificationManager.info(createdProduct.mess)
    }

  } catch (err) {
    console.error("Product creation failed:", err);
    NotificationManager.error(err.message || "An error occurred during product creation");
  } finally {
  
    this.setState(prevState => ({
  ...prevState,
  loading: false
}));

  }
};


  render() {
    if (this.state.loading) {
      return <Loader />
    }
    const { hideAddBtn, hideAddProduct, category,quantity, subCategory, childCategory, total, netPrice, discount, discountPrice, stock,brandlist,name,buyerPrice,slug,SellerPrice,shortDesc,desc } = this.state;
    return (
      <div className={styles.create}>
        {
          this.state.redirect && <Navigate to={'/product/productList'} replace={false} />
        }
        <div className={styles.category}>
          <div>
            <label htmlFor="">Category*</label>
            <Select options={this.Array(category, "name", "id")} onChange={(e) => { this.onSelectMainCategory(e) }} />
          </div>
          <div>
            <label htmlFor="">Sub Category*</label>
            <Select options={this.Array(subCategory, "name", "id")} onChange={(e) => { this.onSelectSubCategory(e) }} />
          </div>
        </div>

        {!hideAddProduct && <div className={styles.addProduct}>
          <h3>Add New Product</h3>
          <div className={styles.productItems}>
            <div>
              <label htmlFor="">Product Name</label>
              <input type="text" placeholder='product name' name='name' value={name} onChange={(e) => { this.handleOnChange(e) }} />
            </div>
            <div>
              <label htmlFor="">Category*</label>
              <Select options={this.Array(childCategory, "name", "id")} onChange={(e) => { this.onSelectChildCategory(e) }} />
            </div>
            <div>
              <label htmlFor="">Brand*</label>
              <Select options={this.Array(brandlist, "name", "id")} onChange={(e) => { this.onSelectBrand(e) }} />
            </div>
            <div>
              <label htmlFor="">Slug*</label>
              <input type="text" placeholder='product slug' name='slug' value={slug} onChange={(e) => { this.handleOnChange(e) }} />
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
              <Select options={this.options} defaultInputValue='Active' onChange={(e) => { this.onSelectStatus(e) }} />
            </div>
            <div>
              <label htmlFor="">Cost*</label>
              <input type="number" placeholder='100' name='buyerPrice' value={buyerPrice} onChange={(e) => { this.handleOnChange(e) }} />
            </div>
            <div>
              <label htmlFor="">Seller Price*</label>
              <input type="number" placeholder='105' name='price' value={SellerPrice} onChange={(e) => { this.handleOnChange(e) }} />
            </div>
            <div>
              <label htmlFor="">Quantity*</label>
              <input type="number" placeholder='1' name='quantity' value={quantity} onChange={(e) => { this.handleOnChange(e) }} />
            </div>
            <div>
              <label htmlFor="">Discount % *</label>
              <input type="number" placeholder='1' name='discount' value={discount} onChange={(e) => { this.handleOnChange(e) }} />
            </div>
            <div>
              <label htmlFor="">Discount Price*</label>
              <input type="number" value={discountPrice} disabled />
            </div>
           
            <div>
              <label htmlFor="">Total*</label>
              <input type="number" disabled value={total} />
            </div>
            <div >
              <label htmlFor="">Grand Total*</label>
              <input type="number" disabled value={netPrice} />
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
            {!hideAddBtn && <button onClick={this.handleCreate}>Add New Product</button>}
          </div>
        </div>}
      </div>
    )
  }
}

export default Create
