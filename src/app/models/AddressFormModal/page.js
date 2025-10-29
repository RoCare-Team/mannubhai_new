"use client";
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Modal,
  Box,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
function AddressFormModal({ open, handleClose, onAddressSubmit }) {
  const [addressType, setAddressType] = useState('Home');
  const [formData, setFormData] = useState({
    // address_id: '',
    street: '',
    landmark: '',
    houseNo: '',
    pincode: '',
    state: '',
    city: '',
    full_address: '',
    phone: '',
    alt_address_mob: '',
    phoneNumber:'',
    home_office:'',
    name:'',
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadStates() {
      try {
        setLoading(true);
        const response = await axios.get('https://www.waterpurifierservicecenter.in/wizard/app/getState.php');
       
        if (response.data && response.data.AvailableState) {
          // Get just the state names from the response
          const stateList = response.data.AvailableState.map(item => item.state);
          setStates(stateList);
        }
      } catch (error) {
        setMessage('Error loading states. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
   
    loadStates();
  }, []);

  // When state changes, load cities for that state
  useEffect(() => {
    async function loadCities() {
      if (!formData.state) return;
     
      try {
        setLoading(true);
        setCities([]);
       
        const response = await axios.get(`https://www.waterpurifierservicecenter.in/wizard/app/getCity.php?state=${formData.state}`);
       
        if (response.data && response.data.AvailableCities) {
          // Get just the city names from the response
          const cityList = response.data.AvailableCities.map(item => item.city_name);
          setCities(cityList);
        }
      } catch (error) {
        setMessage('Error loading cities. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
   
    loadCities();
  }, [formData.state]);

   const handlePhoneChange = (e) => {
    const { id, value } = e.target;
    // Remove all non-numeric characters including spaces
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData({
      ...formData,
      [id]: numericValue
    });
  };


  // Handle pincode lookup
  const handlePincodeChange = async (e) => {
    const newPincode = e.target.value;

     const numericValue = newPincode.replace(/[^0-9]/g, '');
   
    // Update formData with new pincode
    setFormData({
      ...formData,
      pincode: numericValue
    });
   
    // Clear message
    setMessage('');
   
    // Only proceed if pincode is 6 digits
    if (newPincode.length === 6) {
      try {
        setLoading(true);
       
        const response = await axios.get(`https://inet.waterpurifierservicecenter.in/include/ajax/get_city_with_pincode.php?pincode=${newPincode}`);
       
        if (response.data && response.data.state) {
          // Update formData with state and city from pincode response
          setFormData(prev => ({
            ...prev,
            state: response.data.state,
            city: response.data.city || ''
          }));
        } else {
          setMessage('No location found for this pincode.');
        }
      } catch (error) {
        setMessage('Error looking up pincode. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddressTypeChange = (type) => {
    setAddressType(type);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleStateChange = (e) => {
    // Clear city when state changes
    setFormData({
      ...formData,
      state: e.target.value,
      city: ''
    });
  };

  const handleCityChange = (e) => {
    setFormData({
      ...formData,
      city: e.target.value
    });
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  // Attach phone number from localStorage
  formData.phoneNumber = localStorage.getItem('userPhone');

  // Submit to API
  const res = await fetch("https://waterpurifierservicecenter.in/customer/ro_customer/add_address.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

  const data = await res.json();

  // Create address object to save and send
  const newAddress = {
    flat_no: formData.houseNo,
    landmark: formData.landmark,
    area: formData.street,
    state: formData.state,
    city: formData.city,
    pincode: formData.pincode,
    id: Date.now().toString() // unique ID for tracking
  };

  // Save to RecentAddress array in localStorage
  try {
    const existing = JSON.parse(localStorage.getItem("RecentAddress") || "[]");

    // Check for duplicates
    const isDuplicate = existing.some(addr =>
      addr.flat_no === newAddress.flat_no &&
      addr.landmark === newAddress.landmark &&
      addr.area === newAddress.area &&
      addr.city === newAddress.city &&
      addr.state === newAddress.state &&
      addr.pincode === newAddress.pincode
    );

    const updated = isDuplicate ? existing : [newAddress, ...existing].slice(0, 10);
    localStorage.setItem("RecentAddress", JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving recent address:", error);
  }

  // Save individual values
  localStorage.setItem("booking_ads", data.full_address || "");
  localStorage.setItem("address_id", JSON.stringify(data.address_id || newAddress.id));
alert(data.msg || "Address saved successfully!");
  

  // Send address to parent
  if (onAddressSubmit) {
    onAddressSubmit(newAddress);
  }

  handleClose();
};

 

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="address-form-modal"
      aria-describedby="address-form-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 3,
        borderRadius: 2,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="h2" gutterBottom>
          Add New Address
        </Typography>

        <Box className="chooseAddress" sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={addressType === 'Home'}
                onChange={() => handleAddressTypeChange('Home')}
              />
            }
            label="Home"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={addressType === 'Office'}
                onChange={() => handleAddressTypeChange('Office')}
              />
            }
            label="Office"
          />
        </Box>

        <Divider sx={{ my: 2 }} className="dashedLink" />

        <Box component="form" onSubmit={handleSubmit} className="formArea w-full">
          <Typography variant="body1" fontWeight="bold" gutterBottom>
            Address Details
          </Typography>

          <Grid container spacing={2}>
            {/* size={{  xs:6 ,sm:4, md:3,lg:2 }}  item xs={12} sm={6} */}
          <Grid  size={{  xs:12 ,sm:6 }} >
             <TextField
             id='name'
             label='Name'
             variant='outlined'
             fullWidth
             required
             value={formData.name}
             onChange={handleInputChange}
           
             />

            </Grid>
       
            <Grid size={{  xs:12 ,sm:6 }}>
             <TextField
             id='phone'
             label='Phone Number'
             variant='outlined'
             fullWidth
             required
             value={formData.phone}
             onChange={handlePhoneChange}
            slotProps={{
                  htmlInput: {
                    maxLength: 10,
                    inputMode: "numeric"
                  }
                }}
                helperText={`${formData.phone.length}/10 digits`}
                error={formData.phone.length > 0 && formData.phone.length !== 10}
           
           
             />

            </Grid>

            <Grid size={{  xs:12 ,sm:6 }}>
             <TextField
             id='alt_address_mob'
             label='Alternate Phone'
             variant='outlined'
             fullWidth
             value={formData.alt_address_mob}
               onChange={handlePhoneChange}
            slotProps={{
                  htmlInput: {
                    maxLength: 10,
                    inputMode: "numeric"
                  }
                }}
                helperText={`${formData.alt_address_mob.length}/10 digits`}
                error={formData.alt_address_mob.length > 0 && formData.alt_address_mob.length !== 10}
           
           
             />

            </Grid>


            <Grid size={{  xs:12 ,sm:6 }}>
              <TextField
                id="pincode"
                label="PinCode"
                variant="outlined"
                required
                fullWidth
                value={formData.pincode}
                onChange={handlePincodeChange}
                slotProps={{ htmlInput: { maxLength: 6 } }}
                helperText={`${formData.pincode.length}/6 digits`}
                error={formData.pincode.length > 0 && formData.pincode.length !== 6}
                InputProps={{
                  endAdornment: loading ? <CircularProgress size={20} /> : null
                }}
              />
            </Grid>
            <Grid size={{  xs:12 ,sm:6 }}>
              <FormControl fullWidth required>
                <InputLabel id="state-label">State</InputLabel>
                <Select
                  labelId="state-label"
                  id="state"
                  value={formData.state}
                  label="State"
                  onChange={handleStateChange}
                  disabled={loading}
                >
                  <MenuItem value="">Select State</MenuItem>
                  {states.map((state, index) => (
                    <MenuItem key={index} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{  xs:12 ,sm:6 }}>
              <FormControl fullWidth required>
                <InputLabel id="city-label">City</InputLabel>
                <Select
                  labelId="city-label"
                  id="city"
                  value={formData.city}
                  label="City"
                  onChange={handleCityChange}
                  disabled={loading || !formData.state}
                >
                  <MenuItem value="">Select City</MenuItem>
                  {cities.map((city, index) => (
                    <MenuItem key={index} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{  xs:12 ,sm:6 }}>
              <TextField
                id="houseNo"
                label="House No"
                variant="outlined"
                required
                fullWidth
                value={formData.houseNo}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{  xs:12 ,sm:6 }}>
              <TextField
                id="street"
                label="Street"
                variant="outlined"
                required
                fullWidth
                value={formData.street}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{  xs:12 ,sm:6 }}>
              <TextField
                id="landmark"
                label="Famous Landmark"
                variant="outlined"
                required
                fullWidth
                value={formData.landmark}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid size={{  xs:12 ,sm:6 }}>
              <TextField
                id="full_address"
                label="Full Address"
                variant="outlined"
                multiline
                rows={2}
                fullWidth
                value={formData.full_address}
                onChange={handleInputChange}
                placeholder="Add any additional address details"
              />
            </Grid>
          </Grid>

          {message && (
            <Typography color="error" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formData.street || !formData.city || !formData.state || !formData.pincode || !formData.houseNo  || !formData.phone }
            >
              Save Address
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddressFormModal;
