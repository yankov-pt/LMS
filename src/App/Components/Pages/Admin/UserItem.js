
import React, { useEffect, useContext, useState, useRef } from "react";
import { BrowserRouter as Router, Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { firestore } from '../../Firebase/firebase'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import withAuthorization from '../../../Session/withAuthorization'

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




    return (
        <div>
            <h1>{user.username}</h1>
            <h1>{user.role}</h1>
            

        </div>
    );
}
const condition = authUser => authUser.role === "admin";

export default withAuthorization(condition)(UserItem);
