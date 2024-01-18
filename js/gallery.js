import { 
    getDownloadURL,
    listAll, 
    ref 
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { storage } from "../js/firebase-config.js";

function populateGallery() {
    const galleryContainer = document.getElementById("gallery-container");

    const storageRef = ref(storage, "totfd/gallery-images");
    listAll(storageRef).then(function (result) {
        result.items.forEach(function (imageRef) {
            getDownloadURL(imageRef).then(function (url) {
                const galleryItem = document.createElement("div");
                galleryItem.classList.add("col-12", "col-sm-6", "col-md-4");

                const figure = document.createElement("figure");

                const link = document.createElement("a");
                link.setAttribute("data-lightbox", "gallery");
                link.href = url;

                const img = document.createElement("img");
                img.src = url;
                img.alt = url;
                img.style.width = "400px";
                img.style.height = "400px";
                img.classList.add("img-fluid");

                link.appendChild(img);
                figure.appendChild(link);

                galleryItem.appendChild(figure);

                galleryContainer.appendChild(galleryItem);
            });
        });

        // Initialize Lightbox2 after populating the gallery
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true
        });
    });
}

populateGallery();
