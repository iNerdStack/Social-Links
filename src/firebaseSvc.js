import * as firebase from "firebase";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB0dtWis_giBqep5W4ZE-GRoKm3OI4HPJY",
  authDomain: "chatapp-a4410.firebaseapp.com",
  databaseURL: "https://chatapp-a4410.firebaseio.com",
  projectId: "chatapp-a4410",
  storageBucket: "chatapp-a4410.appspot.com",
  messagingSenderId: "110831541784",
  appId: "1:110831541784:web:d9455341a67bde6ae92d6d",
  measurementId: "G-X2G8VVNBJB",
};

class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      //Firebase Service Started
    } else {
    }
  }
}
const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
