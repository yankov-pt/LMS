
import React, { useEffect, useContext, useState, useRef } from "react";
import { BrowserRouter as Router, Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { firestore } from '../../Firebase/firebase'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import withAuthorization from '../../../Session/withAuthorization'
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    cards: {
        maxWidth: '1200px',
        margin: "0 auto"
    },
    clendar: {
        "& .rdrDefinedRangesWrapper": {
            display: 'none'
        }
    }
}));


function UserItem(book) {
    const classes = useStyles();
    const [user, setUser] = useState({});
    const [currentBooks, setCurrentBooks] = useState([])


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
    }, [user])


    useEffect(() => {
        console.log(currentBooks)
    }, [currentBooks])

    return (
        <Container component="main" >

            <h1>{user.username}</h1>
            <h1>{user.role}</h1>

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
        </Container>
    );
}
const condition = authUser => authUser.role === "admin";

export default withAuthorization(condition)(UserItem);
