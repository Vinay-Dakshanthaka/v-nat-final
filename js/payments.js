import {
	addDoc,
	collection,
	doc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import {
	getDownloadURL,
	ref,
	uploadBytes,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";

import { firestore, storage } from "../js/firebase-config.js";

const upiIdElement = document.getElementById("upiId");
const qrCodeElement = document.getElementById("qrCode");

const uploadButton = document.getElementById("uploadButton");

var modal = document.getElementById("formModal");
var span = document.getElementsByClassName("close")[0];
var vendorSection = document.getElementById("vendorSection");

uploadButton.onclick = function () {
	modal.style.display = "block";
	vendorSection.style.display = "none";
};

span.onclick = function () {
	modal.style.display = "none";
	vendorSection.style.display = "block";
};

window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
		vendorSection.style.display = "block";
	}
};

const paymentData = JSON.parse(sessionStorage.getItem("contactAndPaymentData"));

if (paymentData && Object.keys(paymentData).length > 0) {
	if (paymentData.upiID) {
		upiIdElement.innerText = `UPI ID: ${paymentData.upiID}`;
	}
	if (paymentData.imageUrl) {
		qrCodeElement.src = paymentData.imageUrl;
	}
} else {
	console.log("No payment data found in session storage.");
}

let counter = 1;

const timestamp = new Date();
document
	.getElementById("submitPayment")
	.addEventListener("click", function (event) {
		var name = document.getElementById("name").value;
		var mobile = document.getElementById("mobile").value;
		var amount = document.getElementById("amount").value;
		var purpose = document.getElementById("purpose").value;
		var screenshot = document.getElementById("screenshot").files[0];
		var nameError = document.getElementById("nameError");
		var mobileError = document.getElementById("mobileError");
		var amountError = document.getElementById("amountError");
		var purposeError = document.getElementById("purposeError");
		var screenshotError = document.getElementById("screenshotError");

		// Reset error messages
		nameError.style.display = "none";
		mobileError.style.display = "none";
		amountError.style.display = "none";
		purposeError.style.display = "none";
		screenshotError.style.display = "none";

		// Perform validation checks
		var isValid = true;
		if (name.trim() === "") {
			nameError.style.display = "block";
			isValid = false;
		}
		if (mobile.length !== 10 || isNaN(mobile)) {
			mobileError.style.display = "block";
			isValid = false;
		}
		if (amount.trim() === "" || isNaN(amount) || parseFloat(amount) <= 0) {
			amountError.style.display = "block";
			isValid = false;
		}
		if (purpose.trim() === "") {
			purposeError.style.display = "block";
			isValid = false;
		}
		if (!screenshot) {
			screenshotError.style.display = "block";
			isValid = false;
		}

		if (isValid) {
			const fileName = `scrnshot-${counter}_${screenshot.name}`;

			counter++;

			var storageRef = ref(storage, "totfd/payment-screenshots/" + fileName);

			uploadBytes(storageRef, screenshot)
				.then((snapshot) => {
					console.log("Uploaded a blob or file!");
					getDownloadURL(storageRef)
						.then((url) => {
							const totfd = collection(firestore, "totfd");
							const totfdDocRef = doc(totfd, "totfdDoc");
							const leadsCollection = collection(
								totfdDocRef,
								"paymentLeadsData"
							);

							addDoc(leadsCollection, {
								name: name,
								mobile: mobile,
								amount: parseFloat(amount),
								purpose: purpose,
								picUrl: url,
								status: "New",
								timestamp: timestamp,
							})
								.then((docRef) => {
									console.log("Document written with ID: ", docRef.id);
									document.getElementById("paymentForm").reset();
									modal.style.display = "none";
									uploadMessage.textContent = "Upload successful!";
									uploadMessage.style.color = "red";
									uploadMessage.style.display = "block";
									setTimeout(function () {
										uploadMessage.style.display = "none";
									}, 2000);
								})
								.catch((error) => {
									console.error("Error adding document: ", error);
								});
						})
						.catch((error) => {
							console.error("Error getting download URL: ", error);
						});
				})
				.catch((error) => {
					console.error("Error uploading file: ", error);
				});
		}
	});
