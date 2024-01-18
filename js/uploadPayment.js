import {
	collection,
	doc,
	getDoc,
	updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import {
	getDownloadURL,
	ref,
	uploadBytes,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { firestore, storage } from "../js/firebase-config.js";

const totfd = collection(firestore, "totfd");
const contactAndPaymentsDocRef = doc(totfd, "ContactAndPayments");

document
	.getElementById("submitButton")
	.addEventListener("click", async function (event) {
		event.preventDefault();
		event.stopPropagation();

		const upiID = document.getElementById("upiID").value;
		const qrCode = document.getElementById("qrCode").files[0];
		const qrCodeError = document.getElementById("qrCodeError");
		const messageElement = document.getElementById("message");

		if (!qrCode) {
			qrCodeError.style.display = "block";
			return;
		} else {
			qrCodeError.style.display = "none";
		}

		const storageRef = ref(storage, "totfd/qrCodes/" + qrCode.name);

		try {
			await uploadBytes(storageRef, qrCode);
			const imageUrl = await getDownloadURL(storageRef);
			await updateDoc(contactAndPaymentsDocRef, {
				upiID: upiID || null,
				imageUrl: imageUrl,
			});

			document.getElementById("upiForm").reset();

			displaySuccessMessage(
				"Successfully updated! Please Go to Home Page and Refresh to see the changes."
			);
			setTimeout(function () {
				messageElement.style.display = "none";
			}, 2000);
		} catch (error) {
			displayErrorMessage("Error: Unable to upload the file.");
		}
	});

function displaySuccessMessage(message) {
	const messageElement = document.getElementById("message");
	messageElement.textContent = message;
	messageElement.style.display = "block";
}

function displayErrorMessage(message) {
	const messageElement = document.getElementById("message");
	messageElement.textContent = message;
	messageElement.style.display = "block";
}

async function populateForm() {
	const doc = await getDoc(contactAndPaymentsDocRef);
	if (doc.exists()) {
		const data = doc.data();
        console.log("siva");
		document.getElementById("upiID").value = data.upiID || "";
	}
}

window.addEventListener("load", populateForm);