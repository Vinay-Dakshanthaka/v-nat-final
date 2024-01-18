import { firestore } from "../js/firebase-config.js";

import {
	addDoc,
	collection,
	doc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

const totfd = collection(firestore, "totfd");
const totfdDoc = doc(totfd, "totfdDoc");
const careerLeadsCollection = collection(totfdDoc, "careerLeadsData");

var vendorSection = document.getElementById("vendorSection");
async function populateCareers() {
	const postListContainer = document.querySelector(".post-list");
	postListContainer.innerHTML = "";

	const careersData = JSON.parse(sessionStorage.getItem("careersData"));

	const filteredCareersData = careersData.filter(
		(career) => career.displayed === true
	);

	if (filteredCareersData) {
		filteredCareersData.forEach((career) => {
			const singlePost = document.createElement("div");
			singlePost.classList.add("single-post", "d-flex", "flex-row");

			const thumb = document.createElement("div");
			thumb.classList.add("thumb");
			const thumbImg = document.createElement("img");
			thumbImg.src = "https://img.icons8.com/nolan/64/new-job.png";
			thumbImg.alt = "";
			thumb.appendChild(thumbImg);

			const details = document.createElement("div");
			details.classList.add("details");

			const titleDiv = document.createElement("div");
			titleDiv.classList.add(
				"title",
				"d-flex",
				"flex-row",
				"justify-content-between"
			);

			const titles = document.createElement("div");
			const jobTitle = document.createElement("h3");
			jobTitle.textContent = career.jobDesignation;
			titles.appendChild(jobTitle);

			if (career.jobDescription) {
				const jobDescription = document.createElement("h5");
				jobDescription.textContent = `Job Description: ${career.jobDescription}`;
				titles.appendChild(jobDescription);
			}

			if (career.experience) {
				const jobExperience = document.createElement("h5");
				jobExperience.textContent = `Experience: ${career.experience}`;
				titles.appendChild(jobExperience);
			}
			const btnsWrapper = document.createElement("div");
			btnsWrapper.classList.add("btns-wrapper");
			const btns = document.createElement("ul");
			btns.classList.add("btns");
			const li1 = document.createElement("li");
			const heartLink = document.createElement("a");
			const heartIcon = document.createElement("span");
			heartIcon.classList.add("ri-heart-line");
			heartLink.appendChild(heartIcon);
			li1.appendChild(heartLink);

			heartLink.addEventListener("click", function () {
				heartIcon.classList.toggle("ri-heart-fill");
			});

			const li2 = document.createElement("li");
			const applyLink = document.createElement("a");
			applyLink.textContent = "Apply";
			li2.appendChild(applyLink);

			applyLink.addEventListener("click", function () {
				const applicationModal = document.getElementById("applicationModal");
				vendorSection.style.display = "none";
				applicationModal.style.display = "block";
				const designationField = document.getElementById("designation");
				designationField.value = career.jobDesignation;
			});

			btns.appendChild(li1);
			btns.appendChild(li2);
			btnsWrapper.appendChild(btns);

			titleDiv.appendChild(titles);
			titleDiv.appendChild(btnsWrapper);

			const description = document.createElement("h6");
			description.textContent = `Minimum Qualification : ${career.minimumQualification}`;

			const gender = document.createElement("h6");
			gender.textContent = `Preferred Gender: ${career.gender}`;

			details.appendChild(titleDiv);
			details.appendChild(description);
			details.appendChild(gender);

			singlePost.appendChild(thumb);
			singlePost.appendChild(details);

			postListContainer.appendChild(singlePost);
		});
	}
}
const applicationModal = document.getElementById("applicationModal");

const closeButtons = document.getElementsByClassName("close");
Array.from(closeButtons).forEach((button) => {
	button.addEventListener("click", () => {
		applicationModal.style.display = "none";
		vendorSection.style.display = "block";
	});
});

// Function to handle form submission
applicationForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const name = document.getElementById("name").value;
	const qualification = document.getElementById("qualification").value;
	const mobile = document.getElementById("mobile").value;
	const email = document.getElementById("email").value;
	const experience = document.getElementById("experience").value;
	const designation = document.getElementById("designation").value;
	const timestamp = new Date();

	try {
		await addDoc(careerLeadsCollection, {
			name: name,
			qualification: qualification,
			mobile: mobile,
			email: email,
			experience: experience,
			designation: designation,
			timestamp: timestamp,
		});

		const successMessage = document.getElementById("successMessage");
		applicationForm.reset();
		successMessage.style.display = "block";
		window.scrollTo(0, 0);

		setTimeout(() => {
			successMessage.style.display = "none";
			applicationModal.style.display = "none";
		}, 3000);

		console.log("Data saved successfully!");
	} catch (error) {
		console.error("Error adding document: ", error);
	}
});

document.addEventListener("DOMContentLoaded", function () {
	populateCareers();
});
