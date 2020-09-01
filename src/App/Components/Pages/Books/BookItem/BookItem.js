
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
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import EditIcon from '@material-ui/icons/Edit';
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
        textAlign: 'center'
    },
    clBtn: {
        margin: '0 0 16px 0'
    },
    editIcon: {
        fontSize: '16px',
        margin: '0 7px 0 0'
    }


}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function BookItem() {
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
    const [da, setDa] = useState({
        st: "null",
        en: "null"
    })
    const [errorOpen, setErrorOpen] = React.useState(false);
    const [notificationOpen, setNotificationOpen] = React.useState(false);
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
        var finalArray = new Array();

        if (itemBook.bookedDates !== undefined) {
            if (itemBook.bookedDates.length > 0) {
                for (var i = 0; i < itemBook.bookedDates.length; i++) {
                    if (itemBook.bookedDates[i].status !== 'returned') {
                        if (itemBook.bookedDates[i].endDate !== null && itemBook.bookedDates[i].startDate !== null) {
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
                    }


                }
                var count = {};
                resArray.forEach(function (i) { count[i] = (count[i] || 0) + 1; });

                for (const [key, value] of Object.entries(count)) {

                    if (value >= parseInt(itemBook.copies, 10)) {
                        finalArray.push(new Date(key))
                    }
                }
                setReservedArray(finalArray)

            }
        }

    }, [itemBook])

    useEffect(() => {
        setReservedDates(reservedArray)
    }, [reservedArray])

    // useEffect(() => {
    //     var s = new Date(myDates[0].startDate).toDateString()
    //     var i = new Date(myDates[0].endDate).toDateString()
    //     setDa({
    //         st: s,
    //         en: i
    //     })
    // }, [myDates])

    useEffect(() => {
        setLocalUser(user)
    }, [user])

    useEffect(() => {
    }, [localUser])
    const HandleReserve = (e) => {
        var resArray = new Array();

        var start = myDates[0].startDate
        var end = myDates[0].endDate;


        while (start <= end) {

            start = addDays(start, 1);
            resArray.push(start);
        }
        console.log(resArray.length)

        if (resArray.length <= 30 && myDates[0].startDate !== null && myDates[0].endDate !== null) {
            console.log('1111111111111111111111111')

            var futureReading = localUser.futureBooks
            firestore.collection("operations").add({
                bookId: currentBookId,
                user: user,
                book: localState,
                startDate: myDates[0].startDate,
                endDate: myDates[0].endDate,
                status: 'toBeTaken' //toBeTaken || inUser || returned
            }).then(
                (res) => {
                    console.log(res.id)
                    var newDate = {
                        startDate: myDates[0].startDate,
                        endDate: myDates[0].endDate,
                        user: user.uid,
                        operationId: res.id,
                        status: 'normal'

                    }
                    var newBook = {
                        startDate: myDates[0].startDate,
                        endDate: myDates[0].endDate,
                        book: currentBookId,
                        operationId: res.id,
                        status: 'normal'
                    }
                    var booked = itemBook.bookedDates;
                    booked.push(newDate)

                    futureReading.push(newBook)
                    setLocalUser({ ...localUser, futureBooks: futureReading })
                    setLocalState({ ...localState, bookedDates: booked })
                    firestore.collection('books').doc(currentBookId).set(localState).then((res) => { GetBookById(currentBookId) })
                    firestore.collection('users').doc(user.uid).set(localUser)
                    setNotificationOpen(true)
                    var s = new Date(myDates[0].startDate).toLocaleDateString('bg-BG', {
                        weekday: "long",
                        year: "numeric",
                        month: "2-digit",
                        day: "numeric"
                    })
                    var i = new Date(myDates[0].endDate).toLocaleDateString('bg-BG', {
                        weekday: "long",
                        year: "numeric",
                        month: "2-digit",
                        day: "numeric"
                    })
                    setDa({
                        st: s,
                        en: i
                    })
                    setMyDates([{ startDate: null, endDate: null, key: 'selection' }]
                    )
                }
            )
        }
        else {
            setErrorOpen(true)
        }




    }

    const handleCloseNot = () => {
        setDa({
            st: null,
            en: null
        })
        setNotificationOpen(false)

    };
    const handleCloseErr = () => {
        setErrorOpen(false)

    };

    return (
        <Container component="main">
            <Grid container spacing={3}>
                <Grid item lg={8} md={6} xs={12} >
                    <Grid container spacing={3}>
                        <Grid item md={4} xs={12}>
                            {itemBook?.cover?.length > 0 ?
                                <img src={itemBook?.cover} alt={itemBook?.title} className={classes.cover} />
                                : <img src="https://firebasestorage.googleapis.com/v0/b/library-management-syste-95445.appspot.com/o/images%2FNoImage.jpg?alt=media&token=31d32428-3e76-4226-ba13-78e294a86f0e" alt={itemBook.title} className={classes.cover} />

                            }


                        </Grid>
                        <Grid item md={8} xs={12}>
                            <Typography variant="h5" component="h5">{itemBook?.title}</Typography>
                            <h2>{itemBook?.author}</h2>
                            <p>{itemBook?.description}</p>
                            <h2>{itemBook?.genre}</h2>
                            <h2>{itemBook?.language}</h2>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={4} md={6} xs={12} style={{ textAlign: "center" }}>
                    {user?.role === 'admin' ?
                        <Link style={{ textDecoration: 'none' }} to={{
                            pathname: `/editbook/${currentBookId}`
                        }}>

                            <Button color="primary" variant="contained" className={classes.clBtn}><EditIcon className={classes.editIcon} />Edit Book</Button>
                        </Link>

                        : null}
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
                                rangeColors={['rgb(34,81,100)']}
                            />
                            <Button onClick={(e) => HandleReserve(e)} color="primary" variant="contained" className={classes.clBtn}>Резервирай</Button>
                        </div>
                    }
                </Grid>
            </Grid>
            <Dialog
                open={errorOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseErr}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Не можете да запазите книга за повече от 30 дни!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Моля променете датите
          </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleCloseErr} color="primary">
                        Ok
          </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={notificationOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseNot}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{`Успешно запазихте ${itemBook.title}!`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">

                        <p>От {da.st} до {da.en}</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleCloseNot} color="primary">
                        Ok
          </Button>
                </DialogActions>
            </Dialog>


        </Container >
    );
}

export default BookItem;
