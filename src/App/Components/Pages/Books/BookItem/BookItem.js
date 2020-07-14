
import React, { useEffect, useContext, useState, useRef } from "react";
import { BrowserRouter as Router, Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { firestore } from '../../../Firebase/firebase'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Button from '@material-ui/core/Button';
import { UserContext } from "../../../../Context/userContext";
import { add, addDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import { bg } from 'date-fns/locale'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    cards: {
        maxWidth: '1200px',
        margin: "0 auto"
    },
    clendar: {
        width: '100%',
        "& .rdrDefinedRangesWrapper": {
            display: 'none'
        },
        '& .rdrCalendarWrapper': {
            margin: '0 auto'
        }
    },
    cover: {
        width: '100%'
    },
    clendarBox: {
        position: 'fixed',
        textAlign: 'center'
    },
    clBtn:{
        marginTop: '16px'
    }
    

}));


function BookItem(book) {
    const classes = useStyles();
    const [user, setUser] = useContext(UserContext);
    const [currentBookId, setCurrentBookId] = useState("")
    const [itemBook, setItemBook] = useState({})
    const [reservedDates, setReservedDates] = useState([])
    const [localState, setLocalState] = useState({})
    const [localUser, setLocalUser] = useState({})
    const [reservedArray, setReservedArray] = useState([])
    const [operationId, setOperationId] = useState('')
    const bookRef = useRef(itemBook)
    const [myDates, setMyDates] = useState([
        {
            startDate: null,
            endDate: null,
            key: 'selection'
        }
    ]);
    const GetBookById = (uid) => {
        firestore.collection('books').doc(uid).get().then((docRef) => { setItemBook(docRef.data()) })
            .catch((error) => { })
    }
    const history = useHistory();
    useEffect(() => {
        // var reservedArray = new Array();
        var str = history.location.pathname;
        var n = str.lastIndexOf('/');
        var res = str.substring(n + 1)
        GetBookById(res)
        setCurrentBookId(res)

    }, [])

    useEffect(() => {
        setLocalState(itemBook)
        var resArray = new Array();

        if (itemBook.bookedDates !== undefined) {
            if (itemBook.bookedDates.length > 0) {
                console.log('ewe', itemBook.bookedDates)
                for (var i = 0; i < itemBook.bookedDates.length; i++) {
                    var currentDate = itemBook.bookedDates[i].startDate;
                    var t = new Date('Jan 01, 1970'); // Epoch
                    var start = add(t, {
                        years: 0,
                        months: 0,
                        weeks: 0,
                        days: 0,
                        hours: 0,
                        minutes: 0,
                        seconds: currentDate.seconds,
                    });
                    var end = add(t, {
                        years: 0,
                        months: 0,
                        weeks: 0,
                        days: 0,
                        hours: 0,
                        minutes: 0,
                        seconds: itemBook.bookedDates[i].endDate.seconds,
                    });
                    while (start <= end) {

                        start = addDays(start, 1);
                        resArray.push(start);

                    }
                }
                setReservedArray(resArray)

            }
        }

    }, [itemBook])

    useEffect(() => {
        setReservedDates(reservedArray)
    }, [reservedArray])

    useEffect(() => {
        setLocalUser(user)
    }, [user])

    useEffect(() => {
        console.log('=======', localUser)
    }, [localUser])
    const HandleReserve = (e) => {
        console.log('here', itemBook)
        console.log(myDates[0].startDate)


        var currentlyReading = localUser.booksCurrentlyInUser
        var futureReading = localUser.futureBooks
        var firstday = new Date(myDates[0].startDate)
        var today = new Date()
        firestore.collection("operations").add({
            bookId: currentBookId,
            user: user,
            book: localState,
            startDate: myDates[0].startDate,
            endDate: myDates[0].endDate,
            status: 'toBeTaken' //toBeTaken || inUser || returned
        }).then(
            (res) => {

                var newDate = {
                    startDate: myDates[0].startDate,
                    endDate: myDates[0].endDate,
                    user: user.uid,
                    operationId: res.Pc.path.segments[1]
                }
                var newBook = {
                    startDate: myDates[0].startDate,
                    endDate: myDates[0].endDate,
                    book: currentBookId,
                    operationId: res.Pc.path.segments[1]
                }
                var booked = itemBook.bookedDates;
                booked.push(newDate)
                // if (firstday.toDateString() === today.toDateString()) {
                //     console.log('yes');
                //     currentlyReading.push(newBook)
                //     console.log(currentlyReading)
                //     setLocalUser({ ...localUser, booksCurrentlyInUser: currentlyReading })

                // }
                // else {
                    console.log('no')
                    futureReading.push(newBook)
                    console.log(futureReading)
                    setLocalUser({ ...localUser, futureBooks: futureReading })
                // }
                setLocalState({ ...localState, bookedDates: booked })
                console.log('22', localState)
                firestore.collection('books').doc(currentBookId).set(localState).then((res) => { GetBookById(currentBookId) })
                firestore.collection('users').doc(user.uid).set(localUser)
            }
        )


    }

    return (
        <Container component="main">
            <Grid container spacing={3}>
                <Grid item xs={8}>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <img src={itemBook.cover} alt={itemBook.title} className={classes.cover} />

                        </Grid>
                        <Grid item xs={8}>
                            <h1>{itemBook.title}</h1>
                            <h2>{itemBook.author}</h2>
                            <p>{itemBook.description}</p>
                            <h2>{itemBook.genre}</h2>
                            <h2>{itemBook.language}</h2>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={4}>
                    {!user ?
                        <p>Register to book a book</p>
                        :
                        <div className={classes.clendarBox}>

                                <DateRangePicker
                                    locale={bg}
                                    onChange={item => setMyDates([item.selection])}
                                    showSelectionPreview={true}
                                    moveRangeOnFirstSelection={false}
                                    ranges={myDates}
                                    direction="horizontal"
                                    staticRanges={[]}
                                    inputRanges={[]}
                                    disabledDates={reservedDates}
                                    startDatePlaceholder={'От'}
                                    endDatePlaceholder={'До'}
                                    minDate={new Date()}
                                    className={classes.clendar}
                                />
                                <Button onClick={(e) => HandleReserve(e)} color="primary" variant="contained" className={classes.clBtn}>Резервирай</Button>
                        </div>
                    }
                </Grid>
            </Grid>



        </Container >
    );
}

export default BookItem;
