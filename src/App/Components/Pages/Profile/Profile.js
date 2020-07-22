
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/userContext";
import { auth } from "../../Firebase/firebase";
import withAuthorization from '../../../Session/withAuthorization'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

function Profile() {
    return (
        <Container component="main" >

            <UserContext.Consumer>
                {authUser => (

                    authUser[0] !== undefined ?
                        (
                            <div className="content">
                                <Typography variant="h1" component="h1">Hello {authUser[0].username}!</Typography>
                                <h3>E-mail: {authUser[0].email}</h3>
                                <button className="w-full py-3 bg-red-600 mt-4 text-white" onClick={() => { auth.signOut() }}>Sign out</button>
                            </div>
                        )
                        : null
                )}
            </UserContext.Consumer>
        </Container>
    );
}
const condition = authUser => authUser.role !== "banned";

export default withAuthorization(condition)(Profile);