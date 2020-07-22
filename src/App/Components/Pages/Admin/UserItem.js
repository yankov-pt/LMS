
import React, { useEffect, useContext, useState, useRef } from "react";
import { BrowserRouter as Router, Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { firestore } from '../../Firebase/firebase'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import withAuthorization from '../../../Session/withAuthorization'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
    cards: {
        maxWidth: '1200px',
        margin: "0 auto"
    },
    clendar: {
        "& .rdrDefinedRangesWrapper": {
            display: 'none'
        }
    },
    paper: {
        height: '100%',
        padding: '16px',
        '.MuiTableRow-root:hover': {
            backgroundColor: 'red'
        }
    },
}));


function UserItem(book) {
    const classes = useStyles();
    const [user, setUser] = useState({});
    const [currentBooks, setCurrentBooks] = useState([])
    const [futureBooks, setFutureBooks] = useState([])
    const [pastBooks, setPastBooks] = useState([])


    const GetUserById = (uid) => {
        firestore.collection('users').doc(uid).get().then((docRef) => { setUser(docRef.data()) })
            .catch((error) => { })
    }
    const history = useHistory();
    useEffect(() => {
        // var reservedArray = new Array();
        var str = history.location.pathname;
        var n = str.lastIndexOf('/');
        var res = str.substring(n + 1)
        GetUserById(res)

    }, [])

    useEffect(() => {
        console.log(user)
        var newArr = []
        if (user.booksCurrentlyInUser) {
            user.booksCurrentlyInUser.map(el => {
                firestore.collection('books').doc(el.book).get().then(data => {
                    var newelem = {
                        bookID: el.book,
                        startDate: el.startDate,
                        endDate: el.endDate,
                        book: data.data()
                    }
                    setCurrentBooks(old => [...old, newelem])
                })

            })
        }
        if (user.futureBooks) {
            user.futureBooks.map(el => {
                firestore.collection('books').doc(el.book).get().then(data => {
                    var newelem = {
                        bookID: el.book,
                        startDate: el.startDate,
                        endDate: el.endDate,
                        book: data.data()
                    }
                    setFutureBooks(old => [...old, newelem])
                })

            })
        }
        if (user.returnedBooks) {
            user.returnedBooks.map(el => {
                firestore.collection('books').doc(el.book).get().then(data => {
                    var newelem = {
                        bookID: el.book,
                        startDate: el.startDate,
                        endDate: el.endDate,
                        book: data.data()
                    }
                    setPastBooks(old => [...old, newelem])
                })

            })
        }
    }, [user])


    useEffect(() => {
        console.log(currentBooks)
    }, [currentBooks])

    return (
        <Container component="main" >

            <Typography variant="h1" component="h1">{user.username}</Typography>
            <Typography variant="h1" component="h1">{user.role}</Typography>
            <Grid container spacing={2} >
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <Typography variant="h4" component="div">
                            Книги в потребителя
                        </Typography>
                        <TableContainer >
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Книга</TableCell>
                                        <TableCell>Автор</TableCell>
                                        <TableCell>От дата</TableCell>
                                        <TableCell>До дата</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentBooks.length ?
                                        currentBooks.map((row) => (
                                            <TableRow key={row.bookID}>
                                                <TableCell component="th" scope="row">
                                                    <Link style={{ textDecoration: 'none' }} to={{ pathname: `/books/${row.bookID}` }}>
                                                        {row.book.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {row.book.author}

                                                </TableCell>
                                                <TableCell>{row.startDate.toDate().toDateString()}</TableCell>
                                                <TableCell>{row.endDate.toDate().toDateString()}</TableCell>
                                            </TableRow>
                                        ))
                                        : null
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <Typography variant="h4" component="div">
                            Книги предстоящи
                        </Typography>
                        <TableContainer >
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Книга</TableCell>
                                        <TableCell>Автор</TableCell>
                                        <TableCell>От дата</TableCell>
                                        <TableCell>До дата</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {futureBooks.length ?
                                        futureBooks.map((row) => (
                                            <TableRow key={row.bookID}>
                                                <TableCell component="th" scope="row">
                                                    <Link style={{ textDecoration: 'none' }} to={{ pathname: `/books/${row.bookID}` }}>
                                                        {row.book.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {row.book.author}

                                                </TableCell>
                                                <TableCell>{row.startDate.toDate().toDateString()}</TableCell>
                                                <TableCell>{row.endDate.toDate().toDateString()}</TableCell>
                                            </TableRow>
                                        ))
                                        : null
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <Typography variant="h4" component="div">
                            Книги минали
                        </Typography>
                        <TableContainer >
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Книга</TableCell>
                                        <TableCell>Автор</TableCell>
                                        <TableCell>От дата</TableCell>
                                        <TableCell>До дата</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pastBooks.length ?
                                        pastBooks.map((row) => (
                                            <TableRow key={row.bookID}>
                                                <TableCell component="th" scope="row">
                                                    <Link style={{ textDecoration: 'none' }} to={{ pathname: `/books/${row.bookID}` }}>
                                                        {row.book.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {row.book.author}

                                                </TableCell>
                                                <TableCell>{row.startDate.toDate().toDateString()}</TableCell>
                                                <TableCell>{row.endDate.toDate().toDateString()}</TableCell>
                                            </TableRow>
                                        ))
                                        : null
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
const condition = authUser => authUser.role === "admin";

export default withAuthorization(condition)(UserItem);
