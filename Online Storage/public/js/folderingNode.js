import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getStorage, ref, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

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
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
// Initial Listing Reference
const listRef = ref(storage, '');

//Stack of References to list
let Reference = [];

let foldersAll = [];

//file manager to insert to html

// Find all the prefixes and items.
function listing(listRef, poppeditem) {
    listAll(listRef)
        .then((res) => {
            res.prefixes.forEach((folderRef) => {

                createFolderNode(folderRef._location.path_);

            });
            res.items.forEach((itemRef) => {

                createFileNode(itemRef._location.path_, itemRef);

            });


            function createFileNode(name, item) {
                getDownloadURL(item)
                    .then((url) => {

                        let ForReference = name;
                        if (Reference.length > 0) {
                            name = name.replace(Reference[Reference.length - 1] + "/", "");
                        }

                        let container = document.querySelector(".container");

                        let anchor = document.createElement("a");
                        anchor.setAttribute("class", "file");

                        let icon = document.createElement("ion-icon");
                        icon.setAttribute("name", "document-outline");

                        let span1 = document.createElement("span");
                        span1.setAttribute("class", "folderName");
                        span1.setAttribute("id", ForReference);
                        span1.innerHTML = name;

                        let downloadButton = document.createElement("a");
                        downloadButton.setAttribute("id", "download")
                        downloadButton.onclick = downloadbtnClicked;
                        downloadButton.innerHTML = "Download";


                        let label = document.createElement("div");
                        label.setAttribute("class", "label");

                        let wrap = document.createElement("div");
                        wrap.setAttribute("class", "wrap")

                        label.appendChild(span1);

                        wrap.appendChild(icon);
                        wrap.appendChild(label);

                        anchor.appendChild(wrap);
                        anchor.appendChild(downloadButton);

                        container.appendChild(anchor);

                    });
            }

            function createFolderNode(name) {

                let ForReference = name;
                if (Reference.length > 0) {
                    name = name.replace(Reference[Reference.length - 1] + "/", "");
                }

                let container = document.querySelector(".container");

                let anchor = document.createElement("a");
                anchor.setAttribute("class", "folder");

                let icon = document.createElement("ion-icon");
                icon.setAttribute("name", "folder-open-outline");

                let label = document.createElement("div");
                label.setAttribute("class", "label");

                let span1 = document.createElement("span");
                span1.setAttribute("class", "folderName");
                span1.setAttribute("id", ForReference);
                span1.innerHTML = name;

                label.appendChild(span1);
                anchor.appendChild(icon);
                anchor.appendChild(label);

                container.appendChild(anchor);
            }

            foldersAll = document.querySelectorAll(".folder");
            foldersAll.forEach((folder) => {
                folder.addEventListener("click", () => {

                    let container = document.querySelector(".container");

                    let folders = document.querySelectorAll(".folder");
                    folders.forEach((ele) => {
                        container.removeChild(ele);
                    })
                    let files = document.querySelectorAll(".file");
                    files.forEach((ele) => {
                        container.removeChild(ele);
                    })

                    Reference.push(folder.children[1].children[0].id);
                    let length = Reference.length;

                    listing(ref(storage, Reference[length - 1]), Reference[length - 1])
                })
            })
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });

}

window.onload = function () {
    Reference[0] = "";
    listing(ref(storage, Reference[0]), "");
}

function downloadbtnClicked(e) {
    let id = e.srcElement.parentNode.children[0].children[1].children[0].id;
    let filename = e.srcElement.parentNode.children[0].children[1].children[0].innerHTML;
    let href
    getDownloadURL(ref(storage, id))
        .then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                const blob = xhr.response;
                saveBlob(blob,filename)
            };
            xhr.open('GET', url);
            xhr.send();

        })
}

function saveBlob(blob, fileName) {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.dispatchEvent(new MouseEvent('click'));
}


let backbtn = document.getElementById('Backbtn');

backbtn.onclick = () => {

    let container = document.querySelector(".container");

    let folders = document.querySelectorAll(".folder");
    folders.forEach((ele) => {
        container.removeChild(ele);
    });

    let files = document.querySelectorAll(".file");
    files.forEach((ele) => {
        container.removeChild(ele);
    })

    listing(ref(storage, Reference[Reference.length - 2]), Reference.pop())
}