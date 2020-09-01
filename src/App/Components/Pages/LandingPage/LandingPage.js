import React, { useEffect, useState } from "react";
import { firestore } from '../../Firebase/firebase'
import BookCard from '../Books/BookCard'

import { Redirect } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import G0 from '../../../../images/HomeBG.svg'
import InfoGraphic from '../../../../images/InfoGraphics.svg'
import SwipeableViews from "react-swipeable-views";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
const AutoPlaySwipeableViews = SwipeableViews;
const useStyles = makeStyles((theme) => ({
    cards: {
        maxWidth: '1200px',
        margin: "0 auto"
    },
    stepperArrows: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, calc(-50% - 40px))',
        background: 'transparent',
        maxWidth: '1280px',
        width: '100%',
        position: 'absolute',
    },
    buttonsStepper: {
        minWidth: 'auto',
        color: '#193F4C',
        backgroundColor: '#FAFAFA',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        boxShadow: '0px 0px 0px 0px rgba(31, 40, 44, 0.49)',

        '&:hover': {
            backgroundColor: '#FAFAFA',
            boxShadow: '0px 0px 27px 6px rgba(31, 40, 44, 0.99)'

        }
    }
}));

function LandingPage() {
    const [searchWord, setSearchWord] = useState('')
    const [searchNow, setSearchNow] = useState(false)
    const classes = useStyles();
    const [books, setBooks] = useState([])
    const [booksForCarousell, setBooksForCarousell] = useState([])
    const [activeStep, setActiveStep] = React.useState(0);
    const [maxSteps, setMaxSteps] = useState(3);

    useEffect(() => {
        const fetchData = async () => {
            const data = await firestore.collection("books").limit(12).get().then(
                res => {
                    setBooks(res.docs.map(doc => ({ ...doc.data(), id: doc.id })));
                    console.log(res.docs)
                }
            );
            // setBooks(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        }

        fetchData()
    }, [])

    useEffect(() => {
        var first = books.slice(0, 4)
        var second = books.slice(4, 8)
        var third = books.slice(8, 12)
        var newArr = []
        newArr.push(first, second, third)
        setBooksForCarousell(newArr)
    }, [books])

    useEffect(() => {
        console.log(booksForCarousell)

    }, [booksForCarousell])

    const handleChange = (e) => {
        if (e.keyCode === 13) {
            setSearchNow(true)
        }
    }
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };
    return (
        <>
            <div id="head-section">
                <img id="head-section-image" src={G0} />
                <Container id="head-section-content" component="main" >

                    <Typography variant="h1" component="h2">Study Hub lib</Typography>
                    {searchNow
                        ?
                        <Redirect
                            to={{
                                pathname: "/books",
                                searchWord: searchWord

                            }} />
                        : null
                    }

                    <TextField
                        className={classes.searchBar}
                        id="standard-search"
                        label="Потърси книга"
                        value={searchWord}
                        type="search"
                        onChange={(e) => setSearchWord(e.target.value)}
                        onKeyDown={(e) => handleChange(e)} />
                </Container>
            </div>
            <div id="blue-section">
                <Container component="main" >

                    <Typography variant="h5" component="h5"
                        style={{ color: 'white' }}

                    >Най-нови книги</Typography>
                    <AutoPlaySwipeableViews
                        axis={"x"}
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                        id='carosell'
                    >
                        {booksForCarousell.map((step, index) => (
                            <Grid container
                                direction="row"
                                justify="center"
                                spacing={5}
                                className={classes.cards} key={index}>
                                {Math.abs(activeStep - index) <= 2
                                    ? step.map((i) => (
                                        <Grid key={i.id} item sm={4} md={3} xs={12} >
                                            <BookCard book={i} />
                                        </Grid>
                                    ))
                                    : null}
                            </Grid>
                        ))}
                    </AutoPlaySwipeableViews>
                    <MobileStepper
                        className={classes.stepperArrows}
                        steps={maxSteps}
                        position="static"
                        variant="none"
                        id='stepper'

                        activeStep={activeStep}
                        nextButton={
                            <Button
                                className={classes.buttonsStepper}
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                                style={{ opacity: activeStep === maxSteps - 1 ? '0.4' : '1' }}
                            >
                                <KeyboardArrowRight
                                    color="white"
                                    fontSize="large" />


                            </Button>
                        }
                        backButton={
                            <Button className={classes.buttonsStepper}
                                onClick={handleBack} disabled={activeStep === 0}
                                style={{ opacity: (activeStep === 0) ? '0.4' : '1' }}

                            >


                                <KeyboardArrowLeft
                                    color="white"
                                    fontSize="large" />

                            </Button>
                        }
                    />
                    <Grid container
                        direction="row"
                        justify="center"
                        spacing={5}
                        className={classes.cards} >
                    </Grid>
                </Container>
            </div>
            <div id="get-book">
                <Container component="main" >

                    <Typography variant="h5" component="h5">Как да взема книга?</Typography>

                    <section class="infogr">
                        <div class="s1">Step 1</div>
                        <div class="a1">Arr 1</div>
                        <div class="s2">Step 2</div>
                        <div class="a2">Arr 2</div>
                        <div class="s3">Step 3</div>
                        <div class="a3">Arr 3</div>
                        <div class="s4">Step 4</div>
                        <div class="a4">Arr 4</div>
                        <div class="s5">Step 5</div>
                    </section>
                </Container>
            </div>
            <div >
                <Container component="main" >

                    <Typography variant="h5" component="h5">Категории</Typography>


                </Container>
            </div>
            <div >
                <Container component="main" >

                    <Typography variant="h5" component="h5">Контакти</Typography>


                </Container>
            </div>
        </>
    );
}

export default LandingPage;
