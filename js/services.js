function fetchServicesDataFromLocalStorage() {
	const servicesData = JSON.parse(
		sessionStorage.getItem("productsAndServicesData")
	);
	return servicesData;
}

async function populateServiceContainer() {
	const serviceData = fetchServicesDataFromLocalStorage();

	const serviceCaption = document.getElementById("ourServiceCaption");
	serviceCaption.textContent = serviceData.servicesCaption;

	const serviceContainer = document.getElementById("serviceContainer");
	serviceContainer.innerHTML = "";

	serviceData.services.forEach((service, index) => {
		const serviceCard = document.createElement("div");
		serviceCard.classList.add("col-lg-4", "col-md-6", "wow", "zoomIn");
		serviceCard.dataset.wowDelay = "0.3s";

		const cardBody = document.createElement("div");
		cardBody.classList.add(
			"service-item",
			"bg-light",
			"rounded",
			"d-flex",
			"flex-column",
			"align-items-center",
			"justify-content-center",
			"text-center"
		);

		const serviceIcon = document.createElement("div");
		serviceIcon.className = "service-icon";
		const icon = document.createElement("i");
		icon.className = "fa fa-gift";
		icon.classList.add("text-white");
		//icon.textContent = service.title.charAt(0);
		icon.style.fontSize = "24px";
		icon.style.fontWeight = "bold";
		serviceIcon.appendChild(icon);

		cardBody.appendChild(serviceIcon);

		const serviceLink = document.createElement("a");
		serviceLink.className = "btn btn-lg btn-primary rounded";
		serviceLink.setAttribute("href", "./contact.html");
		const linkIcon = document.createElement("i");
		linkIcon.className = "bi bi-arrow-right";
		serviceLink.appendChild(linkIcon);

		cardBody.appendChild(serviceLink);

		const serviceTitle = document.createElement("h4");
		serviceTitle.classList.add("mb-3");
		serviceTitle.textContent = service.title;

		const serviceDescription = document.createElement("p");
		serviceDescription.classList.add("m-0");
		serviceDescription.textContent = service.description;

		cardBody.appendChild(serviceTitle);
		cardBody.appendChild(serviceDescription);

		serviceCard.appendChild(cardBody);

		serviceContainer.appendChild(serviceCard);

		serviceCard.addEventListener("click", function () {
			const userResponse = confirm("Do you wish to know more information?");
			if (userResponse) {
				window.location.href = "./contact.html";
			}
		});
	});
}

populateServiceContainer();
