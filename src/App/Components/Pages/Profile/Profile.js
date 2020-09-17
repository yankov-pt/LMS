import moment from 'moment';
import 'moment/locale/bg';
import Button from '@material-ui/core/Button';
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/userContext";
import { BrowserRouter as Router, Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { auth } from "../../Firebase/firebase";
import withAuthorization from '../../../Session/withAuthorization'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { firestore } from '../../Firebase/firebase'
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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

function Profile() {
    const classes = useStyles();
    const [user, setUser] = useContext(UserContext);
    const [currentBooks, setCurrentBooks] = useState([])
    const [futureBooks, setFutureBooks] = useState([])
    const [pastBooks, setPastBooks] = useState([])
    const [value, setValue] = useState(0);
    moment.locale('bg')
    useEffect(() => {
        var newArr = []
        setCurrentBooks([])
        setFutureBooks([])
        setPastBooks([])
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
    }, [])
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Container component="main" >
            {
                user !== undefined ?
                    (
                        <div className="content">
                            <Typography variant="h1" component="h1">Hello {user.username}!</Typography>
                            <h3>E-mail: {user.email}</h3>
                            <Button color="primary" variant="contained" className="w-full py-3 bg-red-600 mt-4 text-white" onClick={() => { auth.signOut() }}>Sign out</Button>
                            <AppBar position="static" style={{ marginTop: '50px' }}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    aria-label="simple tabs example"
                                    variant="fullWidth"
                                // centered
                                >
                                    <Tab label="Книги в потребителя" />
                                    <Tab label="Книги предстоящи" />
                                    <Tab label="Прочетени книги" />
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
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {currentBooks.length ?
                                                    currentBooks.map((row) => (
                                                        <TableRow key={row.operationId}>
                                                            <TableCell component="th" scope="row">
                                                                <Link style={{ textDecoration: 'none' }} to={{ pathname: `/books/${row.bookID}` }}>
                                                                    {row.book?.title}
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell>
                                                                {row.book?.author}
                                                            </TableCell>
                                                            <TableCell>{moment(row.startDate?.seconds * 1000).format("dddd, DD.MM.YYYY")}</TableCell>
                                                            <TableCell>{moment(row.endDate?.seconds * 1000).format("dddd, DD.MM.YYYY")}</TableCell>
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
                                                        <TableRow key={row.operationId}>
                                                            <TableCell component="th" scope="row">
                                                                <Link style={{ textDecoration: 'none' }} to={{ pathname: `/books/${row.bookID}` }}>
                                                                    {row.book?.title}
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell>
                                                                {row.book?.author}

                                                            </TableCell>
                                                            <TableCell>{moment(row.startDate?.seconds * 1000).format("dddd, DD.MM.YYYY")}</TableCell>
                                                            <TableCell>{moment(row.endDate?.seconds * 1000).format("dddd, DD.MM.YYYY")}</TableCell>
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
                                                        <TableRow key={row.operationId}>
                                                            <TableCell component="th" scope="row">
                                                                <Link style={{ textDecoration: 'none' }} to={{ pathname: `/books/${row.bookID}` }}>
                                                                    {row.book?.title}
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell>
                                                                {row.book?.author}

                                                            </TableCell>
                                                            <TableCell>{moment(row.startDate?.seconds * 1000).format("dddd, DD.MM.YYYY")}</TableCell>
                                                            <TableCell>{moment(row.endDate?.seconds * 1000).format("dddd, DD.MM.YYYY")}</TableCell>
                                                        </TableRow>
                                                    ))
                                                    : null
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </TabPanel>

                        </div>
                    )
                    : null
            }
        </Container>
    );
}
const condition = user => user.role !== "banned";

export default withAuthorization(condition)(Profile);