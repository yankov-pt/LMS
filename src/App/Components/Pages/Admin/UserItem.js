
import React, { useEffect, useContext, useState, useRef } from "react";
import { BrowserRouter as Router, Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { firestore } from '../../Firebase/firebase'
import withAuthorization from '../../../Session/withAuthorization'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

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

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function UserItem(book) {
    const classes = useStyles();
    const [user, setUser] = useState({});
    const [currentBooks, setCurrentBooks] = useState([])
    const [futureBooks, setFutureBooks] = useState([])
    const [pastBooks, setPastBooks] = useState([])
    const [value, setValue] = React.useState(0);

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
    }, [user])

    useEffect(() => {
        var newArr = []
        // setCurrentBooks([])
        // setFutureBooks([])
        // setPastBooks([])
        if (user.booksCurrentlyInUser) {
            user.booksCurrentlyInUser.map(el => {
                firestore.collection('books').doc(el.book).get().then(data => {
                    var newelem = {
                        bookID: el.book,
                        startDate: el.startDate,
                        endDate: el.endDate,
                        book: data.data(),
                        operationId: el.operationId
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
                        book: data.data(),
                        operationId: el.operationId

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
                        book: data.data(),
                        operationId: el.operationId
                    }
                    setPastBooks(old => [...old, newelem])
                })

            })
        }
    }, [user])
    const fetchData = async () => {
        const data = await firestore.collection("operations").get();
    };

    function search(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].operationId === nameKey) {
                myArray[i].status = 'returned'
                return myArray
            }
        }
    }
    const ChangeStatusToReturned = async (row) => {
        const data = await firestore.collection('users').doc(user.uid).get()

        const book = await firestore.collection('books').doc(row.bookID).get()
        var operation = await firestore.collection('operations').doc(row.operationId).get()

        var removedItem = data.data().booksCurrentlyInUser.filter(el => el.operationId === row.operationId)
        var newCurrent = data.data().booksCurrentlyInUser.filter(el => el.operationId !== row.operationId)
        var newReturned = data.data().returnedBooks
        newReturned.push(removedItem[0])
        var bookdates = await firestore.collection('books').doc(row.bookID).get()

        var resultObject = search(row.operationId, bookdates.data().bookedDates);
        firestore.collection('users').doc(user.uid).set({ ...data.data(), booksCurrentlyInUser: newCurrent, returnedBooks: newReturned })
        firestore.collection('operations').doc(row.operationId).set({ ...operation.data(), status: 'returned' })
        firestore.collection('books').doc(row.bookID).set({ ...bookdates.data(), bookedDates: resultObject })
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Container component="main" >
            <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                    <Typography variant="h5" component="h5">Username: {user.username}</Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Typography variant="h5" component="h5">Email: {user.email}</Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Typography variant="h5" component="h5">Role: {user.role}</Typography>
                </Grid>
                <Grid item sm={6} xs={12}>
                    <Typography variant="h5" component="h5">Uid: {user.id}</Typography>
                </Grid>
            </Grid>
            <AppBar position="static" style={{ marginTop: '50px' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                    centered
                >
                    <Tab label="Книги в потребителя" />
                    <Tab label="Книги предстоящи" />
                    <Tab label="Книги минали" />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
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
                                    <TableCell>Action</TableCell>
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
                                            <TableCell><Button color="primary" variant="contained" className={classes.clBtn} onClick={() => ChangeStatusToReturned(row)}>Върната</Button></TableCell>

                                        </TableRow>
                                    ))
                                    : null
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </TabPanel>
            <TabPanel value={value} index={1}>
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
            </TabPanel>
            <TabPanel value={value} index={2}>
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
            </TabPanel>

        </Container>
    );
}
const condition = authUser => authUser.role === "admin";

export default withAuthorization(condition)(UserItem);
