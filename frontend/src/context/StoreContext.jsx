import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { food_list as staticFoodList } from "../assets/frontend_assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  
  // Use environment variable for backend URL
  // On production (Vercel): Set VITE_API_URL in environment variables
  // On local development: Falls back to localhost:4000
  const url = (() => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
      console.log("[StoreContext] Using backend URL from env:", envUrl);
      return envUrl;
    }
    const fallbackUrl = "http://localhost:4000";
    console.log("[StoreContext] Using fallback localhost URL:", fallbackUrl);
    return fallbackUrl;
  })();
  
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [food_list] = useState(staticFoodList);

  useEffect(() => {
    axios.defaults.baseURL = url;
  }, [url]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.token = token;
      localStorage.setItem("token", token);
      return;
    }
    delete axios.defaults.headers.common.token;
  }, [token]);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    const authToken = localStorage.getItem("token");
    if (authToken) {
      try {
        const response = await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token: authToken } }
        );
        if (response.data.success) {
          toast.success("Item added to cart");
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        toast.error("Unable to add item right now");
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    const authToken = localStorage.getItem("token");
    if (authToken) {
      try {
        const response = await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token: authToken } }
        );
        if (response.data.success) {
          toast.success("Item removed from cart");
        } else {
          toast.error("Something went wrong");
        }
      } catch (error) {
        toast.error("Unable to remove item right now");
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const loadCartData = async (authToken) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token: authToken } }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      setCartItems({});
    }
  };

  useEffect(() => {
    async function loadData() {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
