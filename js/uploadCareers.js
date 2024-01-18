import { firestore } from "../js/firebase-config.js";

import {
	collection,
	doc,
	getDoc,
	setDoc,
	updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

const totfd = collection(firestore, "totfd");
const careersDocRef = doc(totfd, "Careers");

const submitButton = document.getElementById("submitButton");
const updateButton = document.getElementById("updateButton");

// Function to handle submission

function resetForm() {
	document.getElementById("jobDesignation").value = "";
	document.getElementById("minimumQualification").value = "";
	document.getElementById("gender").value = "";
	document.getElementById("experience").value = "";
	document.getElementById("jobDescription").value = "";
}

submitButton.addEventListener("click", async (e) => {
	e.preventDefault();
	const jobDesignation = document.getElementById("jobDesignation").value;
	const minimumQualification = document.getElementById(
		"minimumQualification"
	).value;
	const gender = document.getElementById("gender").value;
	const experience = document.getElementById("experience").value || null;
	const jobDescription =
		document.getElementById("jobDescription").value || null;

	if (!jobDesignation || !minimumQualification || !gender) {
		if (!jobDesignation) {
			document.getElementById("designationError").style.display = "block";
			setTimeout(() => {
				document.getElementById("designationError").style.display = "none";
			}, 3000);
		}
		if (!minimumQualification) {
			document.getElementById("qualificationError").style.display = "block";
			setTimeout(() => {
				document.getElementById("qualificationError").style.display = "none";
			}, 3000);
		}
		if (!gender) {
			document.getElementById("genderError").style.display = "block";
			setTimeout(() => {
				document.getElementById("genderError").style.display = "none";
			}, 3000);
		}
		return;
	}

	try {
		const docSnapshot = await getDoc(careersDocRef);
		if (docSnapshot.exists()) {
			const data = docSnapshot.data();
			const jobs = data.jobs || [];

			jobs.push({
				jobDesignation: jobDesignation,
				minimumQualification: minimumQualification,
				gender: gender,
				experience: experience,
				jobDescription: jobDescription,
			});

			await updateDoc(careersDocRef, { jobs: jobs });
		} else {
			await setDoc(careersDocRef, {
				jobs: [
					{
						jobDesignation: jobDesignation,
						minimumQualification: minimumQualification,
						gender: gender,
						experience: experience,
						jobDescription: jobDescription,
					},
				],
			});
		}

		document.getElementById("message").innerText =
			"Carrer saved successfully! Go to Home Page and Refresh to see the changes";
		resetForm();
		setTimeout(() => {
			document.getElementById("message").innerText = "";
		}, 3000);
	} catch (error) {
		console.error("Error adding document: ", error);
	}
});

const jobDesignationInput = document.getElementById("jobDesignation");
jobDesignationInput.addEventListener("keyup", async () => {
	const jobDesignation = jobDesignationInput.value;
	if (jobDesignation.trim() !== "") {
		const docSnap = await getDoc(careersDocRef);
		if (docSnap.exists()) {
			const data = docSnap.data();
			const jobs = data.jobs || [];
			const matchingJob = jobs.find(
				(job) => job.jobDesignation === jobDesignation
			);

			const submitButton = document.getElementById("submitButton");
			const updateButton = document.getElementById("updateButton");
			const deleteButton = document.getElementById("deleteButton");

			if (matchingJob) {
				document.getElementById("minimumQualification").value =
					matchingJob.minimumQualification;
				document.getElementById("gender").value = matchingJob.gender;
				document.getElementById("experience").value =
					matchingJob.experience || "";
				document.getElementById("jobDescription").value =
					matchingJob.jobDescription || "";
				submitButton.style.display = "none";
				updateButton.style.display = "block";
				deleteButton.style.display = "block";
			} else {
				submitButton.style.display = "block";
				updateButton.style.display = "none";
				deleteButton.style.display = "none";
			}
		}
	}
});

updateButton.addEventListener("click", async () => {
	const jobDesignation = jobDesignationInput.value;
	const minimumQualification = document.getElementById(
		"minimumQualification"
	).value;
	const gender = document.getElementById("gender").value;
	const experience = document.getElementById("experience").value || "";
	const jobDescription = document.getElementById("jobDescription").value || "";

	if (!jobDesignation || !minimumQualification || !gender) {
		if (!jobDesignation) {
			document.getElementById("designationError").style.display = "block";
			setTimeout(() => {
				document.getElementById("designationError").style.display = "none";
			}, 3000);
		}
		if (!minimumQualification) {
			document.getElementById("qualificationError").style.display = "block";
			setTimeout(() => {
				document.getElementById("qualificationError").style.display = "none";
			}, 3000);
		}
		if (!gender) {
			document.getElementById("genderError").style.display = "block";
			setTimeout(() => {
				document.getElementById("genderError").style.display = "none";
			}, 3000);
		}
		return;
	}

	const docSnapshot = await getDoc(careersDocRef);
	if (docSnapshot.exists()) {
		const data = docSnapshot.data();
		const jobs = data.jobs || [];
		const updatedJobs = jobs.map((job) => {
			if (job.jobDesignation === jobDesignation) {
				return {
					...job,
					minimumQualification: minimumQualification,
					gender: gender,
					experience: experience,
					jobDescription: jobDescription,
				};
			}
			return job;
		});

		try {
			await updateDoc(careersDocRef, { jobs: updatedJobs });
			document.getElementById("message").innerText =
				"Careers Data updated successfully!Go to Home Page and Refresh to see the changes";
			resetForm();
			setTimeout(() => {
				document.getElementById("message").innerText = "";
			}, 3000);
		} catch (error) {
			console.error("Error updating document: ", error);
		}
	}
});

deleteButton.addEventListener("click", async () => {
	const jobDesignation = jobDesignationInput.value;
	if (jobDesignation.trim() !== "") {
		const docSnapshot = await getDoc(careersDocRef);
		if (docSnapshot.exists()) {
			const data = docSnapshot.data();
			let jobs = data.jobs || [];
			jobs = jobs.filter((job) => job.jobDesignation !== jobDesignation);
			try {
				await updateDoc(careersDocRef, { jobs: jobs });
				document.getElementById("message").innerText =
					"Careers Data deleted successfully!Go to Home Page and Refresh to see the changes.";
				resetForm();
				setTimeout(() => {
					document.getElementById("message").innerText = "";
				}, 3000);
			} catch (error) {
				console.error("Error deleting document: ", error);
			}
		}
	}
});

function renderCareers(careers) {
	let careersTable = document.getElementById("careersTable");
	let tbody = careersTable.querySelector("tbody");
	tbody.innerHTML = "";
  
	careers.forEach((career, index) => {
	  let row = document.createElement("tr");
  
	  let toggleCell = document.createElement("td");
	  let toggleInput = document.createElement("input");
	  toggleInput.type = "checkbox";
	  toggleInput.className = "toggle-input";
	  toggleInput.checked = career.displayed;
	  toggleInput.addEventListener("change", async (event) => {
		let isVisible = event.target.checked;
		careers[index].displayed = isVisible;
		await updateFirestoreDocument(careersDocRef, { jobs: careers });
	  });
	  toggleCell.appendChild(toggleInput);
  
	  let jobDesignationCell = document.createElement("td");
	  jobDesignationCell.textContent = career.jobDesignation;
  
	  row.appendChild(toggleCell);
	  row.appendChild(jobDesignationCell);
  
	  tbody.appendChild(row);
	});
  }
  
  
async function updateFirestoreDocument(docRef, data) {
	await updateDoc(docRef, data);
}

async function fetchCareersData() {
	const docSnap = await getDoc(careersDocRef);
	if (docSnap.exists()) {
		const careersData = docSnap.data().jobs;
		renderCareers(careersData);
	} else {
		console.log("No such document!");
	}
}

fetchCareersData().catch((error) => {
	console.log("Error getting document:", error);
});
