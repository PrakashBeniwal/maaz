import React, { useState, useEffect } from 'react';
import { useSelector ,useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';
import { useAuth } from '../../services/AuthContext.js'; // adjust path as needed
import {routes,Axios} from '../../config'
import LoadingSpinner from '../../loading/LoadingSpinner';
import { showNotification } from '../../services/notification';
import { clearCart } from '../../../store/slices/cartSlice';
import {error} from '../../services/error'

const Checkout = () => {
const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user: contextUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  
  const [courierPricings, setCourierPricings] = useState([]);
const [selectedCourierPricing, setSelectedCourierPricing] = useState(null);
const [city, setCity] = useState(null);
  const [states, setState] = useState(null);
  const [errors, setErrors] = useState({});

  
  const [formData, setFormData] = useState({
    name:contextUser?.id|| "",
    email:contextUser?.email||"" ,
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'cod',
    id:'',
    addressId:null,
    stateId:"",
    cityId:''
  });


  const fetchAddress = async () => {
    setLoading(true);
      try {
        const res = await Axios.get(`${routes.getCheckoutAddress}?id=${contextUser?.id}`);
        setCourierPricings(res?.data?.address?.city?.courierPricings || []);
        const data=res?.data;
        const add=res?.data?.address
          setFormData(prev => ({
        ...prev,
        name: data.name || '',
        email: data.email || '',
        phone: add?.phone || '',
        address: add?.address || '',
        city: add?.city?.name || '',
        state: add?.state?.name || '',
        stateId:add?.state?.id || '',
        cityId:add?.city?.id || '',
        postalCode: add?.postalCode || '',
        id:data.id,
        addressId:add?.id
      }));
      
      } catch (err) {
        console.error('Failed to fetch address:', err);
        error(err);
      } finally{
      setLoading(false)
      }
    };


    const fetchState = async () => {
      try {
        setLoading(true);
        const res = await Axios.get(`${routes.getSate}`); 
        setState(res?.data?.list);
      } catch (error) {
        console.error('Failed to fetch address:', error);
      } finally{
        setLoading(false)
      }
    };

      const fetchCity = async (id) => {
      try {
        const res = await Axios.get(`${routes.getCitiesBySateId}?id=${id}`); 
        setCity(res.data?.data?.cities);
        
      } catch (error) {
        console.error('Failed to fetch address:', error);
      }
    };


const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === "state") {
    const selectedState = states.find(state => state.id === parseInt(value));
    
    setFormData(prev => ({
      ...prev,
      stateId: selectedState?.id || '',cityId:""
    }));
    fetchCity(selectedState?.id);
  } else if (name === "city") {
    const selected = city.find(city => city.id === parseInt(value));
    
    setFormData(prev => ({
      ...prev,
      cityId: selected?.id || ''
    }));
  }
   else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  
};


 const validatePhoneNumber = (phone) => {
  const regex = /^03[0-9]{9}$/;
  return regex.test(phone);
};

const validatePostalCode = (postalCode) => {
  const regex = /^[0-9]{5}$/;
  return regex.test(postalCode);
};


const validateForm = () => {
  const newErrors = {};
  const requiredFields = ['address', 'cityId', 'stateId', 'postalCode', 'phone'];

  requiredFields.forEach(field => {
    const value = formData[field];

    // Check for empty strings or falsy values (0, null, undefined, etc.)
    if (typeof value === 'string') {
      if (value.trim() === '') {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    } else if (value === undefined || value === null || value === '') {
      newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });

  // Phone number validation
  if (!validatePhoneNumber(formData.phone)) {
    newErrors.phone = 'Invalid Pakistani phone number. Format: 03XXXXXXXXX';
  }
  
if(!validatePostalCode(formData.postalCode)){
    newErrors.postalCode = 'Invalid Pakistani postalCode';
}

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmitAddress = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
        setAddLoading(true)
    window.scrollTo(0, 0);
  
    // Send the updated address to your backend
    const response = await Axios.put(`${routes.updateAddress}`, {
      address: formData?.address,
      cityId: formData?.cityId,
      stateId: formData?.stateId,
      postalCode: formData?.postalCode,
      phone: formData?.phone,
      id:contextUser?.id
    });

    fetchAddress();
  } catch (error) {
    console.error('Error updating address:', error);
    alert('Failed to update address. Please try again.');
  } finally{
        setAddLoading(false)
  }
  
};

  // Load user address information when component mounts
  useEffect(() => {
   fetchAddress();
   fetchState();
  }, [contextUser]);

   useEffect(() => {
   fetchCity(formData?.stateId);
  }, [formData?.stateId]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-Pk', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const calculateShipping = () => {
  return selectedCourierPricing?.price
    ? parseFloat(selectedCourierPricing.price)
    : 0;
};




  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.netPrice * item.quantity), 0);
  };


  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

const createOrder = async (data) => {
      try {
        const res = await Axios.post(`${routes.createOrder}`,data);
        if(res?.data?.success==true){
         dispatch(clearCart());
         if(res?.data?.paymentMethod !=="cod"){
         setLoading(true);
            window.location.href=res?.data?.redirectUrl
         }else{
    navigate('/order-success');
    }
        }else{
navigate('/order-fail');
        }
      
      } catch (err) {
        console.error('Failed to create order:', err);
        error(err);
      } finally{
      setLoading(false);
      setIsSubmitting(false);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

if (formData.addressId=='' || formData.addressId==null || formData.addressId==undefined) {
  showNotification("Required", "Please create address", "info");
  setIsSubmitting(false);
  return;
}

if (!selectedCourierPricing) {
  showNotification("Required", "Please select a delivery courier", "info");
  setIsSubmitting(false);
  return;
}


  if(!formData?.address){
    showNotification("Required","Create Address First","info");
    setIsSubmitting(false);
    return;
  }
    

    const cleanItems = cartItems.map(item => ({
  id: item.id,
  quantity: item.quantity
}));

     const orderData = {
  items: cleanItems,
  paymentMethod: formData.paymentMethod,
  courierPricingId: selectedCourierPricing?.id,
  customerId:formData?.id,
  addressId:formData?.addressId
};
      
    createOrder(orderData);
      
  };

  if (loading) {
    return <LoadingSpinner message="Loading Checkout..." />;
  }
  
  return (
    <div className={styles.checkout_page}>
      <div className={styles.container}>
        <h1 className={styles.page_title}>Checkout</h1>
        
        <div className={styles.checkout_content}>
          <div className={styles.checkout_form}>
            <form onSubmit={handleSubmit}>
             {addLoading?<LoadingSpinner message="Loading Address..." />: <div className={styles.form_section}>
                <h2>Shipping Information</h2>
                <div className={styles.form_grid}>
                
                  <div className={styles.form_group}>
                    <label htmlFor="Name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                </div>

                <div className={styles.form_grid}>
                  <div className={styles.form_group}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className={styles.form_group}>
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? styles.error_input : ''}
                    />
                    {errors.phone && <div className={styles.error_message}>{errors.phone}</div>}
                  </div>
                </div>

                <div className={styles.form_group}>
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  className={errors.address ? styles.error_input : ''}
                    
                  />
                {errors.address && <div className={styles.error_message}>{errors.address}</div>}
                  
                </div>

                <div className={styles.form_grid}>
                        <div className={styles.form_group}>
  <label htmlFor="state">State*</label>
  <select
    id="state"
    name="state"
    value={formData?.stateId|| ''}
    onChange={handleChange}
    className={errors.state ? styles.error_input : ''}
  >
    <option value="">Select State</option>
    {states?.map(state => (
      <option key={state.id} value={state.id}>{state.name}</option>
    ))}
  </select>
  {errors.stateId && <div className={styles.error_message}>{errors.stateId}</div>}
</div>

   <div className={styles.form_row}>
                <div className={styles.form_group}>
                  <label htmlFor="city">City*</label>
                  <select
                    id="city"
                    name="city"
                    value={formData?.cityId}
                    onChange={handleChange}
                    className={errors.city ? styles.error_input : ''}
                  >
                    <option value="">Select City</option>
                    {city?.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                  {errors.cityId && <div className={styles.error_message}>{errors.cityId}</div>}
                </div>

              </div>

                 
                  <div className={styles.form_group}>
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    className={errors.postalCode ? styles.error_input : ''}
                    />
                  {errors.postalCode && <div className={styles.error_message}>{errors.postalCode}</div>}
                  </div>
                </div>

                <div className={styles.submit_button}
                 style={{textAlign:"center"}} onClick={(e)=>{handleSubmitAddress(e)}}>
                 {formData.addressId ?"Update Address":"Create Address"}</div>
              </div>}

              <div className={styles.form_section}>
                <h2>Payment Method</h2>
                <div className={styles.payment_options}>
                  <div className={styles.payment_option}>
                    <input
                      type="radio"
                      id="stripe"
                      name="paymentMethod"
                      value="stripe"
                      checked={formData.paymentMethod === 'stripe'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="stripe">Stripe</label>
                  </div>
                  <div className={styles.payment_option}>
  <input
    type="radio"
    id="hbl"
    name="paymentMethod"
    value="hbl"
    checked={formData.paymentMethod === 'hbl'}
    disabled={true}
    onChange={handleInputChange}
  />
  <label htmlFor="hbl">HBL Pay</label>
</div>
                  <div className={styles.payment_option}>
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="cod">Cash on Delivery</label>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className={styles.submit_button}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>

          <div className={styles.order_summary}>
            <h2>Order Summary</h2>
            <div className={styles.summary_items}>
              {cartItems.map(item => (
                <div key={item.id} className={styles.summary_item}>
                  <div className={styles.item_info}>
                    <img src={item.imgUrl} alt={item.name} />
                    <div>
                      <h3>{item.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className={styles.item_price}>
                    {formatPrice(item.netPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summary_totals}>
              <div className={styles.summary_row}>
                <span>Subtotal</span>
                <span>{formatPrice(calculateSubtotal().toFixed(2))}</span>
              </div>
              <div className={styles.summary_row}>
               {courierPricings.length > 0 ? (
  <div className={styles.form_group}>
    <label>Delivery Courier</label>
    <select
      value={selectedCourierPricing?.id || ''}
      onChange={(e) => {
        const selected = courierPricings.find(p => p.id == e.target.value);
        setSelectedCourierPricing(selected);
      }}
    >
      <option value="">Select Delivery Option</option>
      {courierPricings.map(p => (
        <option key={p.id} value={p.id}>
          {p.courier.name} - {formatPrice(p.price)}
        </option>
      ))}
    </select>
  </div>
):"Please update city at address for courier"}

               { courierPricings.length > 0 &&<span> {formatPrice(calculateShipping().toFixed(2))}</span>}
              </div>
              <div className={`${styles.summary_row} ${styles.total}`}>
                <span>Total</span>
                <span> {formatPrice(calculateTotal().toFixed(2))}</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Checkout; 
