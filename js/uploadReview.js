import {
	collection,
	doc,
	getDoc,
	setDoc,
	updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import {
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { firestore, storage } from "./firebase-config.js";

const totfd = collection(firestore, "totfd");
const reviewDocRef = doc(totfd, "Reviews");

document
	.getElementById("review-form")
	.addEventListener("submit", async function (event) {
		event.preventDefault();
		event.stopPropagation();

		const name = document.getElementById("name").value;
		const text = document.getElementById("text").value;
		var picInput = document.getElementById("pic");

		if (!name || !text) {
			document.getElementById("message").textContent =
				"Please fill out all fields.";
			return;
		}

		try {
			var pic = picInput.files[0];
			let picUrl = null;

			if (pic) {
				var storageRef = ref(storage, "totfd/ReviewImages/" + pic.name);
				var uploadTask = uploadBytesResumable(storageRef, pic);

				await uploadTask;
				picUrl = await getDownloadURL(storageRef);
				console.log("Download URL:", picUrl);
				if (!picUrl) {
					console.error("Download URL is null.");
				} else {
					console.log("Upload successful!");
				}
			}
			const docSnapshot = await getDoc(reviewDocRef);
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				const reviews = data.reviews || [];
				reviews.push({ name, text, picUrl });
				await updateDoc(reviewDocRef, { reviews });
			} else {
				await setDoc(reviewDocRef, { reviews: [{ name, text, picUrl }] });
			}

			document.getElementById("name").value = "";
			document.getElementById("text").value = "";
			document.getElementById("pic").value = "";
			document.getElementById("message").textContent =
				"Review uploaded successfully!Go to Home Page and Refresh to see the changes.";
		} catch (error) {
			console.error("Error uploading data to Firebase:", error);
			document.getElementById("message").textContent =
				"An error occurred while uploading the review.";
		}
	});

const nameInput = document.getElementById("name");
const textInput = document.getElementById("text");
const picInput = document.getElementById("pic");
const messageDiv = document.getElementById("message");
const updateMessageDiv = document.getElementById("updatemessage");
const submitBtn = document.getElementById("submit-btn");
const updateBtn = document.getElementById("update-btn");
const deleteBtn = document.getElementById("deleteButton");

updateBtn.addEventListener("click", async (e) => {
	e.preventDefault();
	e.stopPropagation();
	const name = nameInput.value.trim();
	const text = textInput.value.trim();

	try {
		const docSnapshot = await getDoc(reviewDocRef);
		if (docSnapshot.exists()) {
			const data = docSnapshot.data();
			const reviews = data.reviews || [];
			const matchingReview = reviews.find((review) => review.name === name);

			if (matchingReview) {
				if (!name || !text) {
					document.getElementById("message").textContent =
						"Please fill out all fields.";
					return;
				}
				var pic = picInput.files[0];
				let picUrl = null;

				if (pic) {
					var storageRef = ref(storage, "totfd/ReviewImages/" + pic.name);
					var uploadTask = uploadBytesResumable(storageRef, pic);

					await uploadTask;

					picUrl = await getDownloadURL(storageRef);
					console.log("Download URL:", picUrl);
					if (!picUrl) {
						console.error("Download URL is null.");
					} else {
						console.log("Upload successful!");
					}

					console.log(
						"Upload successful!Go to Home Page and Refresh to see the changes."
					);
				}

				const updatedReviews = reviews.map((review) => {
					if (review.name === name) {
						return {
							...review,
							name: nameInput.value,
							text: textInput.value,
							picUrl: picUrl,
						};
					}
					return review;
				});

				await updateDoc(reviewDocRef, { reviews: updatedReviews });

				//updateMessageDiv.textContent = "Update successful!";
				messageDiv.textContent =
					"Update successful!Go to Home Page and Refresh to see the changes.";
			} else {
				updateMessageDiv.textContent = "";
				messageDiv.textContent = "No matching document found.";
			}
		} else {
			updateMessageDiv.textContent = "";
			messageDiv.textContent = "Document not found.";
		}
	} catch (error) {
		console.error("Error updating Firestore document:", error);
		updateMessageDiv.textContent = "";
		messageDiv.textContent = "Error updating document. Please try again.";
	}
});

async function populateFormAndButtons(name) {
	const docSnapshot = await getDoc(reviewDocRef);
	if (docSnapshot.exists()) {
		const data = docSnapshot.data();
		const reviews = data.reviews || [];
		const matchingReview = reviews.find((review) => review.name === name);

		if (matchingReview) {
			nameInput.value = matchingReview.name;
			textInput.value = matchingReview.text;
			deleteBtn.style.display = "block";
			updateBtn.style.display = "block";
			submitBtn.style.display = "none";

			messageDiv.textContent = "";
			updateMessageDiv.textContent = "";
		} else {
			submitBtn.style.display = "block";
			updateBtn.style.display = "none";
			deleteBtn.style.display = "none";
		}
	} else {
		submitBtn.style.display = "block";
		updateBtn.style.display = "none";
		deleteBtn.style.display = "none";
	}
}

let typingTimer;

nameInput.addEventListener("keyup", () => {
	clearTimeout(typingTimer);
	typingTimer = setTimeout(async () => {
		const enteredName = nameInput.value.trim();
		await populateFormAndButtons(enteredName);
	}, 3000);
});

deleteBtn.addEventListener("click", async (event) => {
	event.preventDefault();
	event.stopPropagation();

	const name = document.getElementById("name").value.trim();

	if (!name) {
		messageDiv.textContent = "Please enter the founder name to delete.";
		return;
	}

	try {
		const docSnapshot = await getDoc(reviewDocRef);

		if (docSnapshot.exists()) {
			const data = docSnapshot.data();
			const reviews = data.reviews || [];
			const matchingReviewIndex = reviews.findIndex(
				(review) => review.name === name
			);

			if (matchingReviewIndex !== -1) {
				reviews.splice(matchingReviewIndex, 1);

				await updateDoc(reviewDocRef, { reviews });

				messageDiv.textContent =
					"Review data deleted successfully. Go to the Home Page and refresh to see the changes.";
				updateMessageDiv.textContent = "";

				nameInput.value = "";
				textInput.value = "";
				picInput.value = "";
				updateBtn.style.display = "none";

				setTimeout(function () {
					messageDiv.textContent = "";
				}, 2000);
			} else {
				messageDiv.textContent = "No matching Review found.";
			}
		} else {
			messageDiv.textContent = "No reviews found for the this Name.";
		}
	} catch (error) {
		console.error("Error deleting review data:", error);
		messageDiv.textContent =
			"An error occurred while deleting the review data. Please try again.";
	}
});
