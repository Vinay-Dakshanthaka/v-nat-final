import {
	ref,
	uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { storage } from "../js/firebase-config.js";

var fileInput = document.getElementById("image");
var message = document.getElementById("message");
var uploadButton = document.getElementById("uploadBtn");

// Add event listener to the upload button
uploadButton.addEventListener("click", function () {
	var file = fileInput.files[0];

	if (file) {
		var storageRef = ref(storage, "totfd/gallery-images/" + file.name); // Corrected storage reference
		var uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			function progress(snapshot) {
				var percentage =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				message.innerText = "Upload progress: " + percentage + "%";
			},
			function error(err) {
				message.innerText = "Upload failed: " + err.message;
			},
			function complete() {
				message.innerText = "Upload successful!";
				// Clear the file input after a successful upload
				fileInput.value = ""; // This line clears the file input
				setTimeout(function () {
					message.innerText = "";
				}, 2000);
			}
		);
	} else {
		message.innerText = "Please select a file to upload.";
	}
});
