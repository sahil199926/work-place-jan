import React, { createContext, useEffect, useReducer } from "react";

export const userContext = createContext();

const initialState = JSON.parse(localStorage.getItem("user")) || {
  userAuth: false,
  userType: null,
  userInfo: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      const data = {
        userAuth: true,
        userType: action.payload.type,
        userInfo: action.payload,
      };
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    case "LOGOUT":
      localStorage.clear();
      return {
        userAuth: false,
        userType: null,
        userInfo: null,
      };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log(state);
  }, [state]);
  return (
    <userContext.Provider value={[state, dispatch]}>
      {children}
      {/* all the components which will have the access to this context */}
    </userContext.Provider>
  );
};

// initilize the context
// initial value is null
// create reducer
// create provider
