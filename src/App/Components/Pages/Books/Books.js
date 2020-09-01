
// import React, { useEffect, useState } from "react";
import { firestore } from '../../Firebase/firebase'
import Grid from '@material-ui/core/Grid';
import BookCard from './BookCard'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Chip from '@material-ui/core/Chip';

// import algoliasearch from 'algoliasearch/lite';
import React, { Component } from 'react';
// import {
//     InstantSearch,
//     connectSearchBox,
//     connectInfiniteHits,
//     Highlight, connectRefinementList,

// } from 'react-instantsearch-dom';

const useStyles = makeStyles((theme) => ({
    cards: {
        maxWidth: '1200px',
        margin: "0 auto",
        width: '100%'

    }
}));
// const languagesList = [
//     'BG', 'EN', 'RU', 'DE', 'FR',
// ];
// function Books(searchWord) {
//     const classes = useStyles();
//     var searchString = ''
//     if (searchWord.location.searchWord?.length > 0) {
//         searchString = searchWord.location.searchWord
//     }
//     const [books, setBooks] = useState([])
//     const [filteredBooks, setFilteredBooks] = useState([])
//     const [filterLang, setFilterLang] = useState([])
//     const [searchBook, setSearchBook] = useState(searchString)
//     useEffect(() => {
//         const fetchData = async () => {
//             const data = await firestore.collection("books").get()
//             setBooks(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
//             if (searchString.length > 0) {
//                 console.log('hiiiiiiiiiiii')
//                 setSearchBook(searchString)
//                 const arr = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
//                 setFilteredBooks(arr.filter(book =>
//                     book.title.toLowerCase().includes(searchBook.toLowerCase()) || book.author.toLowerCase().includes(searchBook.toLowerCase())))

//             }
//             else {
//                 console.log()
//                 setFilteredBooks(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))

//             }
//         };

//         fetchData()
//         // console.log(books)
//     }, []);
//     useEffect(() => {
//         let filteredArray = books

//         setFilteredBooks(filteredArray.filter(book =>
//             book.language.some(v => filterLang.includes(v))))
//     }, [filterLang])
//     useEffect(() => {
//         console.log(searchBook)
//         let filteredArray = books
//         if (searchBook === '') {
//             setFilteredBooks(filteredArray)
//         }
//         else {
//             setFilteredBooks(filteredArray.filter(book =>
//                 book.title.toLowerCase().includes(searchBook.toLowerCase()) || book.author.toLowerCase().includes(searchBook.toLowerCase())))
//         }
//     }, [searchBook])
//     const languageClick = (val) => {
//         if (filterLang.includes(val)) {
//             var state = filterLang.filter(item => item !== val)
//             setFilterLang(state)
//         }
//         else {
//             setFilterLang([...filterLang, val])

//         }
//     }

//     return (
//         <Container component="main" >

//             <Typography variant="h1" component="h1">Книги</Typography>
//             <Grid
//                 container
//                 direction="row"
//                 spacing={2}
//             >
//                 <Grid item xs={12} sm={4} md={3}>
//                     <TextField
//                         className={classes.searchBar}
//                         id="standard-search"
//                         label="Търси по заглавие или автор"
//                         fullWidth
//                         value={searchBook}
//                         type="search"
//                         onChange={(e) => setSearchBook(e.target.value)}

//                     />
//                 </Grid>
//                 <Grid item xs={4}>
//                     Категория
//                 </Grid>
//                 <Grid item xs={4}>
//                     Език
//                     <Grid container direction='row' spacing={1}>
//                         {languagesList.map(item => (
//                             <Grid item>
//                                 <Chip
//                                     label={item}
//                                     clickable
//                                     color={filterLang.includes(item) ? "primary" : "gray"}
//                                     onClick={() => languageClick(item)}
//                                 />
//                             </Grid>
//                         ))}
//                     </Grid>
//                 </Grid>
//             </Grid>

//             <Grid
//                 container
//                 direction="row"
//                 justify="center"
//                 spacing={5}
//                 className={classes.cards}
//             >
//                 {filteredBooks.length > 0
//                     ? filteredBooks.map((book) => (
//                         <Grid key={book.id} item xs={12} sm={4} md={3}>
//                             <BookCard book={book} />
//                         </Grid>
//                     ))
//                     : <Typography variant="h5" component="h5">Няма намерени резултати</Typography>
//                 }

//             </Grid>
//         </Container>
//     );
// }

// export default Books;



// const searchClient = algoliasearch(
//     'ORGLS5Z64Q',
//     '5f264f95b844e4b70591918e1e347d79'
// );
function Books(searchWord) {
    const classes = useStyles();
    var searchString = ''
    // if (searchWord.location.searchWord?.length > 0) {
    //     searchString = searchWord.location.searchWord
    // }
    // const InfiniteHits = ({
    //     hits,
    //     hasMore,
    //     refineNext,
    // }) => (
    //         <div>

    //             <Grid
    //                 container
    //                 direction="row"
    //                 justify="center"
    //                 spacing={5}
    //                 className={classes.cards}
    //             >
    //                 {hits.map(hit => (
    //                     <Grid key={hit.id} item xs={12} sm={4} md={3}>
    //                         <BookCard book={hit} />
    //                     </Grid>
    //                 ))}
    //             </Grid>
    //             <button disabled={!hasMore} onClick={refineNext}>
    //                 Покажи още
    //       </button>
    //         </div>
    //     );
    // const SearchBox = ({ currentRefinement, isSearchStalled, refine }) => (
    //     <form noValidate action="" role="search">
    //         <TextField
    //             type="search"
    //             className={classes.searchBar}

    //             value={currentRefinement}
    //             onChange={event => refine(event.currentTarget.value)}
    //         />
    //     </form>
    // );
    // const RefinementList = ({
    //     items,
    //     isFromSearch,
    //     refine,
    //     createURL,
    // }) => (
    //         <Grid item xs={4}>
    //             Език
    //             <Grid container direction='row' spacing={1}>

    //                 {items.map(item => (
    //                     <Grid item>
    //                         <Chip
    //                             href={createURL(item.value)}
    //                             label={item.label}
    //                             clickable
    //                             color={item.isRefined ? "primary" : "gray"}
    //                             onClick={event => {
    //                                 event.preventDefault();
    //                                 refine(item.value);
    //                             }}
    //                         />
    //                     </Grid>


    //                 ))}
    //             </Grid>
    //         </Grid>
    //     );

    // const CustomRefinementList = connectRefinementList(RefinementList);
    // const CustomSearchBox = connectSearchBox(SearchBox);

    // const CustomInfiniteHits = connectInfiniteHits(InfiniteHits);
    return (
        <Container component="main" >
            <div className="ais-InstantSearch" style={{ marginBottom: '100px' }}>
                <Typography variant="h6" noWrap>
                    Всички книги
                    </Typography>
                {/* <InstantSearch indexName="books" searchClient={searchClient}>

                    <CustomSearchBox />
                    <CustomRefinementList attribute="language" />
                    <CustomInfiniteHits />


                </InstantSearch> */}
            </div>
        </Container>
    )
}


export default Books;
