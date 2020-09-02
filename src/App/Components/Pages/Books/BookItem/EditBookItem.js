
import React, { useEffect, useContext, useState, useRef } from "react";
import { BrowserRouter as Router, Link, useHistory, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { firestore } from '../../../Firebase/firebase'
import { storage } from '../../../Firebase/firebase'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Button from '@material-ui/core/Button';
import { UserContext } from "../../../../Context/userContext";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useTheme } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const useStyles = makeStyles((theme) => ({
    prev: {
        '& img':
        {
            width: "100%"
        }
    },
    uploadField: {
        display: 'none'
    },
    formControl: {
        margin: theme.spacing(0),
        minWidth: "100%",
    },
    chips: {
        display: "flex",
        flexWrap: "wrap"
    },
    chip: {
        margin: 1
    },
    noLabel: {
    },
    coverImage: {
        width: '100%'
    }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const genresList = [
    'Българска и световна литература',
    'Българска филология и начална педагогика',
    'Биографии и други',
    'Съвременна литература',
    'Право и политологи',
    'Икономика и бизнес',
    'География и история',
    'Енциклопедии',
    'Речници',
    'IT и програмиране',
    'Физика и математика',
    'Анатомия и биология'
];
function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium
    };
}
function EditBookItem() {
    const classes = useStyles();
    const theme = useTheme();

    const [user, setUser] = useContext(UserContext);
    const [currentBookId, setCurrentBookId] = useState("")
    const [itemBook, setItemBook] = useState({})
    const [reservedDates, setReservedDates] = useState([])
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [language, setLanguage] = useState('')
    const [imgUpl, setImgUpl] = useState('')
    const [genre, setGenre] = useState([])
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')
    const [bookedDates, setBookedDates] = useState([])
    const [copies, setCopies] = useState(1)
    const [notificationOpen, setNotificationOpen] = React.useState(false);
    const [location, setLocation] = useState('')

    const GetBookById = (uid) => {
        firestore.collection('books').doc(uid).get().then((docRef) => {
            setItemBook(docRef.data())
            setTitle(docRef.data().title)
            setAuthor(docRef.data().author)
            setLanguage(docRef.data().language)
            setGenre(docRef.data().genre)
            setImage(docRef.data().cover)
            setDescription(docRef.data().description)
            setCopies(docRef.data().copies)
            setLocation(docRef.data().location)
        })
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

    const HandleSubmit = (e, title, author, description, language, genre, image, bookedDates, location) => {
        e.preventDefault();
        if (image?.name?.length > 0) {
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            var cover = ''

            uploadTask.on(
                "state_changed",
                snapshot => {


                },
                error => {
                },
                () => {
                    storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then(url => {
                            cover = url
                        })
                        .then(res => {
                            firestore.collection("books").doc(currentBookId).set({
                                ...itemBook,
                                title,
                                author,
                                description,
                                language,
                                genre,
                                cover,
                                copies,
                                bookedDates,
                                location

                            })
                        }
                        ).then(r => {
                            toast.success(`Успешно променихте ${title}!`)
                        })
                        .catch(err => {
                            toast.error(`Грешка!`)

                        })
                }
            )
        }
        else {
            firestore.collection("books").doc(currentBookId).set({
                ...itemBook,
                title,
                author,
                description,
                language,
                genre,
                copies,
                bookedDates,
                location,
                cover: '',


            }).then(r => {
                toast.success(`Успешно променихте ${title}!`)

            })
                .catch(err => {
                    toast.error(`Грешка!`)

                })
        }


    }





    const HandleUpload = (e) => {
        e.preventDefault();
        document.getElementById("image-file").click()
    };
    const HandlePrev = (evt) => {

        if (evt.target.files[0].type === "image/jpeg" || evt.target.files[0].type === "image/png") {
            var image = document.createElement('img');

            setImage(URL.createObjectURL(evt.target.files[0]))
        }
        setImgUpl(evt.target.files[0])

    };


    const isInvalid = title === '' || language === '' || copies <= 0 || author === '' || genre.length === 0;

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
            <Typography variant="h1" component="h1">Редактирай Книга</Typography>

            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Grid item xs={12}>
                    <form className="forms" onSubmit={(e) => HandleSubmit(e, title, author, description, language, genre, imgUpl, bookedDates, location)}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            spacing={5}

                        >
                            <Grid item xs={3}>
                                {image?.length > 0 ?
                                    <img src={image} className={classes.coverImage} alt={title} />
                                    : null
                                }

                                <Button onClick={(e) => HandleUpload(e)} variant="outlined" color="primary">Промени корица</Button>
                                <Button onClick={(e) => setImage('')} variant="outlined" color="primary">Премахни корица</Button>
                                <input id="image-file" type="file" onChange={HandlePrev} className={classes.uploadField} />
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    label="Заглавие"
                                    fullWidth={true}
                                />
                                <TextField
                                    name="author"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    label="Автор"
                                    fullWidth={true}
                                />
                                <TextField
                                    name="description"
                                    value={description}
                                    multiline={true}
                                    onChange={(e) => setDescription(e.target.value)}
                                    label="Описание"
                                    fullWidth
                                />
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    spacing={2}

                                >
                                    <Grid item xs={6}>

                                        <FormControl className={classes.formControl}>
                                            <InputLabel id="demo-mutiple-chip-label">Жанрове</InputLabel>
                                            <Select
                                                labelId="demo-mutiple-chip-label"
                                                id="demo-mutiple-chip"
                                                multiple
                                                value={genre}
                                                onChange={(event) => setGenre(event.target.value)}
                                                input={<Input id="select-multiple-chip" />}
                                                renderValue={selected => (
                                                    <div className={classes.chips}>
                                                        {selected.map(value => (
                                                            <Chip key={value} label={value} className={classes.chip} />
                                                        ))}
                                                    </div>
                                                )}
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 48 * 4.5 + 8,
                                                            width: 250,
                                                            position: 'absolute',
                                                        }
                                                    }
                                                }}
                                            >
                                                {genresList.map(name => (
                                                    <MenuItem
                                                        key={name}
                                                        value={name}
                                                        style={getStyles(name, genre, theme)}
                                                    >
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={3}>

                                        <FormControl className={classes.formControl}>

                                            <InputLabel id="demo-simple-select-helper-label">Език</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-helper-label"
                                                id="demo-simple-select-helper"
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value)}
                                            >

                                                <MenuItem value={"BG"}>Български</MenuItem>
                                                <MenuItem value={"EN"}>Английски</MenuItem>
                                                <MenuItem value={"RU"}>Руски</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3}>


                                        <TextField
                                            name="copies"
                                            value={copies}
                                            multiline={true}
                                            onChange={(e) => setCopies(e.target.value)}
                                            label="Екземпляри"
                                            fullWidth
                                        />
                                    </Grid>

                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        name="location"
                                        value={location}
                                        multiline={true}
                                        onChange={(e) => setLocation(e.target.value)}
                                        label="Рафт"
                                        fullWidth
                                    />
                                </Grid>

                            </Grid>
                            <Button disabled={isInvalid} type="submit" variant="contained" color="primary">Редактирай книга</Button>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </Container >
    );
}

export default EditBookItem;
