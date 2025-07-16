"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Stack,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { MdOutlineVerifiedUser } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AccountDetails = () => {
  const [user, setUser] = useState({ name: "", email: "", mobile: "" });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({ name: "", email: "" });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchUser = () => {
      try {
        const localData = {
          name: localStorage.getItem("name") || "",
          email: localStorage.getItem("email") || "",
          mobile: localStorage.getItem("userPhone") || "",
        };
        setUser(localData);
        setFormData({ name: localData.name, email: localData.email });
      } catch (error) {
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", email: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const hasChanges = () =>
    formData.name.trim() !== user.name.trim() ||
    formData.email.trim() !== user.email.trim();

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!hasChanges()) {
      toast.info("No changes to update");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer_id: localStorage.getItem("customer_id") || "",
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: localStorage.getItem("userPhone") || user.mobile || "",
      };

      const res = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/update_user_dtls.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!data.error) {
        localStorage.setItem("name", payload.name);
        localStorage.setItem("email", payload.email);
        setUser({ ...user, name: payload.name, email: payload.email });
        toast.success("✅ Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error(data.msg || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Update failed: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
    <Header />
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <section className="w-full max-w-lg p-6 bg-white rounded-xl shadow-lg border">
        <Typography variant="h5" className="mb-6 text-indigo-600 font-semibold text-center">
          Account Details
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            label="Mobile Number"
            value={user.mobile || "-"}
            disabled
            fullWidth
            helperText="To change phone number, please contact support."
          />

          {!isEditing ? (
            <Button variant="contained" fullWidth onClick={() => setIsEditing(true)}>
              Edit Details
            </Button>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ name: user.name, email: user.email });
                  setErrors({ name: "", email: "" });
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting || !hasChanges()}
                onClick={() => setConfirmOpen(true)}
              >
                {isSubmitting ? "Updating..." : "Confirm & Update"}
              </Button>
            </Stack>
          )}
        </Stack>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          TransitionComponent={Transition}
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 2,
              backdropFilter: "blur(6px)",
              background: "rgba(255,255,255,0.9)",
              boxShadow: 5,
            },
          }}
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "#3f51b5" }}>
            <MdOutlineVerifiedUser className="text-xl" />
            Confirm Update
          </DialogTitle>
          <DialogContent sx={{ fontSize: "1rem", py: 1, color: "#333" }}>
            Are you sure you want to update your profile details?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmOpen(false)}
              sx={{
                color: "#f44336",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                handleSubmit();
              }}
              sx={{
                background: "linear-gradient(to right, #e7516c, #21679c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                borderRadius: 2,
                px: 3,
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  background: "linear-gradient(to right, #e7516c, #21679c)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                },
              }}
            >
              Yes, Update
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer position="top-center" autoClose={3000} />
      </section>
    </div>
    <Footer />
    </>
    
  );
};

export default AccountDetails;
