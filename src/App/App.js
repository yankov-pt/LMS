
import React, { Component, Suspense, useState, useContext, useEffect } from "react";

import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { UserProvider } from "./Context/userContext";
import { UserTypeProvider } from "./Context/userTypeContext";
import Content from './Components/Content'

import './styles.css'

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
        },
        white: {
            main: '#ffffff'
        }
    },

    typography: {
        h1: {
            fontSize: 72,
            fontFamily: '"Nunito", Arial, Helvetica, sans-serif'
        },
        h2: {
            fontSize: 60,
            fontFamily: '"Nunito", Arial, Helvetica, sans-serif'
        },
        h3: {
            fontSize: 52,
            fontFamily: '"Nunito", Arial, Helvetica, sans-serif'
        },
        h4: {
            fontSize: 36,
            fontFamily: '"Nunito", Arial, Helvetica, sans-serif'
        },
        h5: {
            fontSize: 30,
            fontFamily: '"Nunito", Arial, Helvetica, sans-serif'
        },
        h6: {
            fontSize: 24,
            fontFamily: '"Nunito", Arial, Helvetica, sans-serif'
        },
        subtitle1: {
            fontSize: 18,
            fontFamily: '"Nunito", Arial, Helvetica, sans-serif'
        },
        subtitle2: {
            fontSize: 16,
            fontFamily: '"Nunito", Arial, Helvetica, sans-serif'
        },
        body1: {
            fontSize: 16,
            fontFamily: '"Nunito", Arial, Helvetica, sans-serif'
        },
        body2: {
            fontSize: 14,
            fontFamily: '"Nunito", Arial, Helvetica, sans-serif'
        },
        button: {
            fontSize: 14,
            fontFamily: '"Nunito", Arial, Helvetica, sans-serif'
        },

    }
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
