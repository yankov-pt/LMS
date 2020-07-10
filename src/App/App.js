
import React, { Component, Suspense, useState, useContext, useEffect } from "react";

import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { UserProvider } from "./Context/userContext";
import { UserTypeProvider } from "./Context/userTypeContext";
import Content from './Components/Content'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#225164',
        },
        secondary: {
            main: "#FDF74D"
        },
        social: {
            main: "#1EA09F"
        }
    },
});





function App() {


    return (
        <ThemeProvider theme={theme}>
            <Router>
                <UserProvider>
                    <UserTypeProvider>
                        <Content />
                    </UserTypeProvider>
                </UserProvider >

            </Router>
        </ThemeProvider>
    );
}

export default App;
