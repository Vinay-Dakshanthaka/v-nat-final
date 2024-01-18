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
import { firestore, storage } from "../js/firebase-config.js";

const totfd = collection(firestore, "totfd");
const clientDocRef = doc(totfd, "Clients");

const nameInput = document.getElementById("name");
const picInput = document.getElementById("pic");
const submitButton = document.getElementById("submit-button");
const updateButton = document.getElementById("update-button");
const messageElement = document.getElementById("message");
const updateMessageElement = document.getElementById("update-message");

async function handleDeleteClient() {
	const name = nameInput.value.trim();

	const docSnapshot = await getDoc(clientDocRef);

	if (docSnapshot.exists()) {
		const data = docSnapshot.data();
		let clientsData = data.clients || [];

		const existingClientIndex = clientsData.findIndex(
			(client) => client.name === name
		);
		if (existingClientIndex !== -1) {
			clientsData.splice(existingClientIndex, 1);
			await updateDoc(clientDocRef, { clients: clientsData });
			nameInput.value = "";
			picInput.value = "";
			updateFormUI(false);
			messageElement.textContent =
				"Client Deleted Successfully!Go to Home Page and Refresh to see the changes.";

			setTimeout(() => {
				location.reload();
			}, 5000);
		} else {
			messageElement.textContent = "Client Does Not Exist";
		}
	} else {
		messageElement.textContent = "Error: Client Data Not Found";
	}
}

updateButton.addEventListener("click", handleDeleteClient);

function updateFormUI(clientExists) {
	if (clientExists) {
		submitButton.style.display = "none";
		updateButton.style.display = "block";
		messageElement.textContent = "Client name already exists.";
		updateButton.addEventListener("click", handleDeleteClient);
	} else {
		submitButton.style.display = "block";
		updateButton.style.display = "none";
		updateMessageElement.textContent = "";
	}
}

document
	.getElementById("client-form")
	.addEventListener("submit", async function (event) {
		event.preventDefault();

		const name = nameInput.value.trim();
		const docSnapshot = await getDoc(clientDocRef);
		const data = docSnapshot.data();
		const clientsData = data && data.clients ? data.clients : [];
		const existingClient = clientsData.find((client) => client.name === name);

		if (existingClient) {
			updateFormUI(true);
		} else {
			if (!nameInput) {
				document.getElementById("message").textContent =
					"Please fill out all fields.";
				return;
			}

			try {
				var pic = picInput.files[0];
				let picUrl = null;

				if (pic) {
					var storageRef = ref(storage, "totfd/clientImages/" + pic.name);
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

				const docSnapshot = await getDoc(clientDocRef);
				if (docSnapshot.exists()) {
					const data = docSnapshot.data();
					const clients = data.clients || [];
					const existingClient = clients.find((client) => client.name === name);
					if (!existingClient) {
						clients.push({ name, picUrl });
						await updateDoc(clientDocRef, { clients });
					} else {
						console.log("Client already exists");
					}
				} else {
					await setDoc(clientDocRef, { clients: [{ name, picUrl }] });
				}

				document.getElementById("name").value = "";
				document.getElementById("pic").value = "";
				document.getElementById("message").textContent =
					"Client added successfully. Go to Home Page and refresh to see the changes.";
				setTimeout(() => {
					location.reload();
				}, 5000);
			} catch (error) {
				console.error("Error uploading data to Firebase:", error);
				document.getElementById("message").textContent =
					"An error occurred while uploading the client.";
			}
		}
	});
