import {
	ref,
	uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { storage } from "../js/firebase-config.js";

var fileInput = document.getElementById("formFile");
var message = document.getElementById("message");
var uploadButton = document.getElementById("uploadButton");

uploadButton.addEventListener("click", function () {
	var file = fileInput.files[0];

	if (file) {
		var storageRef = ref(storage, "totfd/Home-page-images/" + file.name);
		var uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			function progress(snapshot) {
				var percentage =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				message.innerText = "Upload in progress ";
			},
			function error(err) {
				message.innerText = "Upload failed: " + err.message;
			},
			function complete() {
				message.innerText = "Upload successful!";
			}
		);
	} else {
		message.innerText = "Please select a file to upload.";
	}
});
