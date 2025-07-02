"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ Import Next.js Image component
import { IconButton } from "@mui/material";
import useCartLogic from "./CartLogic";

const CartUI = ({ cartLoaded, cartLoadedToggle }) => {
  const {
    cartDataArray,
    finalTotal,
    onIncrement,
    onDecrement,
    handleRemoveFromCart,
  } = useCartLogic(cartLoaded, cartLoadedToggle);

  return (
    <div className="cart">
      <h2>Cart</h2>

      {cartDataArray.length === 0 ? (
        <div className="emptyStyle">
          <Image
            src="/assets/images/emptyCart.webp"
            alt="Empty Cart"
            width={72}
            height={72}
            className="emptyImg"
          />
          <p className="text-center">No services added.</p>
        </div>
      ) : (
        <>
          {cartDataArray?.map((service) => (
            <div key={service.service_id} className="max-h-90 overflow-x-auto">
              <p className="ml-2.5">{service.leadtype_name}</p>

              {service.cart_dtls?.map((item) => (
                <div className="cart-item-body" key={item.cart_id}>
                  <div className="cart-item">
                    <div className="service-details flex items-start flex-col">
                      <div className="flex items-center gap-4">
                        <span>{item.service_name}</span>

                        <div className="quantity-control">
                          <button
                            className="IncrementDcrementBtn"
                            onClick={() =>
                              onDecrement(
                                item.service_id,
                                "delete",
                                item.quantity
                              )
                            }
                          >
                            -
                          </button>
                          <span>{item.quantity || 1}</span>
                          <button
                            className="IncrementDcrementBtn"
                            onClick={() =>
                              onIncrement(
                                item.service_id,
                                "add",
                                item.quantity
                              )
                            }
                            disabled={(item.quantity || 1) >= 5}
                            style={{
                              opacity: (item.quantity || 1) >= 5 ? 0.5 : 1,
                              cursor:
                                (item.quantity || 1) >= 5
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.description,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col px-1">
                      ₹{item.price}
                      <IconButton
                        onClick={() =>
                          handleRemoveFromCart(item.service_id, "delete")
                        }
                        color="error"
                        className="p-0"
                      >
                        <Image
                          src="/assets/images/Remove.png"
                          alt="Remove"
                          width={24}
                          height={24}
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
              <Link href={"/checkout"}>
                <div
                  className="cart-total forMb"
                  style={{ cursor: "pointer" }}
                >
                  <strong>Total: ₹{finalTotal}</strong>
                  <button>View Cart</button>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartUI;
