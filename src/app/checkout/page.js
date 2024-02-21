"use client";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import axiosInstance from "../utils/interceptor/api";
function CheckoutPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useUser();
  const jwt = localStorage.getItem("jwt");
  const { cartItems, setCartItems, orderID, setOrderID } =
    useContext(CartContext);
  const [coupon, setCoupon] = useState(null);
  const [couponValue, setCouponValue] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const handleSubmitCoupon = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("coupon/get-by-code", {
        couponCode: coupon,
      });
      const data = response.data.data;
      isValidCoupon(data);
    } catch (error) {
      console.error(error);
    }
  };
  const postNewOrder = async () => {
    try {
      const response = await axiosInstance.post(
        "orders/insert",
        {
          coupon: { couponCode: coupon },
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      const data = response.data.data;
      // console.log(data.order_id);
      setOrderID(data.order_id);
      return data.order_id; // Return the new order ID
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      try {
        const newOrderId = await postNewOrder(); // Wait for the new order ID
        for (const item of cartItems) {
          await postNewOrderItem(newOrderId, item); // Call postNewOrderItem for each item
        }
        await handleToCheckoutReview(newOrderId); // Navigate to the review order page
        // After all items are inserted, navigate to the review order page
        // router.push("/checkout/review-order");
      } catch (error) {
        // Handle errors, such as showing an error message to the user
      }
    }
  };

  const postNewOrderItem = async (orderID, item) => {
    try {
      const response = await axiosInstance.post(
        "ordersItem/insert",
        {
          product: { id: item.id },
          quantity: item.quantity,
          coupon: { couponCode: coupon },
          order: { order_id: orderID },
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      const data = response.data.data;
    } catch (error) {
      console.error(error);
    }
  };
  const handleToCheckoutReview = (orderID) => {
    setOrderID(orderID);
    setCartItems([]);
    setCoupon(null);
    setCouponError("");
    setCouponValue(0);
    setDiscountAmount(0);
    setSubTotal(0);
    setTotal(0);
    router.push("/checkout/review-order");
  };

  const isValidCoupon = (data) => {
    if (data.active == true) {
      setCouponValue(data.discountPercent);
      setCartItems((prevItems) =>
        prevItems.map((item) => ({ ...item, couponCode: data.couponCode }))
      );
    } else {
      setCouponError("Coupon is not valid or have been used !");
    }
  };
  const calculateTotalPrice = (items) => {
    let totalPrice = 0;
    items.forEach((item) => {
      totalPrice += item.quantity * item.price;
    });
    setSubTotal(totalPrice);
    let discount = (totalPrice * couponValue) / 100;
    setDiscountAmount(discount);
    setTotal(totalPrice - discount);
  };
  const decreaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const increaseQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== itemId);
      calculateTotalPrice(updatedItems); // Pass the updated items to calculate the new total
      return updatedItems;
    });
  };
  const renderCartItems = () => {
    return cartItems.map((item) => (
      <tr key={item.id}>
        <td className="py-4">
          <div className="flex items-center">
            <img
              className="h-16 w-16 mr-4"
              src={item.image}
              alt="Product image"
            />
            <span className="font-semibold">{item.productName}</span>
          </div>
        </td>
        <td className="py-4">${item.price}</td>
        <td className="py-4">
          <div className="flex items-center">
            <button
              className="border rounded-md py-2 px-4 mr-2"
              onClick={() => decreaseQuantity(item.id)}
            >
              {" "}
              -{" "}
            </button>
            <span className="text-center w-8">{item.quantity}</span>
            <button
              className="border rounded-md py-2 px-4 ml-2"
              onClick={() => increaseQuantity(item.id)}
            >
              {" "}
              +{" "}
            </button>
          </div>
        </td>
        <td className="py-4">${item.price * item.quantity}</td>
        <td className="py-4">
          <button onClick={() => removeFromCart(item.id)}>
            <svg
              enableBackground="new 0 0 32 32"
              height="32px"
              id="Layer_1"
              version="1.1"
              viewBox="0 0 32 32"
              width="32px"
              xmlSpace="preserve"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <path
                d="M20.377,16.519l6.567-6.566c0.962-0.963,0.962-2.539,0-3.502l-0.876-0.875c-0.963-0.964-2.539-0.964-3.501,0  L16,12.142L9.433,5.575c-0.962-0.963-2.538-0.963-3.501,0L5.056,6.45c-0.962,0.963-0.962,2.539,0,3.502l6.566,6.566l-6.566,6.567  c-0.962,0.963-0.962,2.538,0,3.501l0.876,0.876c0.963,0.963,2.539,0.963,3.501,0L16,20.896l6.567,6.566  c0.962,0.963,2.538,0.963,3.501,0l0.876-0.876c0.962-0.963,0.962-2.538,0-3.501L20.377,16.519z"
                fill="#515151"
              />
            </svg>
          </button>
        </td>
      </tr>
    ));
  };
  useEffect(() => {
    calculateTotalPrice(cartItems);
  }, []);
  useEffect(() => {
    calculateTotalPrice(cartItems);
  }, [cartItems, couponValue]);
  return (
    <div className="bg-gray-100 h-max py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
        <div className="flex flex-col md:flex-column gap-4">
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-semibold">Product</th>
                    <th className="text-left font-semibold">Price</th>
                    <th className="text-left font-semibold">Quantity</th>
                    <th className="text-left font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>{renderCartItems()}</tbody>
              </table>
            </div>
          </div>
          {/* COUPON PROMOTION CONTAINER */}
          <div className="md:w-2/4 flex flex-row gap-4">
            <form
              className="bg-white rounded-lg shadow-md p-6 md:w-2/4"
              onSubmit={handleSubmitCoupon}
            >
              <h2 className="text-lg font-semibold mb-4">Coupon Promotion</h2>
              <div className="flex justify-between mb-2 h-10">
                <label>Coupon Code</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setCoupon(e.target.value);
                  }}
                />
              </div>
              {couponError ? (
                <div className="">
                  <p className="text-rose-600">{couponError}</p>
                </div>
              ) : (
                <></>
              )}
              <hr className="my-2" />
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Discount Value</span>
                <span className="font-semibold">{couponValue}%</span>
              </div>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full  "
                type="submit"
              >
                Apply
              </button>
            </form>
            {/* TOTAL CONTAINER */}
            <form
              className="bg-white rounded-lg shadow-md p-6 md:w-2/4"
              onSubmit={handleCheckout}
            >
              <h2 className="text-lg font-semibold mb-4">Summary</h2>
              <div className="flex justify-between  h-5">
                <span>Subtotal</span>
                <span>${subTotal}</span>
              </div>
              <div className="flex justify-between mb-2 h-5">
                <span>Coupon Discount</span>
                <span>${discountAmount.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${total}</span>
              </div>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full  "
                type="submit"
              >
                Checkout
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
