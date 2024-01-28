import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import {
    getDownloadURL,
    listAll,
    ref,
    uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { firestore, storage } from "./firebase-config.js";

const totfdCollection = collection(firestore, "totfd");
const contactAndPaymentsDocRef = doc(totfdCollection, "ContactAndPayments");
const homepageDocRef = doc(totfdCollection, "Homepage");
const productsAndServicesDocRef = doc(totfdCollection, "ProductsAndServices");

const freeQuoteButtons = document.querySelectorAll(".free-quote-button");

freeQuoteButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        const targetElement = document.getElementById("serviceContainer2");
        targetElement.scrollIntoView({
            behavior: "smooth",
        });
    });
});

function getHomePageDataFromFirestoreAndSave() {
    getDoc(homepageDocRef)
        .then((docSnapshot) => {
            if (docSnapshot.exists()) {
                const homepageData = docSnapshot.data();
                if (homepageData) {
                    const navbar = document.querySelector(".navbar");
                    const font = homepageData.font;
                    const fontSize = homepageData.fontSize;
                    if (font) {
                        navbar.style.fontFamily = font;
                        document.body.style.fontFamily = font;
                        if (fontSize) {
                            navbar.style.fontSize = fontSize;
                        }
                    }
                    const aboutUsImage = document.getElementById("aboutUsImage");
                    const aboutUsPageImageUrl = homepageData.aboutUsPageimageurl;

                    if (aboutUsPageImageUrl) {
                        aboutUsImage.src = aboutUsPageImageUrl;
                    } else {
                        aboutUsImage.style.display = "none";
                    }
                    //console.log("Homepage data found in session storage");

                    document.getElementById("logoimage").src = homepageData.logoimageurl;
                    document.getElementById("footerlogoimage").src = homepageData.footerlogoimageurl;

                    // const webAppName = document.getElementById("webAppName");
                    // if (webAppName) {
                    //     webAppName.textContent = homepageData.webAppName;
                    // }

                    const webAppName1 = document.getElementById("webAppName1");
                    //webAppName1.textContent = homepageData.webAppName;

                    const webAppName2 = document.getElementById("webAppName2");
                   // webAppName2.textContent = homepageData.webAppName;

                    // const captionSpan = document.getElementById("caption");
                    // captionSpan.textContent = homepageData.webAppName;

                    const homePageCaption = document.getElementById("homePageCaption");
                    homePageCaption.textContent = homepageData.homePageCaption;

                    const homePageCaption2 = document.getElementById("homePageCaption2");
                    homePageCaption2.textContent = homepageData.homePageCaption2;

                    const homePageCaption3 = document.getElementById("homePageCaption3");
                    homePageCaption3.textContent = homepageData.homePageCaption3;

                    const homePageWelcome = document.getElementById("homePageWelcome");
                    homePageWelcome.textContent = homepageData.homePageWelcome;

                    const footerMessage = document.getElementById("footerMessage");
                    if (homepageData && homepageData.footerMessage !== undefined) {
                        footerMessage.textContent = homepageData.footerMessage;
                    } else {
                        footerMessage.textContent = null;
                    }
                    const homepageImageUrl1 = homepageData.homePageImageUrl1;
                    const homepageImageUrl2 = homepageData.homePageImageUrl2;
                    const homepageImageUrl3 = homepageData.homePageImageUrl3;
                    const homepageImageUrl4 = homepageData.homePageImageUrl4;

                    if (homepageImageUrl1 && homepageImageUrl2 && homepageImageUrl3 && homepageImageUrl4) {
                        document.getElementById("homePageImage").src = homepageImageUrl1;
                        document.getElementById("homePageImage2").src = homepageImageUrl2;
                        document.getElementById("homePageImage3").src = homepageImageUrl3;
                        document.getElementById("homePageImage4").src = homepageImageUrl4;
                    } else {
                        const commonImageUrl = homepageImageUrl1 || homepageImageUrl2;

                        if (commonImageUrl) {
                            document.getElementById("homePageImage").src = commonImageUrl;
                            document.getElementById("homePageImage2").src = commonImageUrl;
                        } else {
                            //console.log("No background image to set");
                        }
                    }
                    const aboutUsCaption = document.getElementById("aboutUsCaption");
                    aboutUsCaption.textContent = homepageData.aboutUsCaption;

                    const aboutUsHeader = document.getElementById("aboutUsHeader");
                    aboutUsHeader.textContent = homepageData.aboutUsHeader;

                    const aboutUsPoints = document.getElementById("aboutUsPoints");
                    homepageData.aboutUsPoints.forEach((point, index) => {
                        const col = document.createElement("div");
                        col.className = "col-sm-6 wow zoomIn";
                        col.setAttribute("data-wow-delay", 0.2 * (index + 1) + "s");

                        const pointElement = document.createElement("h5");
                        pointElement.className = "mb-3";
                        ////console.log(pointElement);
                        addIconToElement(pointElement)
                            .then((message) => {
                                ////console.log(message);
                                ////console.log(pointElement); // Check if the icon is present in the pointElement
                            })
                            .catch((error) => {
                                //console.error(error);
                            });
                        pointElement.textContent = point;
                        col.appendChild(pointElement);
                        aboutUsPoints.appendChild(col);
                    });
                    if (homepageData.showWhyUsSection) {
                        document.getElementById("whyUsCaption").innerHTML =
                            homepageData.whyUScaption;
                        for (let i = 1; i <= 4; i++) {
                            document.getElementById(`whyUsTitle${i}`).innerHTML =
                                homepageData[`whyUsTitle${i}`];
                            //console.log(homepageData[`whyUsTitle${i}`]);
                            document.getElementById(`whyUsDescription${i}`).innerHTML =
                                homepageData[`whyUsDescription${i}`];
                        }
                        document.getElementById("whyUsimageUrl").src =
                            homepageData.whyUsimageUrl;
                        document.getElementById("whyUsSection").style.display = "block";
                    }
                    sessionStorage.setItem("homepageData", JSON.stringify(homepageData));
                }

                //console.log(homepageData);


            } else {
                //console.log("Homepage document does not exist.");
            }
        })
        .catch((error) => {
            //console.error("Error fetching Homepage document:", error);
        });
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

async function servicesAndProducts() {
    try {
        const homePageDataSnapshot = await getDoc(homepageDocRef);
        const homePageData = homePageDataSnapshot.data();

        
        if (homePageData && homePageData.showServiceSection) {
            const docSnapshot = await getDoc(productsAndServicesDocRef);
            const productsAndServicesData = docSnapshot.data();

            if (
                docSnapshot.exists &&
                productsAndServicesData.servicesCaption &&
                homePageData.showServiceSection === true
            ) {
                sessionStorage.setItem(
                    "productsAndServicesData",
                    JSON.stringify(productsAndServicesData)
                );

                ////console.log(homePageData);
                const servicesLink = document.getElementById("services");
                servicesLink.style.display = "block";
                const servicesLink2 = document.getElementById("services2");
                servicesLink2.style.display = "block";

                const serviceContainer = document.getElementById("serviceContainer");
                serviceContainer.style.display = "block";
                const serviceContainer2 = document.getElementById("serviceContainer2");
                serviceContainer2.style.display = "block";

                const servicesTitle = document.getElementById("servicesTitle");
                servicesTitle.textContent = productsAndServicesData.servicesCaption;

                const servicesRow = document.getElementById("servicesRow");
                productsAndServicesData.services.forEach((service, index) => {
                    const serviceColumn = document.createElement("div");
                    serviceColumn.className = "col-lg-4 col-md-6 wow zoomIn";
                    serviceColumn.setAttribute("data-wow-delay", 0.3 * (index + 1) + "s");

                    const serviceItem = document.createElement("div");
                    serviceItem.className =
                        "service-item bg-light rounded d-flex flex-column align-items-center justify-content-center text-center";

                    const serviceIcon = document.createElement("div");
                    serviceIcon.className = "service-icon";
                    const icon = document.createElement("i");
                    icon.className = service.icon;
                    icon.classList.add("text-white");
                    icon.textContent = service.title.charAt(0);
                    icon.style.fontSize = "24px";
                    icon.style.fontWeight = "bold";
                    serviceIcon.appendChild(icon);

                    const serviceTitle = document.createElement("h4");
                    serviceTitle.className = "mb-3";
                    serviceTitle.textContent = service.title;

                    const serviceDescription = document.createElement("p");
                    serviceDescription.className = "m-0";
                    serviceDescription.textContent = service.description;

                    const serviceLink = document.createElement("a");
                    serviceLink.className = "btn btn-lg btn-primary rounded";
                    serviceLink.setAttribute("href", "./contact.html");
                    const linkIcon = document.createElement("i");
                    linkIcon.className = "bi bi-arrow-right";
                    serviceLink.appendChild(linkIcon);

                    serviceItem.appendChild(serviceIcon);
                    serviceItem.appendChild(serviceTitle);
                    serviceItem.appendChild(serviceDescription);
                    serviceItem.appendChild(serviceLink);

                    serviceColumn.appendChild(serviceItem);
                    servicesRow.appendChild(serviceColumn);
                });

                const servicesDropdown = document.getElementById("servicesDropdown");
                productsAndServicesData.services.forEach((service) => {
                    const option = document.createElement("option");
                    option.value = service.title;
                    option.text = service.title;
                    servicesDropdown.appendChild(option);
                });
            }

            if (
                docSnapshot.exists &&
                productsAndServicesData.productCaption &&
                homePageData.showProductSection === true
            ) {
                sessionStorage.setItem(
                    "productsAndServicesData",
                    JSON.stringify(productsAndServicesData)
                );
                
                const productsLink = document.getElementById("products");
                productsLink.style.display = "block";
                const productsLink2 = document.getElementById("products2");
                productsLink2.style.display = "block";
            }
        }
        if (homePageData && homePageData.showProductSection) {
            const docSnapshot = await getDoc(productsAndServicesDocRef);
            const productsAndServicesData = docSnapshot.data();
            //console.log(productsAndServicesData);

            if (
                docSnapshot.exists &&
                productsAndServicesData.procuctsCaption &&
                homePageData.showServiceSection === true
            ) {
                sessionStorage.setItem(
                    "productsAndServicesData",
                    JSON.stringify(productsAndServicesData)
                );
            }

            const productsCaption = document.getElementById("ourProductsCaption");
            productsCaption.textContent = productsAndServicesData.productCaption;

            const carouselContainer = document.getElementById("productCarousel");
            carouselContainer.innerHTML = "";

            

            // const productContainer = document.getElementById("productContainer");
            // productContainer.innerHTML = "";

            // productsAndServicesData.categories.forEach((category, categoryIndex) => {
            // category.products.forEach((product, productIndex) => {
            // const productCard = document.createElement("div");
            // productCard.classList.add("col-lg-4", "col-md-6", "wow", "zoomIn");
            // productCard.dataset.wowDelay = `${
            //     0.1 * (categoryIndex * category.products.length + productIndex + 1)
            // }s`;

            // const cardBody = document.createElement("div");
            // cardBody.classList.add(
            //     "product-item",
            //     "bg-light",
            //     "rounded",
            //     "d-flex",
            //     "flex-column",
            //     "align-items-center",
            //     "justify-content-center",
            //     "text-center"
            // );

            // const productImage = document.createElement("div");
            // productImage.style.width = "100%"; // Set the width of the image container
            // productImage.style.height = "300px"; // Set the height of the image container or adjust as needed
            // productImage.style.backgroundImage = `url("${product.imageUrl}")`;
            // productImage.style.backgroundSize = "cover";
            // productImage.style.backgroundPosition = "center";
            // productImage.style.backgroundRepeat = "no-repeat";

            // productCard.addEventListener("click", () => {
            //     window.location.href = "products.html"; // Replace with your actual page URL
            // });

            // cardBody.appendChild(productImage);

            // const productTitle = document.createElement("h4");
            // productTitle.classList.add("mb-3");
            // productTitle.textContent = product.title;

            // cardBody.appendChild(productTitle);

            // const productDescription = document.createElement("p");
            // productDescription.classList.add("m-0");
            // productDescription.textContent = product.description;

            // cardBody.appendChild(productDescription);


            // productCard.appendChild(cardBody);

            // productContainer.appendChild(productCard);
        };
    } catch (error) {
        //console.log("Error checking for service data:", error);
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
                "./img/Facebook_Logo.png"
            );
            connectWithUsBanner.appendChild(facebookIcon);
        }
        if (data.instagram && data.instagram !== null) {
            const instagramIcon = createSocialIcon(
                "instagram",
                data.instagram,
                "./img/instagram-logo.jpg"
            );
            connectWithUsBanner.appendChild(instagramIcon);
        }
        if (data.youtube && data.youtube !== null) {
            const youtubeIcon = createSocialIcon(
                "youtube",
                data.youtube,
                "./img/Youtube_logo.png"
            );
            connectWithUsBanner.appendChild(youtubeIcon);
        }
        if (data.twitter && data.twitter !== null) {
            const twitterIcon = createSocialIcon(
                "twitter",
                data.twitter,
                "./img/twitterlogo.webp"
            );
            connectWithUsBanner.appendChild(twitterIcon);
        }
    }
}
function createSocialIcon(platform, url,imgSrc) {
    const icon = document.createElement("a");
    icon.className = " btn btn-square btn me-2";
    icon.href = url;
    icon.target = "_blank";
    const iconImage = document.createElement("img");
    iconImage.src = imgSrc;
    iconImage.style.width="30px";
    iconImage.style.height = "30px";
    iconImage.style.borderRadius="8px"
    iconImage.style.objectFit="contain"
    // iconImage.className = imgSrc + " fw-normal";
    icon.appendChild(iconImage);
    return icon;
}
function getDataFromFirestoreAndSave() {
    const careersDocRef = doc(totfdCollection, "Careers");

    getDoc(contactAndPaymentsDocRef)
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (
                    data &&
                    (data.facebook || data.instagram || data.youtube || data.twitter)
                ) {
                    displaySocialIcons(data);
                }
                sessionStorage.setItem("contactAndPaymentData", JSON.stringify(data));
                const locationData = document.querySelector(
                    ".location-section .contact-data"
                );
                if (data && data.location) {
                    locationData.textContent = data.location;
                }

                // Update email data
                const emailData = document.querySelector(
                    ".email-section .contact-data"
                );
                if (data && data.email) {
                    emailData.textContent = data.email;
                }

                const phoneData = document.querySelector(
                    ".phone-section .contact-data"
                );
                const phoneData2 = document.querySelector(
                    ".phone-section2 .contact-data2"
                );
                if (data && data.mobile) {
                    const formattedMobile = `+91 ${data.mobile.substring(
                        0,
                        5
                    )} ${data.mobile.substring(5)}`;
                    phoneData.textContent = formattedMobile;
                    phoneData2.textContent = formattedMobile;
                }

                if (data && data.imageUrl) {
                    ////console.log(data.imageUrl);
                    const paymentsLink = document.getElementById("payments");
                    paymentsLink.style.display = "block";
                    const paymentsLink2 = document.getElementById("payments2");
                    paymentsLink2.style.display = "block";
                }
            }
        })
        .catch((error) => {
            //console.error("Error getting document:", error);
        });

    getDoc(careersDocRef)
        .then((docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const careersData = data.jobs || [];
                ////console.log(data);
                const displayedCareers = careersData.filter(
                    (career) => career.displayed === true
                );
                if (Array.isArray(displayedCareers) && displayedCareers.length > 0) {
                    const moreLink = document.getElementById("more");
                    moreLink.style.display = "block";
                    const careersLink = document.getElementById("careers");
                    careersLink.style.display = "block";
                    const careersLink2 = document.getElementById("careers2");
                    careersLink2.style.display = "block";
                    sessionStorage.setItem(
                        "careersData",
                        JSON.stringify(displayedCareers)
                    );
                }
            }
        })
        .catch((error) => {
            //console.log("Error checking for careers:", error);
        });

    const storageRef = ref(storage, "totfd/gallery-images");

    listAll(storageRef)
        .then((res) => {
            const hasGallery = res.items.length > 0;
            sessionStorage.setItem("hasGallery", hasGallery);
            if (res.items.length > 0) {
                const moreLink = document.getElementById("more");
                moreLink.style.display = "block";
                const galleryLink = document.getElementById("gallery");
                const galleryLink2 = document.getElementById("gallery2");
                galleryLink.style.display = "block";
                galleryLink2.style.display = "block";
            }
        })
        .catch((error) => {
            //console.log("Error checking for files:", error);
            0;
        });
    //console.log("session storage loaded");
}

const sessionStorageSize = JSON.stringify(sessionStorage).length;
//console.log("Session storage size:", sessionStorageSize, "bytes");

document.addEventListener("DOMContentLoaded", function () {
    const testimonialCarousel = document.querySelector(".testimonial-carousel");
    const moreLink = document.getElementById("more");
    const reviewSection = document.getElementById("reviewSection");
    const reviewsLink = document.getElementById("reviews");
    const reviewsLink2 = document.getElementById("reviews2");
    const reviewDocRef = doc(totfdCollection, "Reviews");

    const clientsDocRef = doc(totfdCollection, "Clients");

    ////console.log("Fetching document...");
    getDoc(reviewDocRef)
        .then((docSnapshot) => {
            ////console.log("Document snapshot received:", docSnapshot);
            if (docSnapshot.exists) {
                const data = docSnapshot.data();
                const reviewsData = data.reviews || [];

                if (Array.isArray(reviewsData) && reviewsData.length > 0) {
                    ////console.log("Reviews data found:", reviewsData);
                    moreLink.style.display = "block";
                    reviewsLink.style.display = "block";
                    reviewsLink2.style.display = "block";
                    reviewSection.style.display = "block";

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
                        //console.log("Added testimonial:", review.name);
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
                                items: 4,
                            },
                        },
                    });

                    sessionStorage.setItem("reviewsData", JSON.stringify(reviewsData));
                    //console.log("Reviews data stored in sessionStorage.");
                }
            } else {
                //console.log("Document does not exist.");
            }
        })
        .catch((error) => {
            //console.log("Error checking for reviews:", error);
        });

    const teamContainer = document.getElementById("teamContainer");
    const foundersDocRef = doc(totfdCollection, "Founders");

    getDoc(foundersDocRef)
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                const data = docSnapshot.data();
                const foundersData = data.founders || [];

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
                        teamImg.classList.add(
                            "team-img",
                            "position-relative",
                            "overflow-hidden"
                        );

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
                }
            }
        })
        .catch((error) => {
            //console.log("Error checking for founders:", error);
        });

    getDoc(clientsDocRef)
        .then((docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const clientsData = data.clients || [];
                //console.log(data.clients);
                if (Array.isArray(clientsData) && clientsData.length > 0) {
                    const clientsLink = document.getElementById("clients");
                    clientsLink.style.display = "block";
                    const clientsLink2 = document.getElementById("clients2");
                    clientsLink2.style.display = "block";
                    const vendorSection = document.getElementById("vendorSection");
                    vendorSection.style.display = "block";

                    const clientsArray = [];

                    clientsData.forEach((client) => {
                        clientsArray.push(client);
                    });
                    sessionStorage.setItem("clientsData", JSON.stringify(clientsArray));
                }
            }
        })
        .catch((error) => {
            //console.error("Error checking for clients:", error);
        });
});

function populateProductCategoryTable() {
    const categoryProducts = document.querySelector(".category-products");
    categoryProducts.innerHTML = "";

    getDoc(productsAndServicesDocRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
            const productAndServiceData = docSnapshot.data();
            const categories = productAndServiceData.categories;

            if (categories) {
                categories.forEach((category, index) => {
                    const categoryContainer = createCategoryContainer(category, index);
                    categoryProducts.appendChild(categoryContainer);
                });

                const owlCarousel = $(".category-products").owlCarousel({
                    loop: true,
                    margin: 1,
                    dots: false,
                    autoplay: true,
                    smartSpeed: 1000,
                    responsive: {
                        0: { items: 1 },
                        576: { items: 2 },
                        768: { items: 2 },
                        800: { items: 2 },
                        992: { items: 4 },
                        // 1024:{item : 3}
                    },
                    onInitialized: stopAutoplayOnHover,
                    onDragged: restartAutoplayOnRelease,
                });

                function stopAutoplayOnHover() {
                    $(".owl-item").hover(
                        function () {
                            owlCarousel.trigger("stop.owl.autoplay");
                        },
                        function () {
                            owlCarousel.trigger("play.owl.autoplay");
                        }
                    );
                }

                function restartAutoplayOnRelease() {
                    owlCarousel.trigger("play.owl.autoplay");
                }
            } else {
                //console.log("No data in Firestore");
            }
        }
    });
}

function createCategoryContainer(category, index) {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("card","m-2", "mb-4", "text-center", "d-flex", "flex-column");

    // Define bottom gradient colors for each card based on index
    const bottomGradientColors = ["#ffb6c1", "#aed9e0", "#c0e8a9"];

    const gradientColor = bottomGradientColors[index % bottomGradientColors.length];

    categoryContainer.style.background = `linear-gradient(180deg, white, ${gradientColor})`;

    const innerContent = `
        <a href="products.html" class="text-decoration-none text-dark m-1 product-link">
            <div class="card-body d-flex flex-column align-items-center justify-content-center custom-card ">
                <div class="topbox">
                    <img class="" src="${category.image}" alt="Card image cap">
                </div>
                <div class="bottombox text-white font-weight-bold mt-3">
                    <h1 class="h5">${category.name}</h1>
                    <h6 class="small">${category.description}</h6>
                </div>
            </div>
        </a>
    `;

    categoryContainer.innerHTML = innerContent;
    return categoryContainer;
}





// function createCategoryContainer(category) {
//     const categoryContainer = document.createElement("div");
//     categoryContainer.classList.add("card", "card-body", "col-lg-4", "col-md-6", "col-sm-12", "mb-3", "border-1", "d-flex", "justify-content-center", "align-items-center");

//     // Use a default gradient color if not present in the category data
//     const defaultGradientColor = ["#ffffff", "#cccccc", "#999999"];
//     const gradientColor = category.gradientColor || defaultGradientColor;

//     categoryContainer.style.background = `linear-gradient(180deg,${gradientColor[0]},${gradientColor[1]},${gradientColor[2]})`;

//     const innerContent = `
//         <a href="products.html">
//             <div class="box d-flex flex-column align-items-center mt-auto">
//                 <div class="topbox">
//                     <img class="img-fluid" src="${category.image}" alt="Card image cap">
//                 </div>
//                 <div class="bottombox text-white font-weight-bold text-center img-fluid" style="white-space: nowrap;">
//                     <h1>${category.name}</h1>
//                     <h6>${category.description}</h6>
//                 </div>
//             </div>
//         </a>
//     `;

//     categoryContainer.innerHTML = innerContent;
//     return categoryContainer;
// }

// function createCategoryContainer(category) {
//     const categoryContainer = document.createElement("div");
//     categoryContainer.classList.add("card", "mb-4", "text-center");

//     // Use a default gradient color if not present in the category data
//     const defaultGradientColor = ["#ffffff", "#cccccc", "#999999"];
//     const gradientColor = category.gradientColor || defaultGradientColor;

//     categoryContainer.style.background = `linear-gradient(180deg,white,${
//         category.gradientColor || "#f497ec,#f481ea"
//       })`;
//     const innerContent = `
//         <a href="products.html" class="text-decoration-none text-dark  product-link">
//             <div class="card-body d-flex flex-column align-items-center justify-content-center custom-card">
//                 <div class="topbox">
//                     <img class="" src="${category.image}" alt="Card image cap">
//                 </div>
//                 <div class="bottombox text-white font-weight-bold mt-3">
//                     <h1 class="h5">${category.name}</h1>
//                     <h6 class="small">${category.description}</h6>
//                 </div>
//             </div>
//         </a>
//     `;

//     categoryContainer.innerHTML = innerContent;
//     return categoryContainer;
// }



// function populateProductCategoryTable() {
//     const categoryProducts = document.querySelector(".category-products");
// 	categoryProducts.innerHTML = "";

//     getDoc(productsAndServicesDocRef)
//     .then((docSnapshot) => {
//         if (docSnapshot.exists()) {
//             const productAndServiceData = docSnapshot.data();
//            const categories = productAndServiceData.categories;

//             if (categories) {
//                 categories.forEach((category) => {
//                     const categoryContainer = document.createElement("div");
//                     //categoryContainer.classList.add("testimonial-item", "bg-light");
//                     //console.log(category.image)


//                     const innerContent = `
//                     <div class = "card card-body col-lg-4 col-md-6 col-sm-12 mb-3 border-1 d-flex justify-content-center align-items-center"  style="background: linear-gradient(180deg,white,#7c7a7a,#585757);">
//                     <a href = "products.html">
//                     <div class="box d-flex flex-column align-items-center mt-auto">
//                     <div class="topbox">
//                     <img class="img-fluid" src="${category.image}"  alt="Card image cap">
//                   </div>
//                   <div class="bottombox text-white font-weight-bold text-center img-fluid"
//                   style="white-space: nowrap;">
//                   <h1>${category.name}</h1>
//                   <h6>${category.description}</h6>
//                 </div>
//                 </div>
//                     </a>
//                     </div>
//                     `;
        
//             //         const innerContent = `
//             // <div class="d-flex flex-column align-items-center border-bottom pt-5 pb-4 px-5">
//             //         <div>
//             //             <img class="img-fluid rounded" src="${category.image}" style="max-width: 100%; height: auto; max-height: 50vh;" />
//             //         </div>
//             //         <div class="ps-4 mt-3">
//             //             <h5 class="text-primary mb-1">${category.name}</h5>
//             //             <p>${category.description}</p>
//             //         </div>
//             //     </div>
//             // `;
//             categoryContainer.innerHTML = innerContent;
//             categoryProducts.appendChild(categoryContainer);
//                 });
        
//                 $(".category-products").owlCarousel({
//                     loop: true,
//                     margin: 1,
//                     dots: false,
//                     loop: true,
//                     autoplay: true,
//                     smartSpeed: 1000,
//                     responsive: {
//                         0: {
//                             items: 1,
//                             margin: 5, // Adjust margin for smaller screens if needed
//                         },
//                         576: {
//                             items: 3,
//                             margin: 10, // Adjust margin for medium screens if needed
//                         },
//                         768: {
//                             items: 3,
//                             margin: 15, // Adjust margin for larger screens if needed
//                         },
//                         992: {
//                             items: 3,
//                             margin: 20,
//                         },
//                     },
//                 });
//             } else {
//                 //console.log("No data in session storage");
//             }


//         }

        
//     });
	
// }


document.addEventListener("DOMContentLoaded", function () {
    showSpinner();
    getHomePageDataFromFirestoreAndSave();
    getDataFromFirestoreAndSave();
    populateProductCategoryTable();
    servicesAndProducts();
    displayVideoOnHomepage();
    setTimeout(function () {
        hideSpinner();
    }, 2000);
});

var showSpinner = function () {
    $("#spinner").addClass("show");
};

var hideSpinner = function () {
    if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
    }
};

document
    .getElementById("submitButton")
    .addEventListener("click", async function (event) {
        event.stopPropagation();
        event.preventDefault();

        const name = document.querySelector('input[placeholder="Your Name"]').value;
        const email = document.querySelector(
            'input[placeholder="Your Email"]'
        ).value;
        const mobile = document.querySelector(
            'input[placeholder="Your Mobile Number"]'
        ).value;
        const service = document.getElementById("servicesDropdown").value || null;
        const message =
            document.querySelector('textarea[placeholder="Message"]').value || null;
        const timestamp = serverTimestamp(firestore);

        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const mobileError = document.getElementById("mobileError");

        let isValid = true;

        if (!name) {
            nameError.style.display = "block";
            isValid = false;
        } else {
            nameError.style.display = "none";
        }

        if ((!email && !mobile) || (email && !validateEmail(email))) {
            emailError.style.display = "block";
            isValid = false;
        } else {
            emailError.style.display = "none";
        }

        if ((!email && !mobile) || (mobile && !validateMobile(mobile))) {
            mobileError.style.display = "block";
            isValid = false;
        } else {
            mobileError.style.display = "none";
        }

        if (isValid) {
            const totfd = collection(firestore, "totfd");
            const totfdDocRef = doc(totfd, "totfdDoc");
            const leadsCollection = collection(totfdDocRef, "leadsData");

            const formData = {
                timestamp: timestamp,
                name: name,
                email: email,
                mobile: mobile,
                subject: service,
                comments: message,
                status: "New",
            };

            addDoc(leadsCollection, formData)
                .then((docRef) => {
                    //console.log("Document written with ID: ", docRef.id);
                    successMessage.style.display = "block";
                    document.getElementById("serviceForm").reset();
                    setTimeout(() => {
                        successMessage.style.display = "none";
                    }, 3000);
                })
                .catch((error) => {
                    //console.error("Error adding document: ", error);
                });
            const referenceImage = document.getElementById("referenceImageInput");
            var imageUrls = "";
            if (referenceImage.files.length > 0) {
                imageUrls = await saveImagesToFirebase(referenceImage.files);
            }
            emailjs.init("vb9KEKs3BpHBPC0_H");
            const templateParams = {
                from_name: name,
                from_email: email || "Not Provided",
                mobile_number: mobile || "Not Provided",
                subject: service,
                message: message,
                referenceImage: imageUrls.join(" ; "),
            };
            emailjs
                .send("service_reh310e", "template_0lqohuh", templateParams)
                .then(function (response) {
                    //console.log("Email sent:", response);
                })
                .catch(function (error) {
                    //console.error("Email sending failed:", error);
                });
        }
    });

async function saveImagesToFirebase(files) {
    const imageUrls = [];
    const filesArray = Array.from(files); // Convert FileList to an array
    // //console.log(filesArray.length);

    for (const imageFile of filesArray) {
        const uniqueId = Date.now(); // Use a timestamp as a unique identifier
        const imageName = `clientImages2/${uniqueId}_${imageFile.name}`;
        const storageRef = ref(storage, imageName);

        await uploadBytesResumable(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        // //console.log(imageUrl, storageRef);
        imageUrls.push(imageUrl);
    }

    // //console.log(imageUrls);
    return imageUrls;
}

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function validateMobile(mobile) {
    const re = /^\d{10}$/;
    return re.test(mobile);
}

// function fetchProductsDataFromLocalStorage() {
//   const productsData = JSON.parse(sessionStorage.getItem("productsAndServicesData"));
//   return productsData;
// }

// // Function to create product cards
// function createProductCard(product) {
//   const productCard = document.createElement("div");
//   productCard.classList.add("col-lg-4", "col-md-6", "wow", "zoomIn");

//   // Sample card structure with image, title, description, button
//   const cardContent = `
//     <div class="card">
//       <img src="${product.imageUrl}" class="card-img-top" alt="${product.title}">
//       <div class="card-body">
//         <h5 class="card-title">${product.title}</h5>
       
//         <button class="btn btn-primary">Buy</button>
//       </div>
//     </div>
//   `;
//   productCard.innerHTML = cardContent;

//   return productCard;
// }

// // Function to populate products on the main page
// function populateProductsContainer(productsData) {
//   const productContainer = document.getElementById("productContainer");

//   if (!productsData || !productsData.categories) {
//     //console.log("No product data available.");
//     return;
//   }

//   productContainer.innerHTML = "";

//   productsData.categories.forEach((category) => {
//     category.products.forEach((product) => {
//       const productCard = createProductCard(product);
//       productContainer.appendChild(productCard);
//     });
//   });
// }

// // Event listeners for form submission, category filtering, etc. (as in your code)
// document.addEventListener("DOMContentLoaded", () => {
//   const productsData = fetchProductsDataFromLocalStorage();
//   populateProductsContainer(productsData);
//   // Additional function calls for categories, form submissions, etc.
// });
// function fetchProductsDataFromLocalStorage() {
//  const productsData = JSON.parse(
//      sessionStorage.getItem("productsAndServicesData")
//  );
//  return productsData;
// }

// async function populateProductsContainer(productsData) {
//  //console.log(productsData);
//  if (!productsData || !productsData.categories) {
//      //console.log("No product data available.");
//      return;
//  }

//  const productsCaption = document.getElementById("ourProductsCaption");
//  productsCaption.textContent = productsData.productCaption;

//  const productContainer = document.getElementById("productContainer");
//  productContainer.innerHTML = "";

//  productsData.categories.forEach((category, categoryIndex) => {
//      category.products.forEach((product, productIndex) => {
//          const productCard = document.createElement("div");
//          productCard.classList.add("col-lg-4", "col-md-6", "wow", "zoomIn");
//          productCard.dataset.wowDelay = `${
//              0.3 * (categoryIndex * category.products.length + productIndex + 1)
//          }s`;

//          const cardBody = document.createElement("div");
//          cardBody.classList.add(
//              "product-item",
//              "bg-light",
//              "rounded",
//              "d-flex",
//              "flex-column",
//              "align-items-center",
//              "justify-content-center",
//              "text-center"
//          );

//          const productImage = document.createElement("div");
// productImage.style.width = "100%"; // Set the width of the image container
// productImage.style.height = "200px"; // Set the height of the image container or adjust as needed
// productImage.style.backgroundImage = `url("${product.imageUrl}")`;
// productImage.style.backgroundSize = "cover";
// productImage.style.backgroundPosition = "center";
// productImage.style.backgroundRepeat = "no-repeat";

//          productCard.addEventListener("click", () => {
//                 window.location.href = "products.html"; // Replace with your actual page URL
//             });

//          cardBody.appendChild(productImage);

//          const productTitle = document.createElement("h4");
//          productTitle.classList.add("mb-3");
//          productTitle.textContent = product.title;

//          cardBody.appendChild(productTitle);

//          const productDescription = document.createElement("p");
//          productDescription.classList.add("m-0");
//          productDescription.textContent = product.description;

//          cardBody.appendChild(productDescription);


//          productCard.appendChild(cardBody);

//          productContainer.appendChild(productCard);
//      });
//  });
// }

// function populateCategories(productsData) {
//  const categoryContainer = document.getElementById("categoryContainer");

//  categoryContainer.innerHTML = "";

//  const allProductsItem = document.createElement("div");
//  allProductsItem.classList.add("btn", "btn-secondary", "btn-sm", "m-2");
//  allProductsItem.textContent = "All Products";
//  allProductsItem.addEventListener("click", () => {
//      populateProductsContainer(productsData);
//  });
//  categoryContainer.appendChild(allProductsItem);

//  productsData.categories.forEach((category) => {
//      const categoryItem = document.createElement("button");
//      categoryItem.classList.add("btn", "btn-secondary", "btn-sm", "m-2");
//      categoryItem.textContent = category.name;
//      categoryItem.addEventListener("click", () => {
//          const categoryData = getCategoryDataByName(productsData, category.name);
//          populateProductsContainer(categoryData);
//          //console.log(categoryData);
//      });
//      categoryContainer.appendChild(categoryItem);
//  });
// }

// function getCategoryDataByName(productsData, categoryName) {
//  const filteredCategories = productsData.categories.filter(
//      (category) => category.name === categoryName
//  );

//  if (filteredCategories.length === 0) {
//      //console.log(`No category found with the name ${categoryName}.`);
//      return null;
//  }

//  const filteredCategory = JSON.parse(JSON.stringify(filteredCategories[0]));
//  filteredCategory.productCaption = `${categoryName}`;

//  // Remove other categories from the filtered category
//  filteredCategory.categories = [filteredCategory];

//  return filteredCategory;
// }
// document.addEventListener("DOMContentLoaded", () => {
//  const productsData = fetchProductsDataFromLocalStorage();
//  populateProductsContainer(productsData);
    
// });
// vedios uploading-----------------------------
async function displayVideoOnHomepage() {
    try {
        const docSnapshot = await getDoc(homepageDocRef);
        if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const videoUrl1 = data.videoUrl1;
            const videoUrl2 = data.videoUrl2;

            // Display the videos on the homepage
            displayVideo(videoUrl1, 'videoPlayer1');
            displayVideo(videoUrl2, 'videoPlayer2');
        } else {
            //console.log("Homepage document does not exist.");
        }
    } catch (error) {
        //console.error("Error fetching video URLs from Firestore:", error);
    }
}

function displayVideo(url, videoPlayerId) {
    var videoPlayer = document.getElementById(videoPlayerId);
    // var playButton = document.getElementById(playButtonId);

    videoPlayer.src = url;
    videoPlayer.load();

    // Add event listener to play button
    // playButton.addEventListener('click', function () {
    //     videoPlayer.play();
    // });
}