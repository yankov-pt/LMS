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
    }
}));

function UserRow({ row, setDetectChange }) {
    const [newRole, setNewRole] = useState(row.role)
    const [localUser, setLocalUser] = useState(row)



    const ChangeUser = (val) => {
        setLocalUser({ ...localUser, role: val })
        setNewRole(val)
    }

    const SaveUser = (user) => {
        firestore.collection('users').doc(user.id).set({ ...localUser }).then(
            toast.success(() => (
                <>Успешно променихте статуса на {user.username} на {localUser.role}!</>
            ))
        )

        setDetectChange(true)

    }

    return (
        <>
            <TableRow>
                <TableCell component="th" scope="row">
                    <Link style={{ textDecoration: 'none' }} to={{
                        pathname: `/users/${row.id}`,
                    }}>
                        {row.username}
                    </Link>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.uid}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                    <select defaultValue={row.role} onChange={(e) => ChangeUser(e.target.value)}>
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                        <option value="blocked">blocked</option>
                    </select>
                    {row.role !== newRole ? <button onClick={() => SaveUser(row)}>Промени</button> : <button disabled >Промени</button>}

                </TableCell>
            </TableRow>
        </>
    );
}

export default UserRow;
