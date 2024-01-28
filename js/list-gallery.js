import {
	deleteObject,
	getDownloadURL,
	listAll,
	ref,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { storage } from "../js/firebase-config.js";

const storageRef = ref(storage, "totfd/gallery-images");

function showMessage(message, durationInSeconds = 5) {
	const messageDiv = document.getElementById("messageDiv");
	messageDiv.innerText = message;

	setTimeout(() => {
		messageDiv.innerText = "";
	}, durationInSeconds * 1000);
}

function closeImageModal() {
	var modal = document.getElementById("imageModal");
	modal.style.display = "none";
}

var closeButton = document.querySelector(".close");
closeButton.addEventListener("click", function () {
	closeImageModal();
});

// Function to populate the table with images from Firebase Storage
function populateTable(searchTerm) {
	const galleryTableBody = document.getElementById("galleryTableBody");
	galleryTableBody.innerHTML = ""; // Clear previous data

	listAll(storageRef)
		.then((result) => {
			const filteredItems = result.items.filter((item) =>
				item.name.includes(searchTerm)
			);
			if (filteredItems.length === 0) {
				showMessage("No matching images found.");
			} else {
				filteredItems.forEach(async (item, index) => {
					const newRow = galleryTableBody.insertRow();
					newRow.insertCell(0).innerText = index + 1; // S.No
					newRow.insertCell(1).innerText = item.name; // Image name

					// Create an image element for Display Image
					const displayImageCell = newRow.insertCell(2);
					const img = document.createElement("img");
					const downloadURL = await getDownloadURL(item); // Get image URL
					img.src = downloadURL;
					img.style.width = "50px";
					img.style.height = "50px";
					displayImageCell.appendChild(img);
					img.addEventListener("click", function () {
						var modal = document.getElementById("imageModal");
						var modalImage = document.getElementById("modalImage");
						modal.style.display = "block";
						modalImage.src = downloadURL;
					});

					const actionCell = newRow.insertCell(3);
					const deleteButton = document.createElement("button");
					deleteButton.textContent = "Delete";
					deleteButton.className = "btn btn-danger";
					deleteButton.addEventListener("click", () => deleteImage(item));
					actionCell.appendChild(deleteButton);
				});
			}
		})
		.catch((error) => {
			//console.error("Error fetching images: ", error);
		});
}
function deleteImage(item) {
	try {
		// Create a reference to the item (file)
		const fileRef = ref(storage, item.fullPath);
		deleteObject(fileRef)
			.then(() => {
				//console.log("Item deleted successfully");
				showMessage("Item deleted successfully");
				populateTable("");
			})
			.catch((error) => {
				//console.error("Error deleting image: ", error);
				showMessage("Error deleting image: " + error.message);
			});
	} catch (error) {
		//console.error("Error creating storage reference: ", error);
		showMessage("Error creating storage reference.");
	}
}
document.getElementById("searchInput").addEventListener("input", function () {
	const searchTerm = this.value;
	populateTable(searchTerm);
});

// Populate the table when the page loads
populateTable("");
