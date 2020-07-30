import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import G0 from '../../../../images/HomeBG.svg'
import InfoGraphic from '../../../../images/InfoGraphics.svg'

const useStyles = makeStyles((theme) => ({
    cards: {
        maxWidth: '1200px',
        margin: "0 auto"

    }
}));
function LandingPage() {
    const [searchWord, setSearchWord] = useState('')
    const [searchNow, setSearchNow] = useState(false)
    const classes = useStyles();

    const handleChange = (e) => {
        if (e.keyCode === 13) {
            setSearchNow(true)
        }
    }

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

                    <Typography variant="h5" component="h5">Най-нови книги</Typography>


                </Container>
            </div>
            <div >
                <Container component="main" >

                    <Typography variant="h5" component="h5">Как да взема книга?</Typography>

                    <img id="head-section-image" src={InfoGraphic} />

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
