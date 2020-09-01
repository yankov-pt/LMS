import React, { useEffect, useState } from "react";
import { firestore } from '../../../Firebase/firebase'
import { BrowserRouter as Router, Link, useHistory } from 'react-router-dom';

// import { firestore } from 'firebase-admin';
import * as firebase from 'firebase';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import BookCard from '../BookCard'

import Grid from '@material-ui/core/Grid';
import UserRow from '../../Admin/UserRow'


const useStyles = makeStyles((theme) => ({
    paper: {
        height: '100%',
        padding: '16px',
        '.MuiTableRow-root:hover': {
            backgroundColor: 'red'
        }
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    cards: {
        maxWidth: '1200px',
        margin: "0 auto"

    }
}));

function Category({ match, location }) {
    const classes = useStyles();
    const [books, setBooks] = useState([])
    const [filteredBooks, setFilteredBooks] = useState([])
    const [genre, setGenre] = useState('')
    const [searchBook, setSearchBook] = useState('')

    const fetchData = async (res) => {
        const data = await firestore.collection("books")
            .where("genre", "array-contains", res).get()

        const filteredData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        setBooks(filteredData)
        setFilteredBooks(filteredData)
    };
    useEffect(() => {
        let filteredArray = books
        if (searchBook === '') {
            setFilteredBooks(filteredArray)
        }
        else {
            setFilteredBooks(filteredArray.filter(book =>
                book.title.toLowerCase().includes(searchBook.toLowerCase()) || book.author.toLowerCase().includes(searchBook.toLowerCase())))
        }
    }, [searchBook])
    const history = useHistory();

    useEffect(() => {
        var str = history.location.pathname;
        var n = str.lastIndexOf('/');
        var res = str.substring(n + 1)
        fetchData(res)
        setGenre(res)

    }, [match])

    return (
        <Container component="main">
            <Typography variant="h6" noWrap>
                {genre}
            </Typography>
            <TextField
                className={classes.searchBar}
                id="standard-search"
                label="Търси по заглавие или автор"
                fullWidth
                value={searchBook}
                type="search"
                onChange={(e) => setSearchBook(e.target.value)} />
            <CssBaseline />
            <Grid
                container
                direction="row"
                justify="center"
                spacing={5}
                className={classes.cards}
            >

                {filteredBooks.map((book, index) => (
                    <Grid key={index} item xs={12} sm={4} md={3}>
                        <BookCard key={book.id} book={book} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Category;
