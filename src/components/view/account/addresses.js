import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import {Axios,routes} from '../../config';
import LoadingSpinner from '../../loading/LoadingSpinner';

const Addresses = (id) => {
  const [address, setAddress] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [city, setCity] = useState(null);
  const [states, setState] = useState(null);
  const [errors, setErrors] = useState({});
  
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    address: '',
    postalCode: '',
    phone: '',
    stateId:'',
    cityId:''
  });


const fetchAddress = async () => {
    setLoading(true);
      try {
        const res = await Axios.get(`${routes.getAddress}?id=${id?.id}`);
        setAddress(res.data?.address);
      } catch (error) {
        console.error('Failed to fetch address:', error);
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

  useEffect(() => {
    
    fetchState();
    fetchAddress();
  }, []);


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
    fetchCity(selected?.id);
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   if (formData?.phone !== address?.phone) {
  //     console.log('Sending OTP to', formData?.phone);
  //     setOtpMode(true);
  //     return;
  //   }

  //   setAddress({ ...formData });
  //   setEditMode(false);
  // };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
        setLoading(true)
    window.scrollTo(0, 0);
  
    // Send the updated address to your backend
    const response = await Axios.put(`${routes.updateAddress}`, {
      address: formData?.address,
      cityId: formData?.cityId,
      stateId: formData?.stateId,
      postalCode: formData?.postalCode,
      phone: formData?.phone,
      id:id.id
    });

    fetchAddress();
    setEditMode(false);
  } catch (error) {
    console.error('Error updating address:', error);
    alert('Failed to update address. Please try again.');
  } finally{
        setLoading(false)
  }
  
};

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === '123456') {
      setAddress({ ...formData });
      setOtpMode(false);
      setEditMode(false);
    } else {
      setErrors({ otp: 'Invalid OTP' });
    }
  };

  const handleEdit = () => {
    setFormData({ ...address });
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setOtpMode(false);
    setErrors({});
  };

   if (loading) {
    return <LoadingSpinner message="Loading Address..." />;
  }
  return (
    <div className={styles.addresses_container}>
      <div className={styles.section_header}>
        <h3>My Address</h3>
        {!editMode && (
          <button className={styles.edit_button} onClick={handleEdit}>
          { address? "Edit Address":"Create Address" }
          </button>
        )}
      </div>

      {editMode ? (
        otpMode ? (
          <div className={styles.otp_form_container}>
            <h4>Verify OTP</h4>
            <form onSubmit={handleOtpSubmit} className={styles.otp_form}>
              <div className={styles.form_group}>
                <label htmlFor="otp">Enter OTP*</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={errors.otp ? styles.error_input : ''}
                />
                {errors.otp && <div className={styles.error_message}>{errors.otp}</div>}
              </div>
              <div className={styles.form_actions}>
                <button type="submit" className={styles.save_button}>Verify OTP</button>
                <button type="button" className={styles.cancel_button} onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <div className={styles.address_form_container}>
            <h4>Edit Address</h4>
            <form onSubmit={handleSubmit} className={styles.address_form}>
              <div className={styles.form_group}>
                <label htmlFor="address">Complete Address*</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData?.address}
                  onChange={handleChange}
                  placeholder="Street address, apartment, etc."
                  className={errors.address ? styles.error_input : ''}
                />
                {errors.address && <div className={styles.error_message}>{errors.address}</div>}
              </div>

           
               <div className={styles.form_group}>
  <label htmlFor="state">State/Province*</label>
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

              <div className={styles.form_row}>
                <div className={styles.form_group}>
                  <label htmlFor="postalCode">ZIP/Postal Code*</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData?.postalCode}
                    onChange={handleChange}
                    className={errors.postalCode ? styles.error_input : ''}
                  />
                  {errors.postalCode && <div className={styles.error_message}>{errors.postalCode}</div>}
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="country">Country*</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value="Pakistan"
                    readOnly
                    className={styles.readonly_input}
                  />
                </div>
              </div>

              <div className={styles.form_group}>
                <label htmlFor="phone">Phone Number*</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData?.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={errors.phone ? styles.error_input : ''}
                />
                {errors.phone && <div className={styles.error_message}>{errors.phone}</div>}
              </div>

              <div className={styles.form_actions}>
                <button type="submit" className={styles.save_button}>Save Address</button>
                <button type="button" className={styles.cancel_button} onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        )
      ) : (
        <div className={styles.address_card}>
          <div className={styles.address_details}>
            <div className={styles.address_line}>{address?.address}</div>
            <div className={styles.address_line}>{address?.city?.name}, {address?.state?.name} {address?.postalCode}</div>
            <div className={styles.address_line}>{"Pakistan"}</div>
            <div className={styles.address_phone}>{address?.phone}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;

