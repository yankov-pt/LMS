
import React, { useEffect, useState } from "react";
import { firestore } from '../../Firebase/firebase'
import Grid from '@material-ui/core/Grid';
import BookCard from './BookCard'
import { makeStyles } from '@material-ui/core/styles';
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
    useEffect(() => {
        const fetchData = async () => {
            const data = await firestore.collection("books").get();
            setBooks(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchData();
        console.log(books)
    }, []);

    return (
        <Container component="main" >

            <h1>Books</h1>
            <Grid
                container
                direction="row"
                justify="center"
                spacing={5}
                className={classes.cards}
            >

                {books.map(book => (
                    <BookCard key={book.id} book={book} />
                ))}
            </Grid>
        </Container>
    );
}

export default Books;
