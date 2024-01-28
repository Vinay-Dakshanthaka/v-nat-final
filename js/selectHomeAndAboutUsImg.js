import {
    collection,
    doc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import {
    getDownloadURL,
    listAll,
    ref,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { firestore, storage } from "../js/firebase-config.js";

const folderPath = "totfd/Home-page-images";

const folderRef = ref(storage, folderPath);

window.updateSelectedName = function (url) {
    document.getElementById("message").textContent = "Image selected";
};

listAll(folderRef)
    .then(function (result) {
        var i = 1;
        result.items.forEach(function (item) {
            var row = document.createElement("tr");
            getDownloadURL(item)
                .then(function (url) {
                    // Set the image source using the URL
                    row.innerHTML = `
<td>${i++}</td>
<td>${item.name}</td>
<td><img src="${url}" width="40" alt="homePageImage" height="40" onclick="
var modal = document.getElementById('imageModal');
var modalImage = document.getElementById('modalImage');
modal.style.display = 'block';
modalImage.src = '${url}';
"/></td>
<td class="text-center"><input type="checkbox" name="selectedNames" id="checkbox-${i}" value="${
                        item.name
                    }"></td>
                    `;
                    // Add the row to the table body
                    document.getElementById("table-body").appendChild(row);
                })
                .catch(function (error) {
                    //console.error("Error getting download URL: ", error);
                });
        });
        i = 1;
    })
    .catch(function (error) {
        //console.error("Error fetching images: ", error);
    });

const totfdCollection = collection(firestore, "totfd");
const Homepage = doc(totfdCollection, "Homepage");

document.getElementById("update-button").addEventListener("click", () => {
    const selectedCheckboxes = document.querySelectorAll(
        'input[name="selectedNames"]:checked'
    );
    if (selectedCheckboxes.length > 0 && selectedCheckboxes.length <= 4) {
        selectedCheckboxes.forEach(async (selectedCheckbox, index) => {
            const selectedImageName = selectedCheckbox.value;
            await updateFirestoreWithSelectedURL(selectedImageName, index + 1);
        });
    } else {
        document.getElementById("message").textContent =
            "Please select 1 to 2 images.";
        setTimeout(function () {
            document.getElementById("message").textContent = "";
        }, 3000);
    }
});

async function updateFirestoreWithSelectedURL(imageName, index) {
    try {
        const url = await getDownloadURL(
            ref(storage, "totfd/Home-page-images/" + imageName)
        );

        await updateDoc(Homepage, {
            ["homePageImageUrl" + index]: url,
        });

        document.getElementById("message").textContent =
            "Home Page Image(s) updated.";
        window.scrollTo(0, 0);

        setTimeout(function () {
            document.getElementById("message").textContent = "";
        }, 3000);
    } catch (error) {
        //console.error("Error updating Firestore:", error);
    }
}
// Add event listener to the update button1

document.getElementById("update-button1").addEventListener("click", () => {
    const selectedCheckboxes = document.querySelectorAll(
        'input[name="selectedNames"]:checked'
    );
    if (selectedCheckboxes.length === 1) {
        const selectedImageName = selectedCheckboxes[0].value;
        updateFirestoreWithSelectedURL1(selectedImageName);
    } else {
        document.getElementById("message").textContent =
            "Please select exactly one image.";
        setTimeout(function () {
            document.getElementById("message").textContent = "";
        }, 3000);
    }
});

async function updateFirestoreWithSelectedURL1(imageName) {
    try {
        const url = await getDownloadURL(
            ref(storage, "totfd/Home-page-images/" + imageName)
        );

        await updateDoc(Homepage, {
            aboutUsPageimageurl: url,
        });

        document.getElementById("message").textContent = "About Us Image updated.";
        window.scrollTo(0, 0);

        setTimeout(function () {
            document.getElementById("message").textContent = "";
        }, 3000);
    } catch (error) {
        //console.error("Error updating Firestore:", error);
    }
}

function closeImageModal() {
    var modal = document.getElementById("imageModal");
    modal.style.display = "none";
}

var closeButton = document.querySelector(".close");
closeButton.addEventListener("click", function () {
    closeImageModal();
});
