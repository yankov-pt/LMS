
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB-fr8N33pSp7ryxGJYLv9xiTjQsRTqjOc",
  authDomain: "library-management-syste-95445.firebaseapp.com",
  databaseURL: "https://library-management-syste-95445.firebaseio.com",
  projectId: "library-management-syste-95445",
  storageBucket: "library-management-syste-95445.appspot.com",
  messagingSenderId: "917754847445",
  appId: "1:917754847445:web:1f75358e5d0976ba4c425c",
  measurementId: "G-XR0BDDY4YS"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();
  console.log('here +>', user)
  if (!snapshot.exists) {
    const role = "user"
    const { email } = user;
    const booksCurrentlyInUser = [];
    const returnedBooks = [];
    const futureBooks = [];
    const wishlist = []
    try {
      await userRef.set({
        role,
        email,
        booksCurrentlyInUser,
        returnedBooks,
        futureBooks,
        wishlist,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

export const onAuthUserListener = (next, fallback) =>
  auth.onAuthStateChanged(authUser => {
    if (authUser) {
      getUserDocument(authUser.uid)
        .then(res => {


          next(res);
        });
    } else {
      fallback();
    }
  });
const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();

    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }


};