import React, { useEffect, useState } from "react";
import { firestore } from '../../Firebase/firebase'
// import { firestore } from 'firebase-admin';
import * as firebase from 'firebase';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { add, addDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import Container from '@material-ui/core/Container';
import withAuthorization from '../../../Session/withAuthorization'
import { BrowserRouter as Router, Link, Route, Switch, Redirect, useLocation } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import UserRow from './UserRow'
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
}));

function UserList() {
    const classes = useStyles();
    const [users, setUsers] = useState([])
    const [detectChange, setDetectChange] = useState(false)
    const [searchUser, setSearchUser] = useState('')
    const [fUsers, setFUsers] = useState([])


    const fetchData = async () => {
        const data = await firestore.collection("users").get();
        setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        setFUsers(users)
    }, [users]);
    useEffect(() => {
        if (detectChange) {
            fetchData();
            setDetectChange(false)
        }
    }, [detectChange]);

    useEffect(() => {
        let filteredArray = users
        if (searchUser === '') {
            setFUsers(users)
        }
        else {
            setFUsers(users.filter(user =>
                user?.uid?.includes(searchUser)
                || user?.email?.toLowerCase().includes(searchUser.toLowerCase())
                || user?.username?.toLowerCase().includes(searchUser.toLowerCase())
                || user?.role?.toLowerCase().includes(searchUser.toLowerCase())))
        }
    }, [searchUser])
    return (
        <Container component="main">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
            <CssBaseline />
            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h4" component="div">
                            Потребители
        </Typography>
                        <TextField
                            className={classes.searchBar}
                            id="standard-search"
                            label="Потребител / Роля"
                            fullWidth
                            value={searchUser}
                            type="search"
                            onChange={(e) => setSearchUser(e.target.value)} />
                        <TableContainer >
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Username</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fUsers.length ?
                                        fUsers.map((row) => (
                                            <UserRow row={row} setDetectChange={setDetectChange} key={row.id} />
                                        ))

                                        : <CircularProgress style={{ position: 'absolute', left: '50%' }} />
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

export default withAuthorization(condition)(UserList);
