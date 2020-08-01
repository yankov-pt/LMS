
import React, { Component, useState, useEffect } from 'react';
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
    }
}));
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
    const [language, setLanguage] = useState('')
    const [genre, setGenre] = useState([])
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')
    const [bookedDates, setBookedDates] = useState([])
    const [copies, setCopies] = useState(1)
    const [location, setLocation] = useState('')

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
                                setTitle('');
                                setAuthor('');
                                setLanguage('');
                                setGenre([]);
                                setImage('');
                                setDescription('');
                                setBookedDates([]);
                                setCopies(1)
                                setLocation('')
                                document.getElementById("preview").innerHTML = "";

                            }
                            )
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
                location
            }).then(res => {
                setTitle('');
                setAuthor('');
                setLanguage('');
                setGenre([]);
                setImage('');
                setDescription('');
                setBookedDates([]);
                setCopies(1)
                setLocation('')
                document.getElementById("preview").innerHTML = "";

            }
            )

    }


}

const handleChangeGenre = event => {
    setGenre(event.target.value);
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
                        <Button disabled={isInvalid} type="submit" variant="contained" color="primary">Добави книга</Button>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    </Container >
);
}


const condition = authUser => authUser.role === "admin";

const Books = withFirebase(BooksBase);

export default withAuthorization(condition)(AddBook);


