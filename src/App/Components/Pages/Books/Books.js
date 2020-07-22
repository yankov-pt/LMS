
import React, { useEffect, useState } from "react";
import { firestore } from '../../Firebase/firebase'
import Grid from '@material-ui/core/Grid';
import BookCard from './BookCard'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
    cards: {
        maxWidth: '1200px',
        margin: "0 auto"

    }
}));
function Books() {
    const classes = useStyles();

    const [books, setBooks] = useState([])
    const [filteredBooks, setFilteredBooks] = useState([])
    const [searchBook, setSearchBook] = useState('')
    useEffect(() => {
        const fetchData = async () => {
            const data = await firestore.collection("books").get();
            setBooks(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            setFilteredBooks(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        };
        fetchData();
        console.log(books)
    }, []);
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

    return (
        <Container component="main" >

            <Typography variant="h1" component="h1">Books</Typography>
            <TextField
                className={classes.searchBar}
                id="standard-search"
                label="Търси по заглавие или автор"
                fullWidth
                value={searchBook}
                type="search"
                onChange={(e) => setSearchBook(e.target.value)} />
            <Grid
                container
                direction="row"
                justify="center"
                spacing={5}
                className={classes.cards}
            >

                {filteredBooks.map(book => (
                    <BookCard key={book.id} book={book} />
                ))}
            </Grid>
        </Container>
    );
}

export default Books;
