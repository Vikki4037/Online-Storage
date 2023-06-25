import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAS4XyN1CW8cF_yxwdHHid4u_ZGSLm17PY",
    authDomain: "online-storage-5b73a.firebaseapp.com",
    projectId: "online-storage-5b73a",
    storageBucket: "online-storage-5b73a.appspot.com",
    messagingSenderId: "385340034039",
    appId: "1:385340034039:web:c61836c27acb213d777cf2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Intialize authentication
const auth = getAuth();


let loginBtn = document.getElementById('LoginBtn');

loginBtn.onclick = function () {
    
    let email = document.getElementById('email').value;
    let password = document.getElementById('passWord').value;
    console.log(email);
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setCookie("userOnlineStore",email,10);
            setCookie("passwordOnlineStore",password,10);
            window.location.href = "./index.html";
        })
        .catch((error) => {
            const errorMessage = error.message;
            window.prompt("Error" + errorMessage);
        });
}