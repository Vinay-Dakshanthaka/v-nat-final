const teamContainer = document.getElementById("teamContainer");

function populateFoundersTable() {
	const foundersData = JSON.parse(sessionStorage.getItem("foundersData"));

	if (Array.isArray(foundersData) && foundersData.length > 0) {
		const foundersLink = document.getElementById("founders");
		foundersLink.style.display = "block";
		const foundersLink2 = document.getElementById("founders2");
		foundersLink2.style.display = "block";
		const TeamSection = document.getElementById("TeamSection");
		TeamSection.style.display = "block";
		sessionStorage.setItem("foundersData", JSON.stringify(foundersData));

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
	} else {
		// console.log("No founders data present in session storage");
	}
}

populateFoundersTable();
