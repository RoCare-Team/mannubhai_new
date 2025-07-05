"use client"
import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import Link from "next/link";
import { toast } from "react-toastify";

const Cart = ({ cartLoaded, cartLoadedToggle }) => {
  const [cartDataArray, setCartDataArray] = useState([]);
  const [finalTotal, setFinalTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Validate and parse cart data safely
  const getValidCartData = () => {
    try {
      const cartData = localStorage.getItem('checkoutState');
      if (!cartData) return [];
      
      const parsedData = JSON.parse(cartData);
      return Array.isArray(parsedData) ? parsedData : [];
    } catch (error) {
      console.error("Error parsing cart data:", error);
      return [];
    }
  };

  const displayCartData = () => {
    setIsLoading(true);
    try {
      const cartData = getValidCartData();
      setCartDataArray(cartData);

      // Calculate total safely
      const total = cartData.reduce((sum, item) => {
        const itemTotal = Number(item.total_main) || 0;
        return sum + itemTotal;
      }, 0);

      setFinalTotal(total);
      localStorage.setItem('cart_total_price', total.toString());
    } catch (error) {
      console.error("Error displaying cart data:", error);
      toast.error("Failed to load cart data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    displayCartData();
  }, [cartLoaded]);

  const handleCartAction = async (service_id, action, currentQuantity = 0) => {
    const cid = localStorage.getItem("customer_id");
    if (!cid) {
      toast.error("Please login to update cart");
      return;
    }

    setIsLoading(true);
    try {
      let quantity = currentQuantity;
      
      if (action === 'increment') {
        if (quantity >= 5) {
          toast.error("You can't add more than 5 items");
          return;
        }
        quantity += 1;
      } else if (action === 'decrement') {
        quantity = Math.max(0, quantity - 1);
      } else if (action === 'remove') {
        quantity = 0;
      }

      const payload = { 
        service_id, 
        type: action === 'remove' ? 'delete' : 'add', 
        cid, 
        quantity 
      };

      const res = await fetch(
        "https://waterpurifierservicecenter.in/customer/ro_customer/add_to_cart.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      
      if (data.AllCartDetails) {
        localStorage.setItem('checkoutState', JSON.stringify(data.AllCartDetails));
        localStorage.setItem('cart_total_price', data.total_main || '0');
        
        // Update cart items list
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        if (quantity === 0) {
          const updatedItems = cartItems.filter(id => id !== service_id);
          localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        } else if (!cartItems.includes(service_id)) {
          localStorage.setItem('cartItems', JSON.stringify([...cartItems, service_id]));
        }

        displayCartData();
        if (typeof cartLoadedToggle === 'function') {
          cartLoadedToggle();
        }
        
        toast.success(data.msg || "Cart updated successfully");
      }
    } catch (error) {
      console.error("Cart action failed:", error);
      toast.error("Failed to update cart");
    } finally {
      setIsLoading(false);
    }
  };

  const onIncrement = (service_id, qunt) => 
    handleCartAction(service_id, 'increment', qunt);

  const onDecrement = (service_id, qunt) => 
    handleCartAction(service_id, 'decrement', qunt);

  const handleRemoveFromCart = (service_id) => 
    handleCartAction(service_id, 'remove');

  return (
    <div className="cart">
      <h2>Cart</h2>

      {isLoading ? (
        <div className="loadingStyle">
          <p>Loading cart...</p>
        </div>
      ) : cartDataArray.length === 0 ? (
        <div className="emptyStyle">
          <img 
            src="/Cart/emptyCart.webp" 
            alt="Empty Cart" 
            className="emptyImg" 
            height="auto" 
            width={72} 
          />
          <p className="text-center">No services added.</p>
        </div>
      ) : (
        <>
          {cartDataArray.map((service) => (
            <div key={service.cart_id || service.service_id} className="max-h-90 overflow-x-auto">
              {service.leadtype_name && <p className="ml-2.5">{service.leadtype_name}</p>}

              {service.cart_dtls?.map((item) => (
                <div className="cart-item-body" key={item.cart_id || item.service_id}>
                  <div className="cart-item">
                    <div className="service-details flex items-start flex-col">
                      <div className="flex items-center gap-4">
                        <span>{item.service_name}</span>
                        <div className="quantity-control">
                          <button 
                            className="IncrementDcrementBtn" 
                            onClick={() => onDecrement(item.service_id, item.quantity || 1)}
                            disabled={(item.quantity || 1) <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity || 1}</span>
                          <button
                            className="IncrementDcrementBtn"
                            onClick={() => onIncrement(item.service_id, item.quantity || 1)}
                            disabled={(item.quantity || 1) >= 5}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {item.description && (
                        <div className="text-xs text-gray-400">
                          <div dangerouslySetInnerHTML={{ __html: item.description }} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col px-1">
                      ₹{item.price || '0'}
                      <IconButton 
                        onClick={() => handleRemoveFromCart(item.service_id)} 
                        color="error" 
                        className="p-0"
                      >
                        <img 
                          src="/Cart/Remove.png" 
                          alt="Remove" 
                          style={{ width: 24, height: 24 }} 
                        />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="cart-footer">
            <div className="totalSection">
              <Link href="/checkout" passHref>
                <div className="cart-total forMb" style={{ cursor: 'pointer' }}>
                  <strong>Total: ₹{finalTotal.toFixed(2)}</strong>
                  <button disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'View Cart'}
                  </button>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;