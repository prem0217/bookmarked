import firebase from 'firebase'



const config = {
    apiKey: "AIzaSyCJCSpmsZ4gVeCv6pkTilEvfQjOmgrHVEs",
    authDomain: "bookmarked-d5236.firebaseapp.com",
    databaseURL: "https://bookmarked-d5236.firebaseio.com",
    storageBucket: "bookmarked-d5236.appspot.com",
    messagingSenderId: "409041860323"
};

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth
export const storageRef = firebase.storage().ref()
export const refBook = firebase.database().ref("Bookmark")


