import React, { Component, useState, useEffect, useRef } from 'react';
import { UserContext } from '../../../Context/userContext'
import withAuthorization from '../../../Session/withAuthorization';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { withFirebase } from '../../Firebase/context';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { firestore } from '../../Firebase/firebase'
import Grid from '@material-ui/core/Grid';
import { storage } from '../../Firebase/firebase'
import Container from '@material-ui/core/Container';
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import XLSX from "xlsx"

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
    whiteLink: {
        color: 'white'
    }
}));

const SheetJSFT = [
    "xlsx",
    "xlsb",
    "xlsm",
    "xls",
    "xml",
    "csv",
    "txt",
    "ods",
    "fods",
    "uos",
    "sylk",
    "dif",
    "dbf",
    "prn",
    "qpw",
    "123",
    "wb*",
    "wq*",
    "html",
    "htm"
]
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
    'Анатомия и биология',
    'Университетски Записки'
];
const languagesList = [
    {
        code: 'BG',
        title: 'Български'
    },
    {
        code: 'EN',
        title: 'Английски'
    },
    {
        code: 'RU',
        title: 'Руски'
    },
    {
        code: 'DE',
        title: 'Немси'
    },
    {
        code: 'FR',
        title: 'Френски'
    },
];



function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium
    };
}
function AddBook() {
    return (
        <Books />
    );
}


function BooksBase() {
    const classes = useStyles();
    const theme = useTheme();
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [language, setLanguage] = useState([])
    const [genre, setGenre] = useState([])
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')
    const [bookedDates, setBookedDates] = useState([])
    const [copies, setCopies] = useState(1)
    const [location, setLocation] = useState('')
    const inputFileRef = useRef(null);
    const [data, setData] = useState([])
    const [uploadErrors, setUploadErrors] = useState([])
    const batch = firestore.batch()
    useEffect(() => {
        console.log(data)
    }, [data])

    const getXlsxDocument = evt => {
        var files = evt.target.files; // FileList object

        // use the 1st file from the list
        var file = files[0];

        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        var err = false
        reader.onload = e => {
            /* Parse data */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const booksData = XLSX.utils.sheet_to_json(ws, { header: 1 });
            /* Update state */
            var newArr = []
            booksData.map(item => {
                console.log(item)
                const genres1 = item[2].split(', ');
                const languages1 = item[5].split(', ');
                newArr.push(
                    {
                        title: item[0],
                        author: item[1],
                        description: '',
                        cover: "",
                        language: languages1,
                        genre: genres1,
                        copies: item[4],
                        bookedDates: [],
                        location: item[3]
                    }
                )
            })
            setData(newArr)
        }


        if (rABS) reader.readAsBinaryString(file);
        else reader.readAsArrayBuffer(file);

    };
    const bulkUpload = () => {
        data.map((doc) => {
            batch.set(firestore.collection('books').doc(), doc)
        })
        batch.commit().then(function () {
            console.log('done?')
        })
    }


    const HandleSubmit = (e, title, author, description, language, genre, image, bookedDates) => {
        e.preventDefault();
        console.log(image.name)
        if (image.name !== undefined) {
            console.log('1')

            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            var cover = ''
            uploadTask.on(
                "state_changed",
                snapshot => {


                },
                error => {
                    console.log(error);
                },
                () => {
                    storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then(url => {
                            console.log(url)
                            cover = url
                        })
                        .then(res => {
                            firestore.collection("books").add({
                                title,
                                author,
                                description,
                                language,
                                genre,
                                cover,
                                copies,
                                bookedDates,
                                location
                            }).then(res => {
                                toast.success(() => (
                                    <>Успешно създадохте <Link className={classes.whiteLink} to={`/books/${res.id}`}>{title}</Link>!</>
                                ))

                                setTitle('');
                                setAuthor('');
                                setLanguage([]);
                                setGenre([]);
                                setImage('');
                                setDescription('');
                                setBookedDates([]);
                                setCopies(1)
                                setLocation('')
                                document.getElementById("preview").innerHTML = "";

                            }
                            )
                                .catch(err => {
                                    toast.error(`Грешка!`)

                                })
                        }
                        );
                }
            )
        }
        else {
            console.log('2')
            firestore.collection("books").add({
                title,
                author,
                description,
                language,
                genre,
                copies,
                bookedDates,
                location,
                cover: "",

            }).then(res => {
                console.log(res.id)
                toast.success(() => (
                    <>Успешно създадохте <Link className={classes.whiteLink} to={`/books/${res.id}`}>{title}</Link>!</>
                ))
                setTitle('');
                setAuthor('');
                setLanguage([]);
                setGenre([]);
                setImage('');
                setDescription('');
                setBookedDates([]);
                setCopies(1)
                setLocation('')
                document.getElementById("preview").innerHTML = "";

            }
            ).catch(err => {
                toast.error(`Грешка!`)

            })

        }


    }

    const handleChangeGenre = event => {
        setGenre(event.target.value);
    };
    const handleChangeLanguage = event => {
        setLanguage(event.target.value);
    };
    const HandleUpload = (e) => {
        e.preventDefault();
        document.getElementById("image-file").click()

    }
    const HandlePrev = (evt) => {
        document.getElementById("preview").innerHTML = "";


        setImage(evt.target.files[0])
        console.log(evt.target.files[0].type)
        if (evt.target.files[0].type === "image/jpeg" || evt.target.files[0].type === "image/png") {
            var image = document.createElement('img');
            console.log(URL.createObjectURL(evt.target.files[0]))

            image.src = URL.createObjectURL(evt.target.files[0]);
            document.getElementById("preview").append(image);
        }

        setImage(evt.target.files[0])
    }
    const isInvalid = title === '' || language === '' || author === '' || genre.length === 0;
    return (
        <Container component="main" >
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
            <Typography variant="h1" component="h1">Добави Книга</Typography>

            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Grid item xs={12}>
                    <form className="forms" onSubmit={(e) => HandleSubmit(e, title, author, description, language, genre, image, bookedDates)}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            spacing={5}

                        >
                            <Grid item xs={3}>
                                <div id="preview" className={classes.prev}></div>
                                <Button onClick={(e) => HandleUpload(e)} variant="outlined" color="primary">Добави корица</Button>
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
                                                onChange={handleChangeGenre}
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
                                                labelId="demo-mutiple-chip-label"
                                                id="demo-mutiple-chip"
                                                multiple
                                                value={language}
                                                onChange={handleChangeLanguage}
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
                                                {languagesList.map(name => (
                                                    <MenuItem
                                                        key={name}
                                                        value={name.code}
                                                        style={getStyles(name, genre, theme)}
                                                    >
                                                        {name.title}
                                                    </MenuItem>
                                                ))}
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
                            <Button disabled={isInvalid} type="submit" variant="contained" color="primary">Добави книга</Button>
                        </Grid>
                    </form>
                    <input
                        type="file"
                        className="form-control"
                        id="file"
                        ref={inputFileRef}
                        accept={SheetJSFT}
                        onChange={getXlsxDocument}
                    />
                    <Button disabled={data.length === 0} type="submit" onClick={() => bulkUpload()} variant="contained" color="primary">Качи</Button>

                </Grid>
            </Grid>
        </Container >
    );
}


const condition = authUser => authUser.role === "admin";

const Books = withFirebase(BooksBase);

export default withAuthorization(condition)(AddBook);
