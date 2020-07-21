
import React, { Component, useState, useEffect } from 'react';
import { UserContext } from '../../../Context/userContext'
import withAuthorization from '../../../Session/withAuthorization';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { withFirebase } from '../../Firebase/context';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { firestore } from '../../Firebase/firebase'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { storage } from '../../Firebase/firebase'
import Container from '@material-ui/core/Container';


const useStyles = makeStyles((theme) => ({
    prev: {
        '& img':
        {
            width: "100%"
        }
    },
    uploadField: {
        display: 'none'
    }
}));

function AddBook() {
    return (
        <div>
            <h1>AddBook</h1>
            <Books />
        </div>
    );
}
function BooksBase() {
    const classes = useStyles();

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [language, setLanguage] = useState('')
    const [genre, setGenre] = useState('')
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')
    const [bookedDates, setBookedDates] = useState([])

    const HandleSubmit = (e, title, author, description, language, genre, image, bookedDates) => {
        e.preventDefault();
        console.log(image)
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
                            bookedDates
                        }).then(res => {
                            setTitle('');
                            setAuthor('');
                            setLanguage('');
                            setGenre('');
                            setImage('');
                            setDescription('');
                            setBookedDates([]);
                            document.getElementById("preview").innerHTML = "";

                        }
                        )
                    }
                    );
            }
        )

    }
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
    const isInvalid = title === '' || description === '';
    return (
        <Container component="main" >

            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Grid item xs={6}>
                    <form className="forms" onSubmit={(e) => HandleSubmit(e, title, author, description, language, genre, image, bookedDates)}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            spacing={5}

                        >
                            <Grid item xs={6}>
                                <TextField
                                    name="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Title"
                                    fullWidth={true}
                                />
                                <TextField
                                    name="author"
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="author"
                                    fullWidth={true}
                                />
                                <TextField
                                    name="description"
                                    type="text"
                                    value={description}
                                    multiline={true}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Description"
                                    fullWidth
                                />
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                    spacing={2}

                                >
                                    <Grid item xs={6}>

                                        <TextField
                                            name="genre"
                                            type="text"
                                            value={genre}
                                            onChange={(e) => setGenre(e.target.value)}
                                            placeholder="Genre"
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <TextField
                                            name="language"
                                            type="text"
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            placeholder="Language"
                                        />
                                    </Grid>
                                </Grid>

                                <Button disabled={isInvalid} type="submit">Add Book</Button>

                            </Grid>
                            <Grid item xs={6}>
                                <div id="preview" className={classes.prev}></div>
                                <Button onClick={(e) => HandleUpload(e)}>Add Cover</Button>
                                <input id="image-file" type="file" onChange={HandlePrev} className={classes.uploadField} />
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </Container>
    );
}


const condition = authUser => authUser.role === "admin";

const Books = withFirebase(BooksBase);

export default withAuthorization(condition)(AddBook);


