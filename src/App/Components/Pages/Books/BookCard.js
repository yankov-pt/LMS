
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
        padding: '0 10px 10px',
        position: 'relative',
        '& h3': {
            margin: '0'
        }
    },
    language: {
        position: 'absolute',
        bottom: '100%',
        backgroundColor: '#FFF34E',
        borderRadius: '10px 10px 0px 0px',
        padding: '5px 5px 2px',
        margin: '5px 0',
        fontWeight: 'bold'
    },
    genres: {
        display: 'flex',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        position: 'relative',

        '&::before': {
            content: '""',
            display: 'block',
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)',
            width: '40px',
            height: '20px',
            position: 'absolute',
            right: '0'
        }

    },
    genre: {
        color: '#6C757D',
        margin: '0 10px 0 0',
        display: 'inline-block',
        whiteSpace: 'nowrap'
    },
    title: {
        fontWeight: 'bold',
        fontSize: '25px',
        lineHeight: '28px',
        color: 'black'
    },
    author: {
        fontSize: '16px',
        lineHeight: '19px',
        margin: 0,
        fontWeight: '500',
        color: 'black'

    }
}));
function BookCard({ book }) {
    const classes = useStyles();


    return (


        <Paper elevation={3} className={classes.card}>
            <Link style={{ textDecoration: 'none' }} to={{
                pathname: `/books/${book.id}`,
                state: { book: book }
            }}>
                <img src={book.cover} />
            </Link>
            <div className={classes.textCont}>
                <p className={classes.language}>{book.language}</p>
                <div className={classes.genres}>
                    {book.genre.map(el =>
                        (<Link style={{ textDecoration: 'none' }} to={{
                            pathname: `/category/${el}`,
                            state: { book: book }
                        }}>
                            <p className={classes.genre}>#{el}</p>
                        </Link>)
                    )}
                </div>
                <Link style={{ textDecoration: 'none' }} to={{
                    pathname: `/books/${book.id}`,
                    state: { book: book }
                }}>
                    {book.title.length > 47
                        ? <h3 className={classes.title}>{book.title.substring(0, 47)}...</h3>
                        : <h3 className={classes.title}>{book.title}</h3>}
                    <h5 className={classes.author}>{book.author}</h5>
                </Link>

            </div>
        </Paper>
    );
}

export default BookCard;
