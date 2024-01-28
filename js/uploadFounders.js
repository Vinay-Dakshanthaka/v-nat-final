import {
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { firestore, storage } from "../js/firebase-config.js";

import {
	collection,
	doc,
	getDoc,
	setDoc,
	updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

const totfd = collection(firestore, "totfd");
const foundersDocRef = doc(totfd, "Founders");
document
	.getElementById("founderForm")
	.addEventListener("submit", async function (event) {
		event.preventDefault();
		event.stopPropagation();

		const founderName = document.getElementById("founderName").value;
		const founderDesignation =
			document.getElementById("founderDesignation").value;
		const founderDescription =
			document.getElementById("founderDescription").value;
		var picInput = document.getElementById("imageFile");

		if (!founderName || !founderDesignation || !founderDescription) {
			document.getElementById("message").textContent =
				"Please fill out all fields.";
			return;
		}

		try {
			var pic = picInput.files[0];
			let picUrl = null;

			if (pic) {
				var storageRef = ref(storage, "totfd/founderImages/" + pic.name);
				var uploadTask = uploadBytesResumable(storageRef, pic);
				await uploadTask;
				picUrl = await getDownloadURL(storageRef);
			}

			const docSnapshot = await getDoc(foundersDocRef);
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				const founders = data.founders || [];
				founders.push({
					founderName,
					founderDesignation,
					founderDescription,
					picUrl,
				});
				await updateDoc(foundersDocRef, { founders });
			} else {
				await setDoc(foundersDocRef, {
					founders: [
						{ founderName, founderDesignation, founderDescription, picUrl },
					],
				});
			}

			document.getElementById("founderName").value = "";
			document.getElementById("founderDesignation").value = "";
			document.getElementById("founderDescription").value = "";
			document.getElementById("imageFile").value = "";
			document.getElementById("message").textContent =
				"Founder Data uploaded successfully,Go to Home Page and Refresh to see the changes.";
			setTimeout(function () {
				document.getElementById("message").textContent = "";
			}, 2000);
		} catch (error) {
			//console.error("Error uploading data to Firebase:", error);
			document.getElementById("message").textContent =
				"An error occurred while uploading the founder.";
		}
	});

const founderNameInput = document.getElementById("founderName");
const founderDesignationInput = document.getElementById("founderDesignation");
const founderDescriptionInput = document.getElementById("founderDescription");
const picInput = document.getElementById("imageFile");
const messageDiv = document.getElementById("message");
const updateMessageDiv = document.getElementById("updateMessage");
const submitBtn = document.getElementById("submitButton");
const updateBtn = document.getElementById("updateButton");

updateBtn.addEventListener("click", async (event) => {
	event.preventDefault();
	event.stopPropagation();
	const updatedFounderName = founderNameInput.value.trim();
	const updatedFounderDesignation = founderDesignationInput.value.trim();
	const updatedFounderDescription = founderDescriptionInput.value.trim();

	try {
		const docSnapshot = await getDoc(foundersDocRef);
		if (docSnapshot.exists()) {
			const data = docSnapshot.data();
			const founders = data.founders || [];
			const matchingFounder = founders.find(
				(founder) => founder.founderName === updatedFounderName
			);

			if (matchingFounder) {
				if (
					!updatedFounderName ||
					!updatedFounderDesignation ||
					!updatedFounderDescription
				) {
					messageDiv.textContent = "Please fill out all fields.";
					return;
				}

				var pic = picInput.files[0];
				let picUrl = null; // Initialize picUrl as null

				if (pic) {
					var storageRef = ref(storage, "/founderImages/" + pic.name);
					var uploadTask = uploadBytesResumable(storageRef, pic);

					await uploadTask;

					picUrl = await getDownloadURL(storageRef);
					//console.log("Download URL:", picUrl);
					if (!picUrl) {
						//console.error("Download URL is null.");
					} else {
						//console.log("Upload successful!");
					}
				}

				const updatedFounders = founders.map((founder) => {
					if (founder.founderName === updatedFounderName) {
						return {
							...founder,
							founderDesignation: updatedFounderDesignation,
							founderDescription: updatedFounderDescription,
							picUrl: picUrl,
						};
					}
					return founder;
				});

				await updateDoc(foundersDocRef, { founders: updatedFounders });

				messageDiv.textContent =
					"Update successful!Go to Home Page and Refresh to see the changes.";
				updateMessageDiv.textContent = "";
				document.getElementById("formContainer").reset();
				//messageDiv.textContent = "No matching document found.";
			}
		} else {
			updateMessageDiv.textContent = "";
			messageDiv.textContent = "No document found for the collection.";
			setTimeout(function () {
				messageDiv.textContent = "";
				updateMessageDiv.textContent = "";
			}, 2000);
		}
	} catch (error) {
		//console.error("Error updating Firestore document:", error);
		updateMessageDiv.textContent = "";
		messageDiv.textContent = "Error updating document. Please try again.";
		setTimeout(function () {
			messageDiv.textContent = "";
			updateMessageDiv.textContent = "";
		}, 2000);
	}
});

async function populateFormAndButtons(founderName) {
	const docSnapshot = await getDoc(foundersDocRef);
	if (docSnapshot.exists()) {
		const data = docSnapshot.data();
		const founders = data.founders || [];
		const matchingFounder = founders.find(
			(founder) => founder.founderName === founderName
		);

		if (matchingFounder) {
			founderNameInput.value = matchingFounder.founderName;
			founderDesignationInput.value = matchingFounder.founderDesignation;
			founderDescriptionInput.value = matchingFounder.founderDescription;

			updateBtn.style.display = "block";
			submitBtn.style.display = "none";

			messageDiv.textContent = "";
		} else {
			submitBtn.style.display = "block";
			updateBtn.style.display = "none";
		}
	} else {
		submitBtn.style.display = "block";
		updateBtn.style.display = "none";
	}
}

let typingTimer;
founderNameInput.addEventListener("keyup", () => {
	clearTimeout(typingTimer);
	typingTimer = setTimeout(async () => {
		const enteredName = founderNameInput.value.trim();
		await populateFormAndButtons(enteredName);
	}, 3000);
});

const deleteBtn = document.getElementById("deleteButton");

deleteBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const founderName = founderNameInput.value.trim();

    if (!founderName) {
        messageDiv.textContent = "Please enter the founder name to delete.";
        return;
    }

    try {
        const docSnapshot = await getDoc(foundersDocRef);

        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const founders = data.founders || [];
            const matchingFounderIndex = founders.findIndex(
                (founder) => founder.founderName === founderName
            );

            if (matchingFounderIndex !== -1) {
                founders.splice(matchingFounderIndex, 1);

                await updateDoc(foundersDocRef, { founders });

                messageDiv.textContent =
                    "Founder data deleted successfully. Go to the Home Page and refresh to see the changes.";
                updateMessageDiv.textContent = "";

                // Clear the form
                founderNameInput.value = "";
                founderDesignationInput.value = "";
                founderDescriptionInput.value = "";
                picInput.value = "";

                // Hide the update button
                updateBtn.style.display = "none";

                setTimeout(function () {
                    messageDiv.textContent = "";
                }, 2000);
            } else {
                messageDiv.textContent = "No matching founder found.";
            }
        } else {
            messageDiv.textContent = "No document found for the collection.";
        }
    } catch (error) {
        //console.error("Error deleting founder data:", error);
        messageDiv.textContent = "An error occurred while deleting the founder data. Please try again.";
    }
});


