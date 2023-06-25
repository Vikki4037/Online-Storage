//Modules imported from firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getStorage, ref, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

//Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAS4XyN1CW8cF_yxwdHHid4u_ZGSLm17PY",
    authDomain: "online-storage-5b73a.firebaseapp.com",
    projectId: "online-storage-5b73a",
    storageBucket: "online-storage-5b73a.appspot.com",
    messagingSenderId: "385340034039",
    appId: "1:385340034039:web:c61836c27acb213d777cf2"
};

//Variables list

//File input variable
let fileSelected = document.getElementById('fileSelected');
//Folder input variable
let folderSelected = document.getElementById('folderSelected');

//Total no if files selected
let fileLength;
//All selected files array
let allFiles = [];

//Uploading button to start uploading all files
let uploadBtn = document.getElementById('UploadBtn');

//Uploading progress holding variable
let progress;

//Uploading animation handling
//Animation block
let uploadAnimation = document.querySelector(".uploadAnimation");
//Progrress indicating element
let progressAnimation = document.querySelector(".progress");

//Icons grouping element
let icons = document.querySelector(".icons");
//Selecting upload type button(file / folder)
let addBtn = document.getElementById("addBtn");
//Sploading icon
let uploadingIcon = document.getElementById("uploadingIcon");


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

//Checking if a user has logged in or not on window loading
window.onload = () => {
    if (getCookie("userOnlineStore") == '')
        window.location.href = "./login.html";
}


//Selecting files with onchange event
fileSelected.onchange = function handleChange(event) {
    allFiles[0] = event.target.files[0];
    fileLength = 1;
    uploadBtn.className = "activated";
}
//Select all files from folder with onchange event
folderSelected.onchange = function handleChange(event) {
    for (let i = 0; i < event.target.files.length; i++) {
        allFiles[i] = event.target.files[i];
    }
    fileLength = allFiles.length;
    uploadBtn.className = "activated";
}

//Sleep function to delay
let sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
};


//Start uploading with onclick function
uploadBtn.onclick = function () {

    //To count no of uploaded files
    let fileCount = 1;

    //Starting uploading animation
    uploadAnimation.classList.toggle("activate");

    for (let i = 0; i < fileLength; i++) {

        //Storage Reference to upload
        let storageRef = ref(storage, allFiles[i].webkitRelativePath);

        if (fileLength == 1)
            storageRef = ref(storage, allFiles[i].name);

        //Uploading task
        const uploadTask = uploadBytesResumable(storageRef, allFiles[i]);
        //Tracking uploading task with on_state_change event
        uploadTask.on('state_changed',
            (snapshot) => {
                progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                //Setting progress to progressbar animation
                progressAnimation.style.width = progress + "%";

            },
            (error) => {
                // Handle unsuccessful uploads
            },
            async () => {
                //Counting total uploaded files to stop animation
                if (progress == 100)
                    fileCount++;

                //Checking if all files are uploaded
                if (fileCount - 1 == fileLength) {
                    //show upload complete icon
                    uploadingIcon.setAttribute("name", "cloud-done-outline");

                    //Sleep for 2sec to show upload complete icon
                    await sleep(2000);

                    //reset upload complete icon
                    uploadingIcon.setAttribute("name", "cloud-upload-outline");

                    //Stop upload animation
                    uploadAnimation.classList.toggle("activate");
                    uploadBtn.classList.remove("activated");
                }
            }
        );
    }
}

//Showing file and folder selection icon on-click
addBtn.addEventListener("click", function () {
    icons.classList.toggle('activated');
})