import {firebase} from '@firebase/app';

import '@firebase/auth'
import '@firebase/database'
import '@firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyApSrWb51gqO6xrF19nMV1FE2zGyVx_tLM",
    authDomain: "chitchat-aa45a.firebaseapp.com",
    databaseURL: "https://chitchat-aa45a.firebaseio.com",
    projectId: "chitchat-aa45a",
    storageBucket: "chitchat-aa45a.appspot.com",
    messagingSenderId: "139255536540",
    appId: "1:139255536540:web:0e2bb3e6b50fbda76f4659",
    measurementId: "G-4W93FN86NB"
  };
  firebase.initializeApp(firebaseConfig);


  export default firebase;