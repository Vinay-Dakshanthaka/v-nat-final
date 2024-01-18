(function ($) {
	"use strict";

	// Spinner
	var spinner = function () {
		setTimeout(function () {
			if ($("#spinner").length > 0) {
				$("#spinner").removeClass("show");
			}
		}, 1);
	};
	spinner();

	// Initiate the wowjs
	new WOW().init();

	// Sticky Navbar
	$(window).scroll(function () {
		if ($(this).scrollTop() > 45) {
			$(".navbar").addClass("sticky-top shadow-sm");
		} else {
			$(".navbar").removeClass("sticky-top shadow-sm");
		}
	});

	// Dropdown on mouse hover
	const $dropdown = $(".dropdown");
	const $dropdownToggle = $(".dropdown-toggle");
	const $dropdownMenu = $(".dropdown-menu");
	const showClass = "show";

	$(window).on("load resize", function () {
		if (this.matchMedia("(min-width: 992px)").matches) {
			$dropdown.hover(
				function () {
					const $this = $(this);
					$this.addClass(showClass);
					$this.find($dropdownToggle).attr("aria-expanded", "true");
					$this.find($dropdownMenu).addClass(showClass);
				},
				function () {
					const $this = $(this);
					$this.removeClass(showClass);
					$this.find($dropdownToggle).attr("aria-expanded", "false");
					$this.find($dropdownMenu).removeClass(showClass);
				}
			);
		} else {
			$dropdown.off("mouseenter mouseleave");
		}
	});

	// // Facts counter
	// $('[data-toggle="counter-up"]').counterUp({
	// 	delay: 10,
	// 	time: 2000,
	// });

	// Back to top button
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$(".back-to-top").fadeIn("slow");
		} else {
			$(".back-to-top").fadeOut("slow");
		}
	});
	$(".back-to-top").click(function () {
		$("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
		return false;
	});

	$(".active-relatedjob-carusel").owlCarousel({
		loop: true,
		margin: 45,
		dots: false,
		loop: true,
		autoplay: true,
		smartSpeed: 1000,
		responsive: {
			0: {
				items: 1,
			},
			576: {
				items: 1,
			},
			768: {
				items: 1,
			},
			992: {
				items: 1,
			},
		},
	});
})(jQuery);

// const imageGrid = document.querySelector(".image-grid");
// const links = imageGrid.querySelectorAll("a");
// const imgs = imageGrid.querySelectorAll("img");
// const lightboxModal = document.getElementById("lightbox-modal");
// const bsModal = new bootstrap.Modal(lightboxModal);
// const modalBody = document.querySelector(".modal-body .container-fluid");

// for (const link of links) {
// 	link.addEventListener("click", function (e) {
// 		e.preventDefault();
// 		const currentImg = link.querySelector("img");
// 		const lightboxCarousel = document.getElementById("lightboxCarousel");
// 		if (lightboxCarousel) {
// 			const parentCol = link.parentElement.parentElement;
// 			const index = [...parentCol.parentElement.children].indexOf(parentCol);
// 			const bsCarousel = new bootstrap.Carousel(lightboxCarousel);
// 			bsCarousel.to(index);
// 		} else {
// 			createCarousel(currentImg);
// 		}
// 		bsModal.show();
// 	});
// }

// function createCarousel(img) {
// 	const markup = `
//     <div id="lightboxCarousel" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="false">
//       <div class="carousel-inner">
//         ${createSlides(img)}
//       </div>
//       <button class="carousel-control-prev" type="button" data-bs-target="#lightboxCarousel" data-bs-slide="prev">
//        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
//        <span class="visually-hidden">Previous</span>
//       </button>
//       <button class="carousel-control-next" type="button" data-bs-target="#lightboxCarousel" data-bs-slide="next">
//         <span class="carousel-control-next-icon" aria-hidden="true"></span>
//         <span class="visually-hidden">Next</span>
//       </button>
//     </div>
//     `;

// 	modalBody.innerHTML = markup;
// }

// function createSlides(img) {
// 	let markup = "";
// 	const currentImgSrc = img.getAttribute("src");

// 	for (const img of imgs) {
// 		const imgSrc = img.getAttribute("src");
// 		const imgAlt = img.getAttribute("alt");
// 		const imgCaption = img.getAttribute("data-caption");

// 		markup += `
//     <div class="carousel-item${currentImgSrc === imgSrc ? " active" : ""}">
//       <img src=${imgSrc} alt=${imgAlt}>
//       ${imgCaption ? createCaption(imgCaption) : ""}
//     </div>
//     `;
// 	}

// 	return markup;
// }

// function createCaption(caption) {
// 	return `<div class="carousel-caption">
//      <p class="m-0">${caption}</p>
//     </div>`;
// }
