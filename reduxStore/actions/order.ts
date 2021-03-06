import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const fetchOrders = () => {
  try {
    return async (dispatch: any, getState: any) => {
      const token = getState().auth.token;
      const userId = getState().auth.userId;
      const response = await fetch(
        `https://theshopapp-2071e-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`
      );
      if (!response.ok) {
        throw new Error("something went wrong");
      }
      const resData = await response.json();
      const loadedOrders = [];
      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        );
      }
      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    };
  } catch (error) {
    throw error;
  }
};

export const addOrder = (cartItems: any, totalAmount: any) => {
  try {
    const data = new Date();
    return async (dispatch: any, getState: any) => {
      const token = getState().auth.token;
      const userId = getState().auth.userId;
      const response = await fetch(
        `https://theshopapp-2071e-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartItems,
            totalAmount,
            date: data.toISOString(),
          }),
        }
      );
      const resData = await response.json();
      dispatch({
        type: ADD_ORDER,
        orderData: {
          id: resData.name,
          items: cartItems,
          amount: totalAmount,
          date: data,
        },
      });
    };
  } catch (error) {}
};
