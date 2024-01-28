function getHomepageDataFromSessionStorage() {
	const HomePagedata = sessionStorage.getItem("homepageData");
	return JSON.parse(HomePagedata);
}

async function populatePage() {
	const HomePagedata = getHomepageDataFromSessionStorage();
	 document.getElementById("footerlogoimage").src = HomePagedata.footerlogoimageurl;

	if (HomePagedata && HomePagedata.aboutUsCaption) {
		const aboutUsCaption = document.getElementById("aboutUsCaption");
		aboutUsCaption.textContent = HomePagedata.aboutUsCaption;
	}

	if (HomePagedata && HomePagedata.aboutUsHeader) {
		const aboutUsHeader = document.getElementById("aboutUsHeader");
		aboutUsHeader.textContent = HomePagedata.aboutUsHeader;
	}

	if (HomePagedata && HomePagedata.aboutUsFooter) {
		const aboutUsFooter = document.getElementById("aboutUsFooter");
		aboutUsFooter.textContent = HomePagedata.aboutUsFooter;
	}
	const aboutUsImage = document.getElementById("aboutUsImage");
	const aboutUsPageImageUrl = HomePagedata.aboutUsPageimageurl;

	if (aboutUsPageImageUrl) {
		aboutUsImage.src = aboutUsPageImageUrl;
	} else {
		aboutUsImage.style.display = "none";
	}

	if (
		HomePagedata &&
		HomePagedata.aboutUsPoints &&
		Array.isArray(HomePagedata.aboutUsPoints)
	) {
		const aboutUsPoints = document.getElementById("aboutUsPoints");
		if (aboutUsPoints) {
			HomePagedata.aboutUsPoints.forEach((point, index) => {
				const col = document.createElement("div");
				col.className = "col-sm-6 wow zoomIn";
				col.setAttribute("data-wow-delay", 0.2 * (index + 1) + "s");

				const pointElement = document.createElement("h5");
				pointElement.className = "mb-3";
				//console.log(pointElement);
				addIconToElement(pointElement)
					.then((message) => {
						// //console.log(message);
						// //console.log(pointElement); // Check if the icon is present in the pointElement
					})
					.catch((error) => {
						//console.error(error);
					});
				pointElement.textContent = point;
				col.appendChild(pointElement);
				aboutUsPoints.appendChild(col);
			});
		}
	}
}
const addIconToElement = (pointElement) => {
	return new Promise((resolve, reject) => {
		const icon = document.createElement("i");
		icon.classList.add("fas", "fa-check", "text-primary", "me-3");

		setTimeout(() => {
			pointElement.insertBefore(icon, pointElement.firstChild);
			resolve("Icon successfully appended to pointElement");
		}, 1000);
	});
};

populatePage();

const teamContainer = document.getElementById("teamContainer");
const TeamSection = document.getElementById("TeamSection");
function populateFoundersTable() {
	const foundersData = JSON.parse(sessionStorage.getItem("foundersData"));

	if (foundersData) {
		foundersData.forEach((founder, index) => {
			const colDelay = (index + 1) * 0.3;
			const colElement = document.createElement("div");
			colElement.classList.add("col-lg-4", "wow", "slideInUp");
			colElement.setAttribute("data-wow-delay", `${colDelay}s`);

			const teamItem = document.createElement("div");
			teamItem.classList.add(
				"team-item",
				"bg-light",
				"rounded",
				"overflow-hidden"
			);

			const teamImg = document.createElement("div");
			teamImg.classList.add("team-img", "position-relative", "overflow-hidden");

			const imgElement = document.createElement("img");
			imgElement.classList.add("img-fluid", "w-100");
			imgElement.src = founder.picUrl;
			imgElement.alt = founder.founderName;
			teamImg.appendChild(imgElement);

			const teamSocial = document.createElement("div");
			teamSocial.classList.add("team-social");
			teamSocial.style.display = "none";

			const socialIcons = [
				"fa fa-globe",
				"fab fa-facebook-f",
				"fab fa-instagram",
				"fab fa-linkedin-in",
			];

			socialIcons.forEach((iconClass) => {
				const icon = document.createElement("i");
				icon.setAttribute(
					"class",
					`btn btn-lg btn-primary btn-lg-square rounded ${iconClass} fw-normal`
				);
				teamSocial.appendChild(icon);
			});

			teamImg.appendChild(teamSocial);
			teamItem.appendChild(teamImg);
			teamImg.addEventListener("mouseover", () => {
				teamSocial.style.display = "block";
			});

			teamImg.addEventListener("mouseout", () => {
				teamSocial.style.display = "none";
			});

			const textCenter = document.createElement("div");
			textCenter.classList.add("text-center", "py-4");

			const nameElement = document.createElement("h4");
			nameElement.classList.add("text-primary");
			nameElement.textContent = founder.founderName;
			textCenter.appendChild(nameElement);

			const designationElement = document.createElement("p");
			designationElement.classList.add("text-uppercase", "m-0");
			designationElement.textContent = founder.founderDesignation;
			textCenter.appendChild(designationElement);

			const descriptionElement = document.createElement("p");
			descriptionElement.classList.add("text-muted", "mt-3");
			descriptionElement.textContent = founder.founderDescription;
			textCenter.appendChild(descriptionElement);

			const descriptionContainer = document.createElement("div");
			descriptionContainer.classList.add("row");
			const descriptionCol = document.createElement("div");
			descriptionCol.classList.add("col-12");
			descriptionContainer.appendChild(descriptionCol);

			teamItem.appendChild(textCenter);
			teamItem.appendChild(descriptionContainer);
			colElement.appendChild(teamItem);
			teamContainer.appendChild(colElement);
		});
		TeamSection.style.display = "block";
	} else {
		//console.log("No founders data present in session storage");
	}
}

populateFoundersTable();
