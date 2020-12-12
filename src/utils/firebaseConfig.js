import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyC6Qi63VoUUH6br0o5ZwOLfinLoYzv0rcc",
    authDomain: "nyous-213a4.firebaseapp.com",
    projectId: "nyous-213a4",
    storageBucket: "nyous-213a4.appspot.com",
    messagingSenderId: "938200935974",
    appId: "1:938200935974:web:ff7915a8598df1de0100e7",
    measurementId: "G-88N9QK6NG1"
  };

const app = firebase.initializeApp(firebaseConfig);

export const db = app.firestore()

export default firebaseConfig;