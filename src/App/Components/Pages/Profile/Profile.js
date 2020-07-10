
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/userContext";
import { auth } from "../../Firebase/firebase";
import withAuthorization from '../../../Session/withAuthorization'

function Profile() {
    return (
        <UserContext.Consumer>
            {authUser => (

                authUser[0] !== undefined ?
                    (
                        <div className="content">
                            <h1>Hello {authUser[0].username}!</h1>
                            <h3>E-mail: {authUser[0].email}</h3>
                            <button className="w-full py-3 bg-red-600 mt-4 text-white" onClick={() => { auth.signOut() }}>Sign out</button>
                        </div>
                    )
                    : null
            )}
        </UserContext.Consumer>
    );
}
const condition = authUser => authUser.role !== "banned";

export default withAuthorization(condition)(Profile);