import * as firebase from "firebase";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "XXXXXXXXXXX_XXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "XXXXXX-XXXXX.firebaseapp.com",
  databaseURL: "https://XXXXXX-XXXXXfirebaseio.com",
  projectId: "XXXXXX-XXXXX",
  storageBucket: "XXXXXX-XXXXX.appspot.com",
  messagingSenderId: "XXXXXXXXXXX",
  appId: "X:XXXXXXXXXXX:XXX:XXXXXXXXXXXXXXXXXXXX",
  measurementId: "X-XXXXXXXXXX",
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
