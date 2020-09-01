const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Set up Algolia.
// The app id and API key are coming from the cloud functions environment, as we set up in Part 1, Step 3.
const algoliaClient = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
// Since I'm using develop and production environments, I'm automatically defining 
// the index name according to which environment is running. functions.config().projectId is a default 
// property set by Cloud Functions.
const collectionIndexName = 'books';
const collectionIndex = algoliaClient.initIndex(collectionIndexName);

exports.sendCollectionToAlgolia = functions.https.onRequest(async (req, res) => {

    // This array will contain all records to be indexed in Algolia.
    // A record does not need to necessarily contain all properties of the Firestore document,
    // only the relevant ones. 
    const algoliaRecords = [];

    // Retrieve all documents from the books collection.
    const querySnapshot = await db.collection('books').get();

    querySnapshot.docs.forEach(doc => {
        const document = doc.data();
        // Essentially, you want your records to contain any information that facilitates search, 
        // display, filtering, or relevance. Otherwise, you can leave it out.
        const record = {
            objectID: doc.id,
            id: doc.id,
            author: document.author,
            genre: document.genre,
            title: document.title,
            description: document.description,
            language: document.language,
            cover: document.cover,
        };

        algoliaRecords.push(record);
    });

    // After all records are created, we save them to 
    collectionIndex.saveObjects(algoliaRecords, (_error, content) => {
        res.status(200).send("books was indexed to Algolia successfully.");
    });

})

exports.collectionOnCreate = functions.firestore.document('books/{uid}').onCreate(async (snapshot, context) => {
    await saveDocumentInAlgolia(snapshot);
});

exports.collectionOnUpdate = functions.firestore.document('books/{uid}').onUpdate(async (change, context) => {
    await updateDocumentInAlgolia(change);
});

exports.collectionOnDelete = functions.firestore.document('books/{uid}').onDelete(async (snapshot, context) => {
    await deleteDocumentFromAlgolia(snapshot);
});

async function saveDocumentInAlgolia(snapshot) {
    if (snapshot.exists) {
        const record = snapshot.data();
        if (record) { // Removes the possibility of snapshot.data() being undefined.
            // if (record.isIncomplete === false) { // We only index products that are complete.
            record.objectID = snapshot.id;

            // In this example, we are including all properties of the Firestore document 
            // in the Algolia record, but do remember to evaluate if they are all necessary.
            // More on that in Part 2, Step 2 above.

            await collectionIndex.saveObject(record); // Adds or replaces a specific object.
            // }
        }
    }
}

async function updateDocumentInAlgolia(change) {
    const docBeforeChange = change.before.data()
    const docAfterChange = change.after.data()
    if (docBeforeChange && docAfterChange) {
        // if (docAfterChange.isIncomplete && !docBeforeChange.isIncomplete) {
        //     // If the doc was COMPLETE and is now INCOMPLETE, it was 
        //     // previously indexed in algolia and must now be removed.
        //     await deleteDocumentFromAlgolia(change.after);
        // } else if (docAfterChange.isIncomplete === false) {
        await saveDocumentInAlgolia(change.after);
        // }
    }
}

async function deleteDocumentFromAlgolia(snapshot) {
    if (snapshot.exists) {
        const objectID = snapshot.id;
        await collectionIndex.deleteObject(objectID);
    }
}