import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { BrowserRouter as Router, Link, useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { auth, signInWithGoogle, generateUserDocument } from "../../Firebase/firebase";


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
    google: {
        margin: theme.spacing(1, 0, 2),
    },
    submit: {
        margin: theme.spacing(2, 0, 1),
    },
}));

export default function LogIn() {
    const classes = useStyles();
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [passwordOne, setPasswordOne] = useState('')
    const [passwordTwo, setPasswordTwo] = useState('')
    const [error, setError] = useState(null)
    const history = useHistory();

    const isInvalid =
        passwordOne !== passwordTwo ||
        passwordOne === '' ||
        passwordOne.length < 6 ||
        email === '' ||
        username === '';
    const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
        event.preventDefault();
        try {
            const { user } = await auth.createUserWithEmailAndPassword(email, password);
            generateUserDocument(user, { username });
        }
        catch (error) {
            setError('Error Signing up with email and password');
        }
        history.push('/');

        setEmail("");
        setPasswordOne("");
        setPasswordTwo("");
        setUsername("");
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>

                <Typography component="h1" variant="h5">
                    Нов Потребител
        </Typography>
                <form className={classes.form} noValidate >
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        value={username}
                        label="Име"
                        name="username"
                        autoComplete="username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Имейл"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}

                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Парола"
                        type="password"
                        id="password"
                        value={passwordOne}
                        onChange={(e) => setPasswordOne(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Повтори парола"
                        type="password"
                        id="password2"
                        value={passwordTwo}
                        onChange={(e) => setPasswordTwo(e.target.value)}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isInvalid}
                        className={classes.submit}
                        onClick={event => {
                            createUserWithEmailAndPasswordHandler(event, email, passwordOne);
                        }}

                    >
                        Регистрирай се
          </Button>
                    <Typography component="p" variant="body1" align="center"  >
                        or
                    </Typography>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.google}
                        onClick={() => {
                            try {
                                signInWithGoogle();
                            } catch (error) {
                                console.error("Error signing in with Google", error);
                            }
                        }}

                    >
                        Sign In with Google
                        </Button>
                    {error && <p>{error.message}</p>}
                    <Grid container>
                        <Grid item xs>
                        </Grid>
                        <Grid item>
                            <Link to={'/login'} variant="body2">
                                {"Имаш акаунт? Влез от тук!"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}