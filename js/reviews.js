const testimonialCarousel = document.querySelector(".testimonial-carousel");

function populateReviewsTable() {
	testimonialCarousel.innerHTML = "";

	const reviewsData = JSON.parse(sessionStorage.getItem("reviewsData"));

	if (Array.isArray(reviewsData) && reviewsData.length > 0) {
		// console.log("Reviews data found:", reviewsData);

		reviewsData.forEach((review) => {
			const testimonialItem = document.createElement("div");
			testimonialItem.classList.add("testimonial-item", "bg-light");

			const innerContent = `
                <div class="d-flex align-items-center border-bottom pt-5 pb-4 px-5">
                    <img class="img-fluid rounded" src="${review.picUrl}" style="width: 60px; height: 60px" />
                    <div class="ps-4">
                        <h4 class="text-primary mb-1">${review.name}</h4>
                    </div>
                </div>
                <div class="pt-4 pb-5 px-5">
                    ${review.text}
                </div>
            `;
			testimonialItem.innerHTML = innerContent;
			testimonialCarousel.appendChild(testimonialItem);
			// console.log("Added testimonial:", review.name);
		});

		$(testimonialCarousel).owlCarousel({
			autoplay: true,
			smartSpeed: 1500,
			dots: true,
			loop: true,
			center: true,
			responsive: {
				0: {
					items: 1,
				},
				576: {
					items: 1,
				},
				768: {
					items: 2,
				},
				992: {
					items: 3,
				},
			},
		});

		sessionStorage.setItem("reviewsData", JSON.stringify(reviewsData));
		// console.log("Reviews data stored in sessionStorage.");
	}
}

document.addEventListener("DOMContentLoaded", function () {
	populateReviewsTable();
});
