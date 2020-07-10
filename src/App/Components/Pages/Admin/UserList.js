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
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';



const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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

    const fetchData = async () => {
        const data = await firestore.collection("users").get();
        setUsers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    useEffect(() => {
        fetchData();
    }, []);

    const BlockUser = (user) => {
        console.log(user)
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Paper>
                    <Typography variant="h4" component="div">
                        Потребители
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
                                {users.length ?
                                    users.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell component="th" scope="row">
                                                <Link style={{ textDecoration: 'none' }} to={{
                                                    pathname: `/users/${row.id}`,
                                                }}>
                                                    {row.username}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{row.role}</TableCell>
                                            <TableCell><button onClick={() => BlockUser(row)}>Взета</button></TableCell>
                                        </TableRow>
                                    ))

                                    : null
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        </Container>
    );
}
const condition = authUser => authUser.role === "admin";

export default withAuthorization(condition)(UserList);
