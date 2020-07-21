
import React, { useEffect, useState } from "react";
import Grid from '@material-ui/core/Grid';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Link, Route, Switch, Redirect, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    card: {
        borderRadius: '20px',
        '& img':
        {
            borderRadius: '20px 20px 0 0',

            width: "100%",
            objectFit: 'cover',
            height: '400px'
        }
    },
    textCont: {
        padding: '15px',
        '& h3': {
            margin: '0'
        }
    }
}));
function BookCard({ book }) {
    const classes = useStyles();


    return (
        <Grid item xs={3}>
            <Link style={{ textDecoration: 'none' }} to={{
                pathname: `/books/${book.id}`,
                state: { book: book }
            }}>
                <Paper elevation={3} className={classes.card}>
                    <img src={book.cover} />
                    <div className={classes.textCont}>
                        <p >{book.language}</p>
                        <p >{book.genre}</p>
                        <h3 >{book.title}</h3>
                        <h5 >{book.author}</h5>
                    </div>
                </Paper>
            </Link>
        </Grid>
    );
}

export default BookCard;
