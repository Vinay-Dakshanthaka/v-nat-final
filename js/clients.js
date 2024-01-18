const vendorCarousel = document.querySelector(".vendor-carousel2");
function populateClientTable() {
	vendorCarousel.innerHTML = "";

	const clientsData = JSON.parse(sessionStorage.getItem("clientsData"));
	if (clientsData) {
		clientsData.forEach((client) => {
			const clientContainer = document.createElement("div");
			clientContainer.classList.add("client-container");

			const imgElement = document.createElement("img");
			imgElement.src = client.picUrl;
			imgElement.alt = client.name;
			imgElement.style.display = "block";
			clientContainer.appendChild(imgElement);

			const nameElement = document.createElement("p");
			nameElement.textContent = client.name;
			nameElement.style.fontSize = "14px";
			nameElement.style.color = "#333";
			nameElement.style.margin = "0";
			nameElement.style.textAlign = "center";
			clientContainer.appendChild(nameElement);

			vendorCarousel.appendChild(clientContainer);
		});

		$(".vendor-carousel2").owlCarousel({
			loop: true,
			margin: 45,
			dots: false,
			loop: true,
			autoplay: true,
			smartSpeed: 1000,
			responsive: {
				0: {
					items: 2,
				},
				576: {
					items: 4,
				},
				768: {
					items: 6,
				},
				992: {
					items: 8,
				},
			},
		});
		const vendorSection = document.getElementById("vendorSection");
		vendorSection.style.display = "block";
	} else {
		console.log("No data in session storage");
	}
}

document.addEventListener("DOMContentLoaded", function () {
	populateClientTable();
});
