import React, { useEffect, useState } from "react";
import { firestore } from '../../Firebase/firebase'
// import { firestore } from 'firebase-admin';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import withAuthorization from '../../../Session/withAuthorization'
import { BrowserRouter as Router, Link, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';




const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
    padding: '16px',
  },
  addBook: {
    height: '100%',
    padding: '16px',
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  }
}));

function Admin() {
  const classes = useStyles();
  const [books, setBooks] = useState([])
  var today = new Date()
  const [booksToBeTaken, setBooksToBeTaken] = useState({})
  const [booksToBeReturned, setBooksToBeReturned] = useState({})
  const [searchTake, setSearchTake] = useState('')
  const [searchReturn, setSearchReturn] = useState('')

  const fetchData = async () => {
    const data = await firestore.collection("operations").get();
    setBooks(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };
  useEffect(() => {
    fetchData();
  }, []);

  var today = new Date().toDateString()

  useEffect(() => {
    let filteredArray = books
      .filter(element =>
        element.status === "toBeTaken"
      )
      .filter(element =>
        element.startDate.toDate().toDateString() === today
      );
    let filteredArray1 = books
      .filter(element =>
        element.status === "inUser"
      )
      .filter(element =>
        element.endDate.toDate().toDateString() === today
      );
    setBooksToBeTaken(filteredArray)
    setBooksToBeReturned(filteredArray1)
  }, [books])

  useEffect(() => {
    console.log(booksToBeTaken)
  }, [booksToBeTaken])

  useEffect(() => {
    let filteredArray = books
      .filter(element =>
        element.status === "toBeTaken"
      )
      .filter(element =>
        element.startDate.toDate().toDateString() === today
      );
    if (searchTake === '') {
      setBooksToBeTaken(filteredArray)
    }
    else {
      setBooksToBeTaken(filteredArray.filter(card =>
        card.user.username.toLowerCase().includes(searchTake.toLowerCase()) || card.book.title.toLowerCase().includes(searchTake.toLowerCase())))
    }
  }, [searchTake])

  useEffect(() => {
    console.log(booksToBeReturned)
  }, [booksToBeReturned])
  const ChangeStatusToTaken = (operation) => {
    firestore.collection('operations').doc(operation.id).set({ ...operation, status: 'inUser' }).then(fetchData())
  }

  const ChangeStatusToReturned = (operation) => {
    firestore.collection('operations').doc(operation.id).set({ ...operation, status: 'returned' }).then(fetchData())
  }
  return (
    <Container component="main" >
      <CssBaseline />
      <div >
        <Grid container spacing={2} >
          <Grid item xs={10}>
            <Typography variant="h2">Dashboard</Typography>
          </Grid>
          <Grid item xs={2}>
            <Link style={{ textDecoration: 'none' }} to={'/addBook'}>
              <Paper className={classes.addBook}>
                <Typography variant="h6" component="div">

                  Add Book
                </Typography>
              </Paper>

            </Link>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Grid container spacing={2} >
                <Grid item xs={6}>
                  <Typography variant="h4" component="div">
                    За взимане
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    className={classes.searchBar}
                    id="standard-search"
                    label="Книга / Потребител"
                    fullWidth
                    value={searchTake}
                    type="search"
                    onChange={(e) => setSearchTake(e.target.value)} />
                </Grid>
              </Grid>
              <TableContainer >
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Book</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {booksToBeTaken.length ?
                      booksToBeTaken.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            <Link style={{ textDecoration: 'none' }} to={{ pathname: `/books/${row.bookId}` }}>
                              {row.book.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link style={{ textDecoration: 'none' }} to={{ pathname: `/users/${row.user.uid}` }}>
                              {row.user.username}
                            </Link>
                          </TableCell>
                          <TableCell><button onClick={() => ChangeStatusToTaken(row)}>Взета</button></TableCell>
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
                За Връщане
        </Typography>
              <TableContainer >
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Book</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {booksToBeReturned.length ?
                      booksToBeReturned.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            <Link style={{ textDecoration: 'none' }} to={{ pathname: `/books/${row.bookId}` }}>
                              {row.book.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link style={{ textDecoration: 'none' }} to={{ pathname: `/users/${row.user.uid}` }}>
                              {row.user.username}
                            </Link>
                          </TableCell>
                          <TableCell><button onClick={() => ChangeStatusToReturned(row)}>Върната</button></TableCell>

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
      </div>
    </Container>
  );
}
const condition = authUser => authUser.role === "admin";

export default withAuthorization(condition)(Admin);
