import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import {
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { firestore, storage } from "../js/firebase-config.js";

const totfd = collection(firestore, "totfd");
const totfdDocRef = doc(totfd, "totfdDoc");
const leadsCollection = collection(totfdDocRef, "leadsData");

var timestamp = serverTimestamp(firestore);

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const mobileError = document.getElementById("mobileNumberError");
const subjectError = document.getElementById("subjectError");
const commentsError = document.getElementById("commentsError");

const submitButton = document.getElementById("submitButton");

submitButton.addEventListener("click", async function (e) {
	e.preventDefault();

	const form = document.getElementById("contactForm");
	const nameInput = document.getElementById("name");
	const emailInput = document.getElementById("emailId");
	const mobileInput = document.getElementById("mobileNumber");
	const subjectInput = document.getElementById("subject");
	const commentsInput = document.getElementById("comments");
	let isValid = false;
	console.log(nameInput.value, emailInput.value);

	if (nameInput.value.trim() === "") {
		nameError.textContent = "Please enter your Name";
		isValid = false;
	} else {
		nameError.textContent = "";
		isValid = true;
	}

	let isEmailValid = false;
	let isMobileValid = false;

	if (emailInput.value.trim() === "") {
		emailError.textContent = "Please enter your Email";
	} else if (!validateEmail(emailInput.value.trim())) {
		emailError.textContent = "Invalid Email";
	} else {
		emailError.textContent = "";
		isEmailValid = true;
	}

	if (mobileInput.value.trim() === "") {
		mobileError.textContent = "Please enter your Mobile Number";
	} else if (!validateMobile(mobileInput.value.trim())) {
		mobileError.textContent = "Invalid Mobile Number";
	} else {
		mobileError.textContent = "";
		isMobileValid = true;
	}

	if (isEmailValid || isMobileValid) {
		isValid = true;
		mobileError.textContent = "";
		emailError.textContent = "";
	}
	const referenceImagesInput = document.getElementById("referenceImages");
	const referenceImagesError = document.getElementById("referenceImagesError");

	if (referenceImagesInput.files.length > 4) {
		referenceImagesError.textContent = "You can only upload up to 4 images.";
		isValid = false;
	} else {
		referenceImagesError.textContent = "";
		isValid = true;
	}

	if (subjectInput.value.trim() === "") {
		subjectError.textContent = "Please enter your Subject";
		isValid = false;
	} else {
		subjectError.textContent = "";
		isValid = true;
	}

	if (commentsInput.value.trim() === "") {
		commentsError.textContent = "Please enter your Message";
		isValid = false;
	} else {
		commentsError.textContent = "";
		isValid = true;
	}

	if (isValid) {
		saveDataToFirebase();
		const imageUrls = await saveImagesToFirebase(referenceImagesInput.files);
		// console.log(imageUrls, nameInput.value, emailInput.value);

		emailjs.init("vb9KEKs3BpHBPC0_H");
		const templateParams = {
			from_name: nameInput.value.trim(),
			from_email: emailInput.value.trim() || "Not Provided",
			mobile_number: mobileInput.value.trim() || "Not Provided",
			subject: subjectInput.value.trim(),
			message: commentsInput.value.trim(),
			referenceImage: imageUrls.join(" ; "),
		};
		emailjs
			.send("service_reh310e", "template_0lqohuh", templateParams)
			.then(function (response) {
				console.log("Email sent:", response);
				form.reset();
				setTimeout(function () {
					submissionMessage.textContent = "";
					submissionMessage.classList.remove("success-message");
				}, 3000);
			})
			.catch(function (error) {
				console.error("Email sending failed:", error);
			});
	}
});

function validateEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function validateMobile(mobile) {
	const mobileRegex = /^\d{10}$/;
	return mobileRegex.test(mobile);
}

async function saveImagesToFirebase(files) {
	const imageUrls = [];
	const filesArray = Array.from(files); // Convert FileList to an array
	// console.log(filesArray.length);

	for (const imageFile of filesArray) {
		const uniqueId = Date.now(); // Use a timestamp as a unique identifier
		const imageName = `clientImages2/${uniqueId}_${imageFile.name}`;
		const storageRef = ref(storage, imageName);

		await uploadBytesResumable(storageRef, imageFile);
		const imageUrl = await getDownloadURL(storageRef);
		// console.log(imageUrl, storageRef);
		imageUrls.push(imageUrl);
	}

	// console.log(imageUrls);
	return imageUrls;
}

function saveDataToFirebase() {
	const form = document.getElementById("contactForm");
	const nameInput = document.getElementById("name");
	const emailInput = document.getElementById("emailId");
	const mobileInput = document.getElementById("mobileNumber");
	const subjectInput = document.getElementById("subject");
	const commentsInput = document.getElementById("comments");
	const formData = {
		timestamp: timestamp,
		name: nameInput.value.trim(),
		email: emailInput.value.trim(),
		mobile: mobileInput.value.trim(),
		subject: subjectInput.value.trim(),
		comments: commentsInput.value.trim(),
		status: "New",
	};

	const submissionMessage = document.getElementById("submissionMessage");
	addDoc(leadsCollection, formData)
		.then(function (docRef) {
			setTimeout(function () {
				submissionMessage.textContent =
					"Your message has been sent successfully!";
				submissionMessage.classList.add("success-message");
			}, 2000);
		})

		.catch(function (error) {
			console.error("Error adding document: ", error);
		});
}

let contactData = sessionStorage.getItem("contactAndPaymentData");
if (contactData) {
	try {
		contactData = JSON.parse(contactData);
		showButtonsAndMaps(contactData);
	} catch (error) {
		console.log(error);
	}
}

function showButtonsAndMaps(data) {
	if (data.mobile && data.mobile !== null) {
		const mobileNumber = data.mobile;
		const formattedMobile = `+91 ${data.mobile.substring(
			0,
			5
		)} ${data.mobile.substring(5)}`;
		const mobile = document.getElementById("mobile");
		mobile.innerText = formattedMobile;
		const email = document.getElementById("email");
		email.innerText = data.email ? data.email : "";
		document.getElementById("whatsappButton").style.display = "block";
		document
			.getElementById("whatsappButton")
			.addEventListener("click", function () {
				const message = "Hello! I want to inquire about your products.";
				window.open(
					`https://wa.me/${mobileNumber}?text=${encodeURIComponent(message)}`
				);
			});
	} else {
		document.getElementById("whatsappButton").style.display = "none";
	}
	const showMapsButton = document.getElementById("showMapsBtn");
	const location = document.getElementById("location");
	location.innerText = data.location ? data.location : "";
	if (data.mapLocation && data.mapLocation !== null) {
		showMapsButton.style.display = "block";
		showMapsButton.addEventListener("click", function () {
			const mapUrl = data.mapLocation;
			window.location.href = mapUrl;
		});
	} else {
		showMapsButton.style.display = "none";
	}
}
