import {
	collection,
	doc,
	getDoc,
	updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { firestore } from "../js/firebase-config.js";

const totfd = collection(firestore, "totfd");
const contactAndPaymentDoc = doc(totfd, "ContactAndPayments");

const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", function (event) {
	event.preventDefault();

	const mobile = document.getElementById("mobile").value.trim();
	const email = document.getElementById("email").value.trim();
	const location = document.getElementById("location").value.trim();
	const mapLocation = document.getElementById("map-location").value.trim();
	const facebook = document.getElementById("facebook-link").value.trim();
	const instagram = document.getElementById("instagram-link").value.trim();
	const youtube = document.getElementById("youtube-link").value.trim();
	const twitter = document.getElementById("twitter-link").value.trim();

	const mobileRegex = /^[0-9]{10}$/;
	const emailRegex = /\S+@\S+\.\S+/;

	if (mobile && !mobile.match(mobileRegex)) {
		document.getElementById("mobile-error").style.display = "block";
		return;
	} else {
		document.getElementById("mobile-error").style.display = "none";
	}

	if (email && !email.match(emailRegex)) {
		document.getElementById("email-error").style.display = "block";
		return;
	} else {
		document.getElementById("email-error").style.display = "none";
	}

	const data = {
		mobile: mobile || null,
		email: email || null,
		location: location || null,
		mapLocation: mapLocation || null,
		facebook: facebook || null,
		instagram: instagram || null,
		youtube: youtube || null,
		twitter: twitter || null,
	};

	updateDoc(contactAndPaymentDoc, data)
		.then(() => {
			console.log("Document successfully written!");
			document.getElementById("message").textContent =
				"Sucessfully Updated , Go to Home Page And Refresh to see the changes!";
		})
		.catch((error) => {
			console.error("Error writing document: ", error);
		});
});

function populateForm() {
	getDoc(contactAndPaymentDoc)
		.then((doc) => {
			if (doc.exists()) {
				const data = doc.data();
				if (data.mobile) {
					document.getElementById("mobile").value = data.mobile;
				}
				if (data.email) {
					document.getElementById("email").value = data.email;
				}
				if (data.location) {
					document.getElementById("location").value = data.location;
				}
				if (data.mapLocation) {
					document.getElementById("map-location").value = data.mapLocation;
				}
				if (data.facebook) {
					document.getElementById("facebook-link").value = data.facebook;
				}
				if (data.instagram) {
					document.getElementById("instagram-link").value = data.instagram;
				}
				if (data.youtube) {
					document.getElementById("youtube-link").value = data.youtube;
				}
				if (data.twitter) {
					document.getElementById("twitter-link").value = data.twitter;
				}
			}
		})
		.catch((error) => {
			console.error("Error getting document:", error);
		});
}
document.addEventListener("DOMContentLoaded", function () {
	populateForm();
});
