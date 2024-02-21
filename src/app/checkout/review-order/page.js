"use client";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/interceptor/api";
const ReviewOrderPage = () => {
  const router = useRouter();
  const { orderID, setOrderID } = useCart();
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const jwt = localStorage.getItem("jwt");
  const [ordersItem, setOrdersItem] = useState([]);
  const [Order, setOrder] = useState({});
  const getOrderItems = async (orderID) => {
    try {
      const response = await axiosInstance.get(
        baseURL + `ordersItem/by-order-id/` + orderID.toString(),
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      const data = response.data.data;
      setOrdersItem(data);
    } catch (error) {
      console.error(error);
    }
  };
  const getOrder = async (orderID) => {
    try {
      const response = await axiosInstance.get(
        baseURL + `orders/by-id/` + orderID.toString(),
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      const data = response.data.data;
      setOrder(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleFinishReview = () => {
    setOrderID(null);
    setOrdersItem([]);
    setOrder({});
    router.push("/products");
  };
  useEffect(() => {
    if (orderID) {
      getOrderItems(orderID);
      getOrder(orderID);
    }
    Order;
  }, [orderID]);
  const renderCartItems = () => {
    return ordersItem.map((item) => (
      <tr key={item.order_item_id}>
        <td className="py-4">
          <div className="flex items-center">
            <img
              className="h-16 w-16 mr-4"
              src={item.image}
              alt="Product image"
            />
            <span className="font-semibold">{item.product.productName}</span>
          </div>
        </td>
        <td className="py-4">${item.product.price}</td>
        <td className="py-4">
          <div className="flex items-center">
            <span className="text-center w-8">{item.quantity}</span>
          </div>
        </td>
        <td className="py-4">${item.product.price * item.quantity}</td>
      </tr>
    ));
  };
  return (
    <>
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
            <div className="md:w-3/4 flex flex-row gap-4">
              <div className="bg-white rounded-lg shadow-md p-6 md:w-1/3">
                <h2 className="text-lg font-semibold mb-4">Coupon Promotion</h2>
                <div className="flex justify-between mb-2">
                  <span>Coupon Code</span>
                  <span>{Order.coupon?.couponCode}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Discount Value</span>
                  <span className="font-semibold">
                    %{Order.discountPercent}
                  </span>
                </div>
              </div>
              {/* TOTAL CONTAINER */}
              <div className="bg-white rounded-lg shadow-md p-6 md:w-1/3">
                <h2 className="text-lg font-semibold mb-4">Summary</h2>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${Order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Coupon Discount</span>
                  <span>
                    $
                    {((Order.subtotal * Order.discountPercent) / 100)?.toFixed(
                      2
                    )}
                  </span>
                </div>

                <hr className="my-2" />
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    ${Order.total?.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 md:w-1/3">
                <h2 className="text-lg font-semibold mb-4">Customer</h2>
                <div className="flex justify-between mb-2">
                  <span>Customer Name:</span>
                  <span>{Order.customer?.customerName}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Order Date</span>
                  <span>{new Date(Order.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Phone Number:</span>
                  <span>{Order.customer?.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>
          <div>Thank you for shopping with us! </div>
          <button
            type="button"
            className="hover:bg-clip-text hover:text-transparent bg-gradient-to-br from-[#2b68e0] to-[#e710ea] border-solid border-2 border-[#5356e3]  font-bold text-white px-5 py-2 rounded-full "
            onClick={handleFinishReview}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
};
export default ReviewOrderPage;
