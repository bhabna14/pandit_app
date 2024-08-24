// firebaseConfig.js
import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDnr12fJbycTY67cj3q78PEAMG_0D74jTc",
    authDomain: "pandit-cd507.firebaseapp.com",
    projectId: "pandit-cd507",
    storageBucket: "pandit-cd507.appspot.com",
    messagingSenderId: "696430656576",
    appId: "1:696430656576:web:0b5462793e668b0abe33a5",
    measurementId: "G-X7N1W6XCDJ"
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
