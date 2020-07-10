import React, { useState, createContext, useEffect } from "react";
import { auth, generateUserDocument } from "../Components/Firebase/firebase";


export const UserContext = createContext({});

export function UserProvider(props) {
  const [user, setUser] = useState()


  useEffect(() => {

    auth.onAuthStateChanged(async userAuth => {
      const userс = await generateUserDocument(userAuth);
      setUser( userс );
    });
  }, [])
  

  return (
    <UserContext.Provider value={[user, setUser]}>
      {props.children}
    </UserContext.Provider>
  );
}
