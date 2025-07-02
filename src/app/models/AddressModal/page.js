"use client";
import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
  Divider,
  Paper,
  Box,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddressFormModal from '../AddressFormModal/page';

function AddressModal({ onAddressSelected, addressOpen, setAddressOpen }) {
  const [userAddress, setUserAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [mannuallyAddress, setMannuallyAddress] = useState(false);
  const [recentAddress, setRecentAddress] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Utility to format address string
  const formatAddress = (addr) => {
    return (
      addr?.address ||
      `${addr.flat_no || addr.houseNo || ''}, ${addr.landmark || ''}, ${addr.area || addr.street || ''}, ${addr.city || ''}, ${addr.state || ''}, ${addr.pincode || ''}`
    ).replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '');
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && addressOpen) {
      loadRecentAddresses();
    }
  }, [isClient, addressOpen]);

  const loadRecentAddresses = () => {
    try {
      const stored = localStorage.getItem('RecentAddress');
      const parsed = stored ? JSON.parse(stored) : [];
      setRecentAddress(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error('Error loading recent addresses:', error);
      setRecentAddress([]);
    }
  };

  const saveToRecentAddresses = (addressData) => {
    try {
      const newAddress = {
        id: addressData.id || Date.now().toString(),
        flat_no: addressData.flat_no || addressData.houseNo || '',
        landmark: addressData.landmark || '',
        area: addressData.area || addressData.street || '',
        state: addressData.state || '',
        city: addressData.city || '',
        pincode: addressData.pincode || '',
        address: formatAddress(addressData)
      };

      const existing = JSON.parse(localStorage.getItem('RecentAddress') || '[]');
      const addressExists = existing.some(addr =>
        addr.pincode === newAddress.pincode &&
        addr.area === newAddress.area &&
        addr.city === newAddress.city &&
        (addr.flat_no === newAddress.flat_no || addr.houseNo === newAddress.flat_no)
      );

      if (!addressExists) {
        const updated = [newAddress, ...existing].slice(0, 10);
        localStorage.setItem('RecentAddress', JSON.stringify(updated));
        setRecentAddress(updated);
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleClose = () => {
    setAddressOpen(false);
    setUserAddress('');
    setSelectedAddress('');
  };

  const handleSelectAddress = (addressObj) => {
    const fullAddress = formatAddress(addressObj);
    setUserAddress(fullAddress);
    setSelectedAddress(fullAddress);
    try {
      localStorage.setItem("address_id", addressObj.id || '');
    } catch (error) {
      console.error("Failed to set address_id:", error);
    }
  };

  const handleSubmit = () => {
    if (userAddress && onAddressSelected) {
      onAddressSelected(selectedAddress || userAddress);
      handleClose();
    }
  };

  const handleMannualOpen = () => setMannuallyAddress(true);
  const handleMannualClose = () => setMannuallyAddress(false);

  const handleAddressFormSubmit = (formattedAddress) => {
    const addressString = typeof formattedAddress === 'object'
      ? formatAddress(formattedAddress)
      : formattedAddress;

    setUserAddress(addressString);
    setSelectedAddress(addressString);
    setMannuallyAddress(false);

    if (typeof formattedAddress === 'object') {
      const withId = {
        ...formattedAddress,
        id: formattedAddress.id || Date.now().toString(),
        address: addressString
      };
      saveToRecentAddresses(withId);
    }

    if (onAddressSelected) onAddressSelected(addressString);
    handleClose();
  };

  return (
    <Box>
      <Dialog open={addressOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Typography variant="h6">Select Address</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'black' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Box>
            <TextField
              fullWidth
              placeholder="Enter Your Location"
              variant="outlined"
              value={userAddress}
              disabled
              sx={{ mb: 2 }}
            />

            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  console.log('RecentAddress:', localStorage.getItem('RecentAddress'));
                }}
                sx={{ textTransform: 'none', color: 'gray' }}
              >
                Debug Storage
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={handleMannualOpen}
                sx={{
                  textTransform: 'none',
                  background: 'rgb(142 102 255)',
                  color: 'white',
                  border: '1px solid white'
                }}
              >
                Add Manually
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 2, borderStyle: 'dashed', borderBottomWidth: '3px', borderColor: 'gray' }} />

          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              Recents ({recentAddress.length})
            </Typography>

            {recentAddress.length === 0 ? (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                No recent addresses found. Add an address manually to see it here.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {recentAddress.map((addressObj, index) => (
                  <Grid item xs={12} key={addressObj.id || index}>
                    <Paper
                      elevation={0}
                      variant="outlined"
                      tabIndex={0}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        '&:hover': { backgroundColor: '#f5f5f5' },
                        '&:focus': { background: '#7533ea', color: 'white' }
                      }}
                      onClick={() => handleSelectAddress(addressObj)}
                    >
                      <Typography sx={{ p: 1 }}>{formatAddress(addressObj)}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!userAddress}
            sx={{
              backgroundColor: '#8a2be2',
              '&:hover': { backgroundColor: 'rgb(142 102 255)' }
            }}
          >
            Confirm Address
          </Button>
        </DialogActions>
      </Dialog>

      <AddressFormModal
        open={mannuallyAddress}
        handleClose={handleMannualClose}
        onAddressSubmit={handleAddressFormSubmit}
      />
    </Box>
  );
}

export default AddressModal;
