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
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';



const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
    padding: '16px',
    '.MuiTableRow-root:hover': {
      backgroundColor: 'red'
    }
  },
  addBook: {
    height: '100%',
    padding: '16px',
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },

}));

function Admin() {
  const classes = useStyles();
  const [books, setBooks] = useState([])
  const [booksToBeTaken, setBooksToBeTaken] = useState({})
  const [booksToBeReturned, setBooksToBeReturned] = useState({})
  const [еxpired, setЕxpired] = useState({})
  const [searchTake, setSearchTake] = useState('')
  const [searchReturn, setSearchReturn] = useState('')
  const [searchЕxpired, setSearchЕxpired] = useState('')
  const [localUser, setLocalUser] = useState({})

  const fetchData = async () => {
    const data = await firestore.collection("operations").get();
    setBooks(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };
  useEffect(() => {
    fetchData();
  }, []);

  var today = new Date()

  useEffect(() => {
    let filteredArray = books
      .filter(element =>
        element.status === "toBeTaken"
      )
      .filter(element =>
        element.startDate.toDate().toDateString() === today.toDateString()
      );
    let filteredArray1 = books
      .filter(element =>
        element.status === "inUser"
      )
      .filter(element =>
        element.endDate.toDate().toDateString() === today.toDateString()
      );
    let filteredArray3 = books
      .filter(element =>
        element.status === "inUser"
      )
      .filter(element =>
        Date.parse(element.endDate.toDate().toDateString()) < Date.parse(today.toDateString())
      );
      books.map(element =>
        console.log(Date.parse(element.endDate.toDate().toDateString()))
        )
    setBooksToBeTaken(filteredArray)
    setBooksToBeReturned(filteredArray1)
    setЕxpired(filteredArray3)
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
        element.startDate.toDate().toDateString() === today.toDateString()
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
    let filteredArray = books
      .filter(element =>
        element.status === "inUser"
      )
      .filter(element =>
        element.startDate.toDate().toDateString() === today.toDateString()
      );
    if (searchReturn === '') {
      setBooksToBeReturned(filteredArray)
    }
    else {
      setBooksToBeReturned(filteredArray.filter(card =>
        card.user.username.toLowerCase().includes(searchReturn.toLowerCase()) || card.book.title.toLowerCase().includes(searchReturn.toLowerCase())))
    }
  }, [searchReturn])

  useEffect(() => {
    let filteredArray = books
      .filter(element =>
        element.status === "inUser"
      )
      .filter(element =>
        element.endDate.toDate() < today
      );
    if (searchЕxpired === '') {
      setЕxpired(filteredArray)
    }
    else {
      setЕxpired(filteredArray.filter(card =>
        card.user.username.toLowerCase().includes(searchЕxpired.toLowerCase()) || card.book.title.toLowerCase().includes(searchЕxpired.toLowerCase())))
    }
  }, [searchЕxpired])

  const ChangeStatusToTaken = async (operation) => {
    const data = await firestore.collection('users').doc(operation.user.uid).get()
    console.log(data.data())
    var removedItem = data.data().futureBooks.filter(el => el.operationId === operation.id)
    var newFuture = data.data().futureBooks.filter(el => el.operationId !== operation.id)
    var newCurrent = data.data().booksCurrentlyInUser
    newCurrent.push(removedItem[0])
    console.log('removedItem', removedItem)
    console.log(newFuture)
    console.log(newCurrent)
    firestore.collection('users').doc(operation.user.uid).set({ ...data.data(), futureBooks: newFuture, booksCurrentlyInUser: newCurrent })
    firestore.collection('operations').doc(operation.id).set({ ...operation, status: 'inUser' }).then(fetchData())
    fetchData();
  }
  useEffect(() => {
    // console.log(localUser)
  }, [localUser])

  const ChangeStatusToReturned = async (operation) => {
    const data = await firestore.collection('users').doc(operation.user.uid).get()
    console.log(data.data())
    var removedItem = data.data().booksCurrentlyInUser.filter(el => el.operationId === operation.id)
    var newCurrent = data.data().booksCurrentlyInUser.filter(el => el.operationId !== operation.id)
    var newReturned = data.data().returnedBooks
    newReturned.push(removedItem[0])
    console.log('removedItem', removedItem)
    console.log(newCurrent)
    console.log(newReturned)
    firestore.collection('users').doc(operation.user.uid).set({ ...data.data(), booksCurrentlyInUser: newCurrent, returnedBooks: newReturned })


    firestore.collection('operations').doc(operation.id).set({ ...operation, status: 'returned' }).then(fetchData())
    fetchData();
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
                <AddCircleOutlineOutlinedIcon />

                <Typography variant="h6" component="div">
                  Добави книга
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
              <Grid container spacing={2} >
                <Grid item xs={6}>
                  <Typography variant="h4" component="div">
                    За връщане
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    className={classes.searchBar}
                    id="standard-search"
                    label="Книга / Потребител"
                    fullWidth
                    value={searchReturn}
                    type="search"
                    onChange={(e) => setSearchReturn(e.target.value)} />
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
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Grid container spacing={2} >
                <Grid item xs={6}>
                  <Typography variant="h4" component="div">
                    Просрочени
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    className={classes.searchBar}
                    id="standard-search"
                    label="Книга / Потребител"
                    fullWidth
                    value={searchЕxpired}
                    type="search"
                    onChange={(e) => setSearchЕxpired(e.target.value)} />
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
                    {еxpired.length ?
                      еxpired.map((row) => (
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
