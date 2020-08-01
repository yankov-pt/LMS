
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
        margin: "0 auto",
        width: '100%'

    }
}));
function Books(searchWord) {
    const classes = useStyles();
    var searchString = ''
    if (searchWord.location.searchWord?.length > 0) {
        searchString = searchWord.location.searchWord
    }
    const [books, setBooks] = useState([])
    const [filteredBooks, setFilteredBooks] = useState([])
    const [searchBook, setSearchBook] = useState(searchString)
    useEffect(() => {
        const fetchData = async () => {
            const data = await firestore.collection("books").get()
            setBooks(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            if (searchString.length > 0) {
                console.log('hiiiiiiiiiiii')
                setSearchBook(searchString)
                const arr = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
                setFilteredBooks(arr.filter(book =>
                    book.title.toLowerCase().includes(searchBook.toLowerCase()) || book.author.toLowerCase().includes(searchBook.toLowerCase())))

            }
            else {
                setFilteredBooks(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))

            }
        };

        fetchData();
        console.log(books)
    }, []);

    useEffect(() => {
        console.log(searchBook)
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

            <Typography variant="h1" component="h1">Книги</Typography>
            <Grid
                container
                direction="row"
                spacing={2}
            >
                <Grid item xs={12} sm={4} md={3}>
                    <TextField
                        className={classes.searchBar}
                        id="standard-search"
                        label="Търси по заглавие или автор"
                        fullWidth
                        value={searchBook}
                        type="search"
                        onChange={(e) => setSearchBook(e.target.value)}

                    />
                </Grid>
                <Grid item xs={4}>
                    Категория
                </Grid>
                <Grid item xs={4}>
                    Език
                </Grid>
            </Grid>

            <Grid
                container
                direction="row"
                justify="center"
                spacing={5}
                className={classes.cards}
            >
                {filteredBooks.length > 0
                    ? filteredBooks.map((book) => (
                        <Grid key={book.id} item xs={12} sm={4} md={3}>
                            <BookCard book={book} />
                        </Grid>
                    ))
                    : <Typography variant="h5" component="h5">Няма намерени резултати</Typography>
                }

            </Grid>
        </Container>
    );
}

export default Books;
