import {
	getAuth,
	signOut,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";

import { app } from "./firebase-config.js";

const auth = getAuth(app);

if (sessionStorage.getItem("loggedIn") === "true") {
	onLoggedIn();
} else {
	onLoggedOut();
}

function onLoggedIn() {
	document.getElementById("adminActivites").style.display = "block";
	document.getElementById("login").style.display = "none";
}

function onLoggedOut() {
	document.getElementById("adminActivites").style.display = "none";
	document.getElementById("login").style.display = "block";
}

confirmLogoutBtn.addEventListener("click", () => {
	signOut(auth)
		.then(() => {
			console.log("User logged out successfully");
			window.location.href = "index.html";
			history.replaceState(null, null, "index.html");
			sessionStorage.setItem("loggedIn", "false");
		})
		.catch((error) => {
			console.error("Error during logout:", error);
		});
});

const hasGallery = sessionStorage.getItem("hasGallery");

if (hasGallery === "true") {
	const moreLink = document.getElementById("more");
	moreLink.style.display = "block";
	const galleryLink = document.getElementById("gallery");
	galleryLink.style.display = "block";
	const galleryLink2 = document.getElementById("gallery2");
	galleryLink2.style.display = "block";
}

const homepageData = getHomepageDataFromSessionStorage();

if (homepageData && homepageData.showServiceSection === true) {
	const servicesData = JSON.parse(
		sessionStorage.getItem("productsAndServicesData")
	);
	if (
		servicesData &&
		Object.keys(servicesData).length > 0 &&
		servicesData.servicesCaption
	) {
		const servicesLink = document.getElementById("services");
		servicesLink.style.display = "block";
		const servicesLink2 = document.getElementById("services2");
		servicesLink2.style.display = "block";
	}
}

if (homepageData && homepageData.showProductSection === true) {
	const productsData = JSON.parse(
		sessionStorage.getItem("productsAndServicesData")
	);
	if (
		productsData &&
		Object.keys(productsData).length > 0 &&
		productsData.productCaption
	) {
		const productsLink = document.getElementById("products");
		productsLink.style.display = "block";
		const productsLink2 = document.getElementById("products2");
		productsLink2.style.display = "block";
	}
}

const paymentData = JSON.parse(sessionStorage.getItem("contactAndPaymentData"));
if (
	paymentData &&
	Object.keys(paymentData).length > 0 &&
	paymentData.imageUrl
) {
	const paymentsLink = document.getElementById("payments");
	paymentsLink.style.display = "block";
	const paymentsLink2 = document.getElementById("payments2");
	paymentsLink2.style.display = "block";
}

const reviewsCollection = JSON.parse(sessionStorage.getItem("reviewsData"));

if (reviewsCollection && reviewsCollection.length > 0) {
	const moreLink = document.getElementById("more");
	moreLink.style.display = "block";
	const reviewsLink = document.getElementById("reviews");
	reviewsLink.style.display = "block";
	const reviewsLink2 = document.getElementById("reviews2");
	reviewsLink2.style.display = "block";
}
const foundersData = JSON.parse(sessionStorage.getItem("foundersData"));

if (foundersData && foundersData.length > 0) {
	const foundersLink = document.getElementById("founders");
	foundersLink.style.display = "block";
	const foundersLink2 = document.getElementById("founders2");
	foundersLink2.style.display = "block";
} else {
	console.log("No valid founders data found in session storage");
}

const careersData = JSON.parse(sessionStorage.getItem("careersData"));

if (careersData && careersData.length > 0) {
	const moreLink = document.getElementById("more");
	moreLink.style.display = "block";
	const careersLink = document.getElementById("careers");
	careersLink.style.display = "block";
	const careersLink2 = document.getElementById("careers2");
	careersLink2.style.display = "block";
} else {
	console.log("No valid careers data found in session storage");
}

const clientCollection = JSON.parse(sessionStorage.getItem("clientsData"));

if (clientCollection && clientCollection.length > 0) {
	const clientsLink = document.getElementById("clients");
	clientsLink.style.display = "block";
	const clientsLink2 = document.getElementById("clients2");
	clientsLink2.style.display = "block";
} else {
	console.log("No valid clients data found in session storage");
}

function getHomepageDataFromSessionStorage() {
	const homepageData = sessionStorage.getItem("homepageData");
	return JSON.parse(homepageData);
}

const navbar = document.querySelector(".navbar");

async function applyFontFamilyAndLogoToNavbar() {
	try {
		const homepageData = getHomepageDataFromSessionStorage();

		if (homepageData) {
			const font = homepageData.font;
			const fontSize = homepageData.fontSize;
			if (homepageData && homepageData.logoimageurl) {
				const logoImage = document.getElementById("logoimage");
				if (logoImage) {
					logoImage.src = homepageData.logoimageurl;
				}
			}
			const webAppName = document.getElementById("webAppName");
			if (webAppName) {
				webAppName.textContent = homepageData.webAppName;
			}
			const footerMessage = document.getElementById("footerMessage");

			var element = document.querySelector(".bg-header");
			//console.log(element);
			const homepageImageUrl = homepageData.homePageimageurl;
			if (homepageImageUrl && element) {
				element.style.background = `linear-gradient(rgba(9, 30, 62, 0.7), rgba(9, 30, 62, 0.7)), url('${homepageImageUrl}') center center no-repeat`;
				element.style.backgroundSize = "cover";
				//console.log(homepageImageUrl);
			}

			if (homepageData && homepageData.footerMessage !== undefined) {
				footerMessage.textContent = homepageData.footerMessage;
			}
			if (font) {
				navbar.style.fontFamily = font;
				document.body.style.fontFamily = font;
				if (fontSize) {
					navbar.style.fontSize = fontSize;
				}
				//console.log(footerMessage);
				if (footerMessage) {
					footerMessage.style.fontFamily = font;
					if (fontSize) {
						footerMessage.style.fontSize = fontSize;
					}
				}

				console.log(fontSize);
				console.log(font);
			}
		}
	} catch (error) {
		console.error("Error getting font family from the session storage:", error);
	}
}

function displaySocialIcons(data) {
	const connectWithUsBanner = document.getElementById("connectWithUsBanner");
	connectWithUsBanner.innerHTML = "";
	if (
		data &&
		(data.hasOwnProperty("facebook") ||
			data.hasOwnProperty("instagram") ||
			data.hasOwnProperty("youtube") ||
			data.hasOwnProperty("twitter"))
	) {
		connectWithUsBanner.style.display = "flex";

		if (data.facebook && data.facebook !== null) {
			const facebookIcon = createSocialIcon(
				"facebook",
				data.facebook,
				"fab fa-facebook-f"
			);
			connectWithUsBanner.appendChild(facebookIcon);
		}
		if (data.instagram && data.instagram !== null) {
			const instagramIcon = createSocialIcon(
				"instagram",
				data.instagram,
				"fab fa-instagram"
			);
			connectWithUsBanner.appendChild(instagramIcon);
		}
		if (data.youtube && data.youtube !== null) {
			const youtubeIcon = createSocialIcon(
				"youtube",
				data.youtube,
				"fab fa-youtube"
			);
			connectWithUsBanner.appendChild(youtubeIcon);
		}
		if (data.twitter && data.twitter !== null) {
			const twitterIcon = createSocialIcon(
				"twitter",
				data.twitter,
				"fab fa-twitter"
			);
			connectWithUsBanner.appendChild(twitterIcon);
		}
	}
}
function createSocialIcon(platform, url, iconClass) {
	const icon = document.createElement("a");
	icon.className = "btn btn-primary btn-square me-2";
	icon.href = url;
	icon.target = "_blank";
	const iconImage = document.createElement("i");
	iconImage.className = iconClass + " fw-normal";
	icon.appendChild(iconImage);
	return icon;
}

const data = JSON.parse(sessionStorage.getItem("contactAndPaymentData"));
if (data && Object.keys(data).length > 0) {
	if (
		data &&
		(data.facebook || data.instagram || data.youtube || data.twitter)
	) {
		displaySocialIcons(data);
	}
	const locationData = document.querySelector(
		".location-section .contact-data"
	);
	if (data && data.location) {
		locationData.textContent = data.location;
	}

	// Update email data
	const emailData = document.querySelector(".email-section .contact-data");
	if (data && data.email) {
		emailData.textContent = data.email;
	}

	// const phoneData = document.querySelector(
	// 	".phone-section .contact-data"
	// );
	const phoneData2 = document.querySelector(".phone-section2 .contact-data2");
	if (data && data.mobile) {
		//phoneData.textContent = data.mobile;
		const formattedMobile = `+91 ${data.mobile.substring(
			0,
			5
		)} ${data.mobile.substring(5)}`;
		phoneData2.textContent = formattedMobile;
	}
} else {
	console.log("No payment data found in session storage.");
}

const vendorCarousel = document.querySelector(".vendor-carousel");

function populateClientTable() {
	if (vendorCarousel) {
		vendorCarousel.innerHTML = "";

		const clientsData = JSON.parse(sessionStorage.getItem("clientsData"));
		if (clientsData) {
			clientsData.forEach((client) => {
				const clientContainer = document.createElement("div");
				clientContainer.classList.add("client-container");

				const imgElement = document.createElement("img");
				imgElement.src = client.picUrl;
				imgElement.alt = client.name;
				// imgElement.style.display = "block";
				// imgElement.style.margin = "0 auto";
				// imgElement.style.width = "80px";
				// imgElement.style.height = "80px";
				// imgElement.style.borderRadius = "50%";
				// imgElement.style.marginBottom = "10px";
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

			$(".vendor-carousel").owlCarousel({
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
	} else {
		console.log("No vendor carousel");
	}
}

applyFontFamilyAndLogoToNavbar();

document.addEventListener("DOMContentLoaded", function () {
	populateClientTable();
});
