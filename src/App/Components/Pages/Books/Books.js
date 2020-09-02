
import React, { useEffect, useState } from "react";
import { firestore } from '../../Firebase/firebase'
import Grid from '@material-ui/core/Grid';
import BookCard from './BookCard'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Chip from '@material-ui/core/Chip';

import algoliasearch from 'algoliasearch/lite';
import {
    InstantSearch,
    connectSearchBox,
    connectInfiniteHits,
    Highlight, connectRefinementList,

} from 'react-instantsearch-dom';

const useStyles = makeStyles((theme) => ({
    cards: {
        maxWidth: '1200px',
        margin: "0 auto",
        width: '100%'

    }
}));

const searchClient = algoliasearch(
    'ORGLS5Z64Q',
    '5f264f95b844e4b70591918e1e347d79'
);
function Books(searchWord) {
    const classes = useStyles();
    var searchString = searchWord.location.searchWord|| ''
    
    const InfiniteHits = ({
        hits,
        hasMore,
        refineNext,
    }) => (
            <div>

                <Grid
                    container
                    direction="row"
                    justify="center"
                    spacing={5}
                    className={classes.cards}
                >
                    {hits.map(hit => (
                        <Grid key={hit.id} item xs={12} sm={4} md={3}>
                            <BookCard book={hit} />
                        </Grid>
                    ))}
                </Grid>
                <Button style={{display: 'block', margin: '0 auto'}} className="ais-InfiniteHits-loadMore"  color="primary" variant="contained" disabled={!hasMore} onClick={() => {
                    refineNext()
                }}>
                    Покажи още
          </Button>
            </div>
        );
    const SearchBox = ({ currentRefinement, isSearchStalled, refine }) => (
        <form noValidate action="" role="search">
            <TextField
                type="search"
                className={classes.searchBar}

                value={currentRefinement}
                onChange={event => refine(event.currentTarget.value)}
            />
        </form>
    );
    const RefinementList = ({
        items,
        isFromSearch,
        refine,
        createURL,
    }) => (
            <Grid item xs={4}>
                Език
                <Grid container direction='row' spacing={1}>

                    {items.map(item => (
                        <Grid item>
                            <Chip
                                href={createURL(item.value)}
                                label={item.label}
                                clickable
                                color={item.isRefined ? "primary" : "gray"}
                                onClick={event => {
                                    event.preventDefault();
                                    refine(item.value);
                                }}
                            />
                        </Grid>


                    ))}
                </Grid>
            </Grid>
        );

    const CustomRefinementList = connectRefinementList(RefinementList);
    const CustomSearchBox = connectSearchBox(SearchBox);

    const CustomInfiniteHits = connectInfiniteHits(InfiniteHits);
    return (
        <Container component="main" >
            <div className="ais-InstantSearch" style={{ marginBottom: '100px' }}>
                <Typography variant="h6" noWrap>
                    Всички книги
                    </Typography>
                <InstantSearch indexName="books" searchClient={searchClient}>

                    <CustomSearchBox defaultRefinement ={searchString} />
                    <CustomRefinementList attribute="language" />
                    <CustomInfiniteHits />


                </InstantSearch>
            </div>
        </Container>
    )
}


export default Books;
