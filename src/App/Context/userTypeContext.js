import React, { useState, createContext, useEffect, useContext } from "react";
import { UserContext } from "./userContext";


export const UserTypeContext = createContext({});

export  function UserTypeProvider(props) {
  const [role, setRole] = useState({})



  return (
    <UserTypeContext.Provider value={[role, setRole]}>
      {props.children}
    </UserTypeContext.Provider>
  );
}
