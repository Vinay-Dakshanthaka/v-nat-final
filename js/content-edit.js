import {
	arrayRemove,
	collection,
	doc,
	getDoc,
	updateDoc,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import {
	getDownloadURL,
	ref,
	uploadBytes,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";
import { firestore, storage } from "../js/firebase-config.js";

const totfdCollection = collection(firestore, "totfd");
const homepageDocRef = doc(totfdCollection, "Homepage");
const productsAndServicesDocRef = doc(totfdCollection, "ProductsAndServices");

const messageElement = document.getElementById("message");

const websiteContentForm = document.getElementById("website-content-form");
//const webAppNameInput = document.getElementById("webAppName1");
const homePageWelcomeInput = document.getElementById("homePageWelcome");
const homePageCaptionInput = document.getElementById("homePageCaption");
const homePageCaptionInput2 = document.getElementById("homePageCaption2");
const homePageCaptionInput3 = document.getElementById("homePageCaption3");
const footerMessageInput = document.getElementById("footerMessageInput");
//const webAppNameError = document.getElementById("webAppName-error");
const homePageWelcomeError = document.getElementById("homePageWelcome-error");
const homePageCaptionError = document.getElementById("homePageCaption-error");
const homePageCaptionError2 = document.getElementById("homePageCaption2-error");
const homePageCaptionError3 = document.getElementById("homePageCaption3-error");
const footerMessageError = document.getElementById("footerMessage-error");

websiteContentForm.addEventListener("submit", (e) => {
	e.preventDefault(); // Prevent the form from submitting and reloading the page

	// Reset error messages
	//webAppNameError.style.display = "none";
	homePageWelcomeError.style.display = "none";
	homePageCaptionError.style.display = "none";
	homePageCaptionError2.style.display = "none";
	homePageCaptionError3.style.display = "none";
	footerMessageError.style.display = "none";

	// Capture user inputs
	//const webAppName = webAppNameInput.value;
	const homePageWelcome = homePageWelcomeInput.value;
	const homePageCaption = homePageCaptionInput.value;
	const homePageCaption2 = homePageCaptionInput2.value;
	const homePageCaption3= homePageCaptionInput3.value;
	const footerMessage = footerMessageInput.value;

	// Basic form validation
	let isValid = true;

	// if (!webAppName) {
	// 	webAppNameError.textContent = "Enter WebApp Name";
	// 	webAppNameError.style.display = "block";
	// 	isValid = false;
	// }

	if (!homePageWelcome) {
		homePageWelcomeError.textContent = "Enter Home Page Welcome";
		homePageWelcomeError.style.display = "block";
		isValid = false;
	}

	if (!homePageCaption) {
		homePageCaptionError.textContent = "Enter Home Page Caption";
		homePageCaptionError.style.display = "block";
		isValid = false;
	}

	if (!homePageCaption2) {
		homePageCaptionError.textContent = "Enter Home Page Caption";
		homePageCaptionError2.style.display = "block";
		isValid = false;
	}

	if (!homePageCaption3) {
		homePageCaptionError.textContent = "Enter Home Page Caption";
		homePageCaptionError3.style.display = "block";
		isValid = false;
	}
	if (!footerMessage) {
		footerMessageError.textContent = "Enter Footer Message";
		console.log("a");
		footerMessageError.style.display = "block";
		isValid = false;
	}

	if (!isValid) {
		return;
	}

	const newData = {
		//webAppName: webAppName,
		homePageWelcome: homePageWelcome,
		homePageCaption: homePageCaption,
		homePageCaption2: homePageCaption2,
		homePageCaption3: homePageCaption3,
		footerMessage: footerMessage,
	};
	updateDoc(homepageDocRef, newData)
		.then(() => {
			console.log("Data updated successfully!");
			messageElement.textContent =
				"Home Page Data updated successfully!Go to Home Page and Refresh to see the changes.";
			messageElement.style.color = "green";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		})
		.catch((error) => {
			console.error("Error updating data: ", error);
			messageElement.textContent = "Error updating data. Please try again.";
			messageElement.style.color = "red";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		});
});

const aboutUsCaptionInput = document.getElementById("aboutUsCaption");
const aboutUsHeaderInput = document.getElementById("aboutUsHeader");
const aboutUsFooterInput = document.getElementById("aboutUsFooter");
const aboutUsPointsContainer = document.getElementById("aboutUsPoints");
const addAboutUsPointButton = document.getElementById("addAboutUsPoint");

async function checkToggleData() {
	getDoc(homepageDocRef).then((docSnapshot) => {
		if (docSnapshot.exists && docSnapshot.data()) {
			const data = docSnapshot.data();
			const isAboutUsSectionVisible = data.showAboutUsSection || false;
			const isProductSectionVisible = data.showProductSection || false;
			const isServiceSectionVisible = data.showServiceSection || false;
			const isWhyUsSectionVisible = data.showWhyUsSection || false;

			document.getElementById("toggleAboutUs").checked =
				isAboutUsSectionVisible;
			document.getElementById("toggleWhyChooseUs").checked =
				isWhyUsSectionVisible;
			document.getElementById("toggleService").checked =
				isServiceSectionVisible;
			document.getElementById("toggleProduct").checked =
				isProductSectionVisible;

			toggleAboutUsFormVisibility(isAboutUsSectionVisible);
			toggleWhyUsFormVisibility(isWhyUsSectionVisible);
			toggleProductFormVisibility(isProductSectionVisible);
			toggleServiceFormVisibility(isServiceSectionVisible);
		}
	});
}

checkToggleData();

document
	.getElementById("toggleAboutUs")
	.addEventListener("change", function () {
		const form = document.getElementById("aboutus-content-form");
		const isVisible = this.checked;
		form.style.display = isVisible ? "block" : "none";

		updateDoc(homepageDocRef, {
			showAboutUsSection: isVisible,
		});
	});
document
	.getElementById("toggleWhyChooseUs")
	.addEventListener("change", function () {
		const form = document.getElementById("whychooseus-content-form");
		const isVisible = this.checked;
		form.style.display = isVisible ? "block" : "none";

		updateDoc(homepageDocRef, {
			showWhyUsSection: isVisible,
		});
		console.log("a");
	});

document
	.getElementById("toggleProduct")
	.addEventListener("change", function () {
		const form = document.getElementById("products-content-form");
		const isVisible = this.checked;
		form.style.display = isVisible ? "block" : "none";

		updateDoc(homepageDocRef, {
			showProductSection: isVisible,
		});
	});

document
	.getElementById("toggleService")
	.addEventListener("change", function () {
		const form = document.getElementById("service-content-form");
		const isVisible = this.checked;
		form.style.display = isVisible ? "block" : "none";

		updateDoc(homepageDocRef, {
			showServiceSection: isVisible,
		});
	});

function toggleAboutUsFormVisibility(isVisible) {
	const form = document.getElementById("aboutus-content-form");
	form.style.display = isVisible ? "block" : "none";
}
function toggleWhyUsFormVisibility(isVisible) {
	const form = document.getElementById("whychooseus-content-form");
	form.style.display = isVisible ? "block" : "none";
}
function toggleProductFormVisibility(isVisible) {
	const form = document.getElementById("products-content-form");
	form.style.display = isVisible ? "block" : "none";
}
function toggleServiceFormVisibility(isVisible) {
	const form = document.getElementById("service-content-form");
	form.style.display = isVisible ? "block" : "none";
}

toggleAboutUsFormVisibility();
toggleProductFormVisibility();
toggleServiceFormVisibility();

function saveAboutUsData() {
	const aboutUsData = collectFormData();

	updateDoc(homepageDocRef, aboutUsData)
		.then(() => {
			console.log("About Us data saved successfully!");
			console.log("Data updated successfully!");
			messageElement.textContent =
				"About Us Data updated successfully!Go to Home Page and Refresh to see the changes.";
			messageElement.style.color = "green";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		})
		.catch((error) => {
			console.error("Error saving data: ", error);
			messageElement.textContent = "Error updating data. Please try again.";
			messageElement.style.color = "red";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		});
}
function collectFormData() {
	const aboutUsData = {
		aboutUsCaption: aboutUsCaptionInput.value,
		aboutUsHeader: aboutUsHeaderInput.value,
		aboutUsFooter: aboutUsFooterInput.value,
		aboutUsPoints: [], // Initialize with an empty array
	};
	const pointInputs = aboutUsPointsContainer.querySelectorAll(
		".about-us-point input[type='text']"
	);
	pointInputs.forEach((pointInput) => {
		const pointValue = pointInput.value.trim();
		if (pointValue !== "") {
			aboutUsData.aboutUsPoints.push(pointValue);
		}
	});

	return aboutUsData;
}

const aboutUsForm = document.getElementById("aboutus-content-form");
aboutUsForm.addEventListener("submit", function (e) {
	e.preventDefault();
	saveAboutUsData();
});

function populateAboutUsForm(docSnapshot) {
	if (docSnapshot.exists()) {
		const aboutUsData = docSnapshot.data();
		aboutUsCaptionInput.value = aboutUsData.aboutUsCaption || "";
		aboutUsHeaderInput.value = aboutUsData.aboutUsHeader || "";
		aboutUsFooterInput.value = aboutUsData.aboutUsFooter || "";

		aboutUsData.aboutUsPoints.forEach((pointText) => {
			createPointDiv(pointText);
		});
	}
}
async function deletePointFromAboutUsDocRef(pointText) {
	try {
		const fieldValue = arrayRemove(pointText);
		await updateDoc(homepageDocRef, { aboutUsPoints: fieldValue });
		console.log("Point deleted from Firestore successfully!");
	} catch (error) {
		console.error("Error deleting point from Firestore: ", error);
	}
}

function createPointDiv(pointText) {
	const pointDiv = document.createElement("div");
	pointDiv.classList.add("about-us-point");
	pointDiv.innerHTML = `
    Point: <input type="text" class="form-control border border-primary" value="${pointText}" />
    <input type="button" class="btn btn-primary delete-point red-button" value="Delete" />`;

	const deleteButton = pointDiv.querySelector(".delete-point");
	deleteButton.addEventListener("click", async () => {
		const pointText = pointDiv.querySelector("input[type='text']").value.trim();
		await deletePointFromAboutUsDocRef(pointText);
		pointDiv.remove();
		messageElement.textContent =
			"About Us Point Deleted successfully!Go to Home Page and Refresh to see the changes.";
		messageElement.style.color = "green";
		0;
		messageElement.style.display = "block";
		window.scrollTo(0, 0);
		console.log("Point deleted from UI successfully!");
	});

	aboutUsPointsContainer.appendChild(pointDiv);
}

addAboutUsPointButton.addEventListener("click", () => {
	const newPointDiv = document.createElement("div");
	newPointDiv.classList.add("about-us-point");
	const pointInput = document.createElement("input");
	pointInput.type = "text";
	pointInput.classList.add("form-control", "border", "border-primary");
	const deleteButton = document.createElement("input");
	deleteButton.type = "button";
	deleteButton.classList.add("btn", "btn-primary", "delete-point");
	deleteButton.value = "Delete";

	deleteButton.addEventListener("click", async () => {
		const pointText = newPointDiv
			.querySelector("input[type='text']")
			.value.trim();
		await deletePointFromAboutUsDocRef(pointText);
		aboutUsPointsContainer.removeChild(newPointDiv);
	});

	newPointDiv.appendChild(document.createTextNode("Point: "));
	newPointDiv.appendChild(pointInput);
	newPointDiv.appendChild(deleteButton);

	aboutUsPointsContainer.appendChild(newPointDiv);
});

function populateWhyUsForm(docSnapshot) {
	const whyUsData = docSnapshot.data();
	document.getElementById("whyUsCaption").value = whyUsData.whyUScaption || "";
	for (let i = 1; i <= 4; i++) {
		document.getElementById(`whyUsTitle${i}`).value =
			whyUsData[`whyUsTitle${i}`] || "";
		document.getElementById(`whyUsDescription${i}`).value =
			whyUsData[`whyUsDescription${i}`] || "";
	}
}

document
	.getElementById("whychooseusSubmit")
	.addEventListener("click", async function (event) {
		event.preventDefault();
		const whyUsCaption = document.getElementById("whyUsCaption").value;
		const whyUsTitle1 = document.getElementById("whyUsTitle1").value;
		const whyUsDescription1 =
			document.getElementById("whyUsDescription1").value;
		const whyUsTitle2 = document.getElementById("whyUsTitle2").value;
		const whyUsDescription2 =
			document.getElementById("whyUsDescription2").value;
		const whyUsTitle3 = document.getElementById("whyUsTitle3").value;
		const whyUsDescription3 =
			document.getElementById("whyUsDescription3").value;
		const whyUsTitle4 = document.getElementById("whyUsTitle4").value;
		const whyUsDescription4 =
			document.getElementById("whyUsDescription4").value;

		if (
			!whyUsCaption ||
			!whyUsTitle1 ||
			!whyUsDescription1 ||
			!whyUsTitle2 ||
			!whyUsDescription2 ||
			!whyUsTitle3 ||
			!whyUsDescription3 ||
			!whyUsTitle4 ||
			!whyUsDescription4
		) {
			alert("Please fill in all fields.");
			return;
		}
		const imageFile = document.getElementById("whyUsImage").files[0];
		if (!imageFile) {
			alert("Please select an image.");
			return;
		}
		const storageRef = ref(storage, "totfd/whyUs/" + imageFile.name);
		const uploadTask = uploadBytes(storageRef, imageFile);

		uploadTask
			.then((snapshot) => {
				return getDownloadURL(snapshot.ref);
			})
			.then((imageUrl) => {
				const whyUsData = {
					whyUScaption: whyUsCaption,
					whyUsTitle1: whyUsTitle1,
					whyUsDescription1: whyUsDescription1,
					whyUsTitle2: whyUsTitle2,
					whyUsDescription2: whyUsDescription2,
					whyUsTitle3: whyUsTitle3,
					whyUsDescription3: whyUsDescription3,
					whyUsTitle4: whyUsTitle4,
					whyUsDescription4: whyUsDescription4,
					whyUsimageUrl: imageUrl,
				};

				return updateDoc(homepageDocRef, whyUsData);
			})
			.then(() => {
				console.log("Image uploaded and data saved successfully!");
				messageElement.textContent =
					"Why Us Data updated successfully! Go to Home Page and Refresh to see the changes.";
				messageElement.style.color = "green";
				messageElement.style.display = "block";
				window.scrollTo(0, 0);
			})
			.catch((error) => {
				console.error("Error uploading image or saving data:", error);
				messageElement.textContent = "Error updating data. Please try again.";
				messageElement.style.color = "red";
				messageElement.style.display = "block";
				window.scrollTo(0, 0);
			});
	});

const serviceContentForm = document.getElementById("service-content-form");
const serviceCaptionInput = document.getElementById("ourServicesCaption");
const allOurServices = document.getElementById("allOurServices");
const addServiceButton = document.getElementById("addService");

function saveServicesData() {
	const ServicesData = collectServicesFormData();

	// Save the data to Firebase
	updateDoc(productsAndServicesDocRef, ServicesData)
		.then(() => {
			console.log("Services data saved successfully!");
			console.log("Data updated successfully!");
			messageElement.textContent =
				"Service Data updated successfully!Go to Home Page and Refresh to see the changes.";
			messageElement.style.color = "green";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		})
		.catch((error) => {
			console.error("Error saving data: ", error);
			messageElement.textContent = "Error updating data. Please try again.";
			messageElement.style.color = "red";
			messageElement.style.display = "block";
			window.scrollTo(0, 0);
		});
}
function collectServicesFormData() {
	const servicesData = {
		servicesCaption: document.getElementById("ourServicesCaption").value,
		services: [], // Initialize with an empty array
	};
	var i = 0;
	const serviceElements = document.querySelectorAll(".service");
	serviceElements.forEach((serviceElement) => {
		const serviceTitleInput = serviceElement.querySelector(
			"input[placeholder='Service Title']"
		);
		const serviceDescInput = serviceElement.querySelector(
			"input[placeholder='Service Description']"
		);

		//console.log(serviceTitleInput);
		//console.log(serviceDescInput);
		const service = {
			title: serviceTitleInput.value,
			description: serviceDescInput.value,
		};

		servicesData.services.push(service);
	});
	return servicesData;
}

serviceContentForm.addEventListener("submit", function (e) {
	e.preventDefault();
	saveServicesData();
});

function populateServicesForm(docSnapshot) {
	if (docSnapshot.exists()) {
		const servicesData = docSnapshot.data();
		serviceCaptionInput.value = servicesData.servicesCaption || "";

		// Clear existing services
		allOurServices.innerHTML = "";

		if (
			servicesData.hasOwnProperty("services") &&
			Array.isArray(servicesData.services)
		) {
			servicesData.services.forEach((service) => {
				createServiceDiv(service.title, service.description);
				//console.log(service.title, service.description);
			});
		} else {
			console.log(
				"The 'services' property does not exist or is not an array in servicesData."
			);
		}
	}
}

async function deleteServiceFromFirestore(title, description) {
	try {
		const serviceToRemove = {
			title: title,
			description: description,
		};
		await updateDoc(productsAndServicesDocRef, {
			services: arrayRemove(serviceToRemove),
		});

		console.log(
			"Service deleted from Firestore successfully!Go to Home Page and Refresh to see the changes."
		);
	} catch (error) {
		console.error("Error deleting service from Firestore: ", error);
	}
}

function createServiceDiv(title, description) {
	const serviceDiv = document.createElement("div");
	serviceDiv.classList.add("service");

	serviceDiv.innerHTML = `
	<p>Service Title: <input type="text" placeholder="Service Title" class="form-control border-2 border border-primary" value="${
		title || ""
	}" /></p>
	  Service Description: <input type="text" placeholder="Service Description" class="form-control border-2 border border-primary" value="${
			description || ""
		}" />
	  <input type="button" class="btn btn-primary delete-service red-button" value="Delete" />
	`;

	//console.log(description);
	const deleteButton = serviceDiv.querySelector(".delete-service");
	deleteButton.addEventListener("click", async () => {
		const titleInput = serviceDiv.querySelector(
			"input[placeholder='Service Title']"
		);
		const descriptionInput = serviceDiv.querySelector(
			"input[placeholder='Service Description']"
		);
		//location.reload();
		//console.log(titleInput);
		//console.log(descriptionInput);
		await deleteServiceFromFirestore(titleInput.value, descriptionInput.value);
		serviceDiv.remove();
		messageElement.textContent =
			"Service Deleted successfully!Go to Home Page and Refresh to see the changes.";
		messageElement.style.color = "green";
		messageElement.style.display = "block";
		window.scrollTo(0, 0);
	});
	allOurServices.appendChild(serviceDiv);
}
// Add a click event listener to the button
addServiceButton.addEventListener("click", () => {
	// Create a new div for the service
	const newServiceDiv = document.createElement("div");
	newServiceDiv.classList.add("service");

	const titleInput = document.createElement("input");
	titleInput.type = "text";
	titleInput.classList.add(
		"form-control",
		"border-2",
		"border",
		"border-primary"
	);
	titleInput.placeholder = "Service Title";

	const descriptionInput = document.createElement("input");
	descriptionInput.type = "text";
	descriptionInput.classList.add(
		"form-control",
		"border-2",
		"border",
		"border-primary"
	);
	descriptionInput.placeholder = "Service Description";

	// Create a delete button
	const deleteButton = document.createElement("input");
	deleteButton.type = "button";
	deleteButton.classList.add(
		"btn",
		"btn-primary",
		"delete-service",
		"red-button"
	);
	deleteButton.value = "Delete";

	// Add a click event listener to the delete button
	deleteButton.addEventListener("click", async () => {
		const titleInput = newServiceDiv
			.querySelector("input[placeholder='Service Title']")
			.value.trim();
		const descriptionInput = newServiceDiv
			.querySelector("input[placeholder='Service Description']")
			.value.trim();
		await deleteServiceFromFirestore(titleInput.value, descriptionInput.value);
		allOurServices.removeChild(newServiceDiv);
		messageElement.textContent =
			"Service Data Deleted successfully!Go to Home Page and Refresh to see the changes.";
		messageElement.style.color = "green";
		messageElement.style.display = "block";
		window.scrollTo(0, 0);
	});

	// Append the input elements and delete button to the service div
	newServiceDiv.appendChild(document.createTextNode("Service Title: "));
	newServiceDiv.appendChild(titleInput);
	newServiceDiv.appendChild(document.createTextNode("Service Description: "));
	newServiceDiv.appendChild(descriptionInput);
	newServiceDiv.appendChild(deleteButton);

	// Append the new service div to the container
	allOurServices.appendChild(newServiceDiv);
});
const productContentForm = document.getElementById("products-content-form");

function saveCategoriesData() {
	const productsDataPromise = collectCategoriesFormData();
	if (productsDataPromise) {
		productsDataPromise
			.then((productsData) => {
				return updateDoc(productsAndServicesDocRef, productsData);
			})
			.then(() => {
				console.log(
					"Product data saved successfully! Go to Home Page and Refresh to see the changes."
				);
				console.log(productsDataPromise);
				messageElement.textContent = "Product Data updated successfully!";
				messageElement.style.color = "green";
				messageElement.style.display = "block";
				window.scrollTo(0, 0);
			})
			.catch((error) => {
				console.error("Error saving data: ", error);
				messageElement.textContent = "Error updating data. Please try again.";
				messageElement.style.color = "red";
				messageElement.style.display = "block";
				window.scrollTo(0, 0);
			});
	}
}

function collectCategoriesFormData() {
    return new Promise(async (resolve, reject) => {
        const categoriesData = {
            productCaption: ourProductsCaption.value,
            categories: [],
        };

        const categoryElements = document.querySelectorAll(".category");
        const promises = [];

        for (const categoryElement of categoryElements) {
            const categoryNameInput = categoryElement.querySelector(
                "input[placeholder='Category Name']"
            );

            const originalPlaceholder = "Category Name";
            const styleElement = document.createElement("style");
            styleElement.textContent = `
                .error-input {
                    border: 2px solid red;
                    color: red;
                }
            `;
            document.head.appendChild(styleElement);

            const categoryImageInput = categoryElement.querySelector(
                "input[type='file'][class='category-image-input']"
            );
            const categoryDescriptionInput = categoryElement.querySelector(
                "input[placeholder='Category Description']"
            );

            if (categoryNameInput.value.trim() === "") {
                categoryNameInput.classList.add("error-input");
                categoryNameInput.setAttribute(
                    "placeholder",
                    "Category Name cannot be empty"
                );
                return;
            } else {
                categoryNameInput.classList.remove("error-input");
                categoryNameInput.setAttribute("placeholder", originalPlaceholder);
            }

            const categoryProductsDiv = categoryElement.querySelector(".category-products");
			console.log(categoryProductsDiv)
            const productsDataPromise = collectProductsData(categoryProductsDiv);

            promises.push(
                productsDataPromise.then(async (productsData) => {
                    let imageUrl = null;

                    if (categoryImageInput && categoryImageInput.files.length > 0) {
                        imageUrl = await uploadCategoryImageToFirebaseStorage(
                            categoryImageInput.files[0]
                        );
                    } else {
						// No new image selected, retain the existing image URL
						const existingImageUrl = categoryElement.querySelector(".preview-image")?.src || "";

						imageUrl = existingImageUrl || null;
					}

                    const category = {
                        name: categoryNameInput.value,
                        image: imageUrl,
                        description: categoryDescriptionInput.value,
                        products: productsData,
                    };
                    categoriesData.categories.push(category);
                })
            );
        }

        try {
            await Promise.all(promises);
            resolve(categoriesData);
        } catch (error) {
            reject(error);
        }
    });
}

	

  async function uploadCategoryImageToFirebaseStorage(imageFile) {
	const storageRef = ref(storage, "totfd/catogoryImages/" + imageFile.name);
  
	try {
	  await uploadBytes(storageRef, imageFile);
	  const imageUrl = await getDownloadURL(storageRef);
	  return imageUrl;
	} catch (error) {
	  console.error("Error uploading image:", error);
	  return null;
	}
  }

  async function collectProductsData(categoryProductsDiv) {
    const productsData = [];

    const productElements = categoryProductsDiv.querySelectorAll(".product");

    const uploadPromises = [];

    for (const productElement of productElements) {
        const productTitleInput = productElement.querySelector(
            "input[placeholder='Product Title']"
        );
        const productDescInput = productElement.querySelector(
            "input[placeholder='Product Description']"
        );
        const productPriceInput = productElement.querySelector(
            "input[placeholder='Product Price']"
        );
        const productQuantityInput = productElement.querySelector(
            "input[placeholder='Product Quantity']"
        );
        const imageInput = productElement.querySelector("input[type='file']");
        const imagePreview = productElement.querySelector(".image-preview");
        const imageUrl = productElement.querySelector(".preview-image")?.src || "";
        
        if (imageInput.style.display !== "none" && imageInput.files[0]) {
            const uploadPromise = uploadImageToFirebaseStorage(
                imageInput.files[0]
            ).then((uploadedImageUrl) => {
                const product = {
                    title: productTitleInput.value,
                    Price: productPriceInput.value,
                    Quantity: productQuantityInput.value,
                    description: productDescInput.value,
                    imageUrl: uploadedImageUrl,
                };
                productsData.push(product);
            });
            uploadPromises.push(uploadPromise);
        } else if (imageUrl) {
            // Use the existing imageUrl for old products
            const product = {
                title: productTitleInput.value,
                Price: productPriceInput.value,
                Quantity: productQuantityInput.value,
                description: productDescInput.value,
                imageUrl: imageUrl,
            };
            productsData.push(product);
        }
    }

    try {
        await Promise.all(uploadPromises);
        
        return productsData;
    } catch (error) {
        console.error("Error uploading images:", error);
        return null;
    }
}


async function uploadImageToFirebaseStorage(imageFile) {
    const storageRef = ref(storage, "totfd/products/" + imageFile.name);

    try {
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        return imageUrl;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
}


productContentForm.addEventListener("submit", function (e) {
	e.preventDefault();
	saveCategoriesData();
});

const deleteProduct = async (categoryProductsDiv, productName) => {
	const productDiv = Array.from(categoryProductsDiv.children).find(
		(child) => child.querySelector("input[type='text']").value === productName
	);

	if (productDiv) {
		categoryProductsDiv.removeChild(productDiv);

		try {
			const categoryDiv = categoryProductsDiv.parentNode;
			const categoryNameInput =
				categoryDiv.querySelector("input[type='text']").value;

			const categoriesSnapshot = await getDoc(productsAndServicesDocRef);
			const categoriesData = categoriesSnapshot.data().categories;

			const updatedCategories = categoriesData.map((category) => {
				if (category.name === categoryNameInput) {
					const updatedProducts = category.products.filter(
						(product) => product.title !== productName
					);
					return { ...category, products: updatedProducts };
				}
				return category;
			});

			await updateDoc(productsAndServicesDocRef, {
				categories: updatedCategories,
			});

			console.log("Product deleted from Firestore successfully!");
		} catch (error) {
			console.error("Error deleting product from Firestore: ", error);
		}
	} else {
		console.error("Product not found in the DOM!");
	}
};

function populateProductsFromFirebase(docSnapshot) {
	const productData = docSnapshot.data();
	console.log(productData.productCaption);
	console.log(productData.categories);
	const productCaption = productData.productCaption;
	const categories = productData.categories || [];
	const productCaptionInput = document.getElementById("ourProductsCaption");
	productCaptionInput.value = productCaption;

	const categorySection = document.getElementById("categorySection");
	categories.forEach((category) => {
		if(category){
		const newCategoryDiv = document.createElement("div");
		newCategoryDiv.classList.add("category");

		const categoryNameInput = document.createElement("input");
		categoryNameInput.type = "text";
		categoryNameInput.classList.add(
			"form-control",
			"border-2",
			"border",
			"border-primary"
		);
		categoryNameInput.placeholder = "Category Name";
		categoryNameInput.value = category.name;

		const categoryImageInput = document.createElement("input");
		categoryImageInput.type = "file";
		categoryImageInput.classList.add("category-image-input");
		categoryImageInput.style.marginTop = "10px";

		const categoryDescriptionInput = document.createElement("input");
		categoryDescriptionInput.type = "text";
		categoryDescriptionInput.classList.add(
		  "form-control",
		  "border-2",
		  "border",
		  "border-primary"
		);
		categoryDescriptionInput.placeholder = "Category Description";
		categoryDescriptionInput.value = category.description;

		const imagePreview = document.createElement("div");
		imagePreview.classList.add("image-preview");
		imagePreview.style.width = "3cm";
		imagePreview.style.height = "3cm";
		imagePreview.style.marginTop = "10px";
		categoryImageInput.style.display = "none";

		if (category.image) {
			const imageElement = document.createElement("img");
			imageElement.src = category.image;
			imageElement.classList.add("preview-image");
			imageElement.style.width = "100%";
			imageElement.style.height = "100%";
			imagePreview.appendChild(imageElement);
	  
			categoryImageInput.addEventListener("change", (e) => {
			  const file = e.target.files[0];
			  const reader = new FileReader();
			  reader.onload = (event) => {
				const imageUrl = event.target.result;
				const imageElement = document.createElement("img");
				imageElement.src = imageUrl;
				imageElement.classList.add("preview-image");
				imageElement.style.width = "100%";
				imageElement.style.height = "100%";
				categoryImagePreview.innerHTML = "";
				categoryImagePreview.appendChild(imageElement);
			  };
			  reader.readAsDataURL(file);
			});
		  }

		  const categoryImagePreview = document.createElement("div");
		  categoryImagePreview.classList.add("image-preview");
		  categoryImagePreview.style.width = "3cm";
		  categoryImagePreview.style.height = "3cm";
		  categoryImagePreview.style.marginTop = "10px";
		  categoryImagePreview.style.marginBottom = "10px";
	  

		const addProductUnderCategoryButton = document.createElement("button");
		addProductUnderCategoryButton.textContent = "+ Add Products";
		addProductUnderCategoryButton.classList.add("btn", "btn-primary", "mt-1");
		addProductUnderCategoryButton.addEventListener("click", (e) => {
			e.preventDefault();
			addProductUnderCategory(newCategoryDiv);
			e.stopPropagation();
		});

		const deleteCategoryButton = document.createElement("button");
		deleteCategoryButton.textContent = "Delete";
		deleteCategoryButton.classList.add("btn", "btn-danger", "mt-1");
		deleteCategoryButton.addEventListener("click", (e) => {
			e.preventDefault();
			deleteCategory(newCategoryDiv);
			e.stopPropagation();
		});
		const categoryProductsDiv = document.createElement("div");
		categoryProductsDiv.classList.add("category-products");

		// Populate the products within the category
		category.products.forEach((product) => {
			const newProductDiv = document.createElement("div");
			newProductDiv.classList.add("product");

			const titleInput = document.createElement("input");
			titleInput.type = "text";
			titleInput.classList.add(
				"form-control",
				"border-2",
				"border",
				"border-primary"
			);
			titleInput.placeholder = "Product Title";
			titleInput.value = product.title;

			const PriceInput = document.createElement("input");
			PriceInput.type = "text";
			PriceInput.classList.add(
				"form-control",
				"border-2",
				"border",
				"border-primary"
			);
			PriceInput.placeholder = "Product Price";
			PriceInput.value = product.Price;

			const QuantityInput = document.createElement("input");
			QuantityInput.type = "text";
			QuantityInput.classList.add(
				"form-control",
				"border-2",
				"border",
				"border-primary"
			);
			QuantityInput.placeholder = "Product Quantity";
			QuantityInput.value = product.Quantity;


			const descriptionInput = document.createElement("input");
			descriptionInput.type = "text";
			descriptionInput.classList.add(
				"form-control",
				"border-2",
				"border",
				"border-primary"
			);
			descriptionInput.placeholder = "Product Description";
			descriptionInput.value = product.description;

			const imageInput = document.createElement("input");
			imageInput.type = "file";
			imageInput.classList.add(
				"form-control",
				"border-2",
				"border",
				"border-primary"
			);
			imageInput.style.marginTop = "10px";

			const imagePreview = document.createElement("div");
			imagePreview.classList.add("image-preview");
			imagePreview.style.width = "3cm";
			imagePreview.style.height = "3cm";
			imagePreview.style.marginTop = "10px";
			imageInput.style.display = "none";

			const changeImageButton = document.createElement("button");
			changeImageButton.textContent = "Change Image";
			changeImageButton.classList.add("btn", "btn-primary", "mt-1");
			changeImageButton.addEventListener("click", (e) => {
				e.preventDefault();
				imageInput.style.display = "block";
				changeImageButton.style.display = "none";
				e.stopPropagation();
			});

			if (product.imageUrl) {
				const imageElement = document.createElement("img");
				imageElement.src = product.imageUrl;
				imageElement.classList.add("preview-image");
				imageElement.style.width = "100%";
				imageElement.style.height = "100%";
				imagePreview.appendChild(imageElement);
			}

			imageInput.addEventListener("change", (e) => {
				const file = e.target.files[0];
				const reader = new FileReader();
				reader.onload = (event) => {
					const imageUrl = event.target.result;
					const imageElement = document.createElement("img");
					imageElement.src = imageUrl;
					imageElement.classList.add("preview-image");
					imageElement.style.width = "100%";
					imageElement.style.height = "100%";
					imagePreview.innerHTML = "";
					imagePreview.appendChild(imageElement);
				};
				reader.readAsDataURL(file);
			});

			const deleteButton = document.createElement("button");
			deleteButton.textContent = "Delete";
			deleteButton.classList.add(
				"btn",
				"btn-primary",
				"delete-product",
				"red-button"
			);

			deleteButton.addEventListener("click", () => {
				deleteProduct(categoryProductsDiv, product.title);
			});

			newProductDiv.appendChild(document.createTextNode("Product Title: "));
			newProductDiv.appendChild(titleInput);
			newProductDiv.appendChild(document.createTextNode("Product Price: "));
			newProductDiv.appendChild(PriceInput);
			newProductDiv.appendChild(document.createTextNode("Product Quantity: "));
			newProductDiv.appendChild(QuantityInput);
			newProductDiv.appendChild(
				document.createTextNode("Product Description: ")
			);
			newProductDiv.appendChild(descriptionInput);
			newProductDiv.appendChild(document.createTextNode("Product Image: "));
			newProductDiv.appendChild(imagePreview);
			newProductDiv.appendChild(changeImageButton);
			newProductDiv.appendChild(imageInput);
			newProductDiv.appendChild(deleteButton);

			categoryProductsDiv.appendChild(newProductDiv);
		});

		newCategoryDiv.appendChild(document.createTextNode("Category Name: "));
		newCategoryDiv.appendChild(categoryNameInput);
		newCategoryDiv.appendChild(document.createTextNode("Category Description: "));
		newCategoryDiv.appendChild(categoryDescriptionInput);
		newCategoryDiv.appendChild(document.createTextNode("Category Image "));
		newCategoryDiv.appendChild(imagePreview);
		newCategoryDiv.appendChild(addProductUnderCategoryButton);
		newCategoryDiv.appendChild(deleteCategoryButton);
		newCategoryDiv.appendChild(categoryImageInput);
		newCategoryDiv.appendChild(categoryProductsDiv);

		categorySection.appendChild(newCategoryDiv);
	}
	});
}

const deleteCategory = (categoryDiv) => {
	const categoryNameInput = categoryDiv.querySelector("input[type='text']");

	const categoryName = categoryNameInput.value;

	deleteCategoryFromFirestore(categoryName);

	const categorySection = document.getElementById("categorySection");
	categorySection.removeChild(categoryDiv);
};
async function deleteCategoryFromFirestore(categoryName) {
	try {
		const doc = await getDoc(productsAndServicesDocRef);
		if (doc.exists()) {
			const categoriesData = doc.data().categories;

			const index = categoriesData.findIndex(
				(category) => category.name === categoryName
			);

			if (index !== -1) {
				categoriesData.splice(index, 1);
				await updateDoc(productsAndServicesDocRef, {
					categories: categoriesData,
				});

				console.log(
					"Category deleted from Firestore successfully! Go to Home Page and Refresh to see the changes."
				);
				messageElement.textContent =
					"Product Category Data Deleted successfully!";
				messageElement.style.color = "green";
				messageElement.style.display = "block";
				window.scrollTo(0, 0);
			} else {
				console.log("Category not found in Firestore.");
			}
		} else {
			console.log("Document not found in Firestore.");
		}
	} catch (error) {
		console.error("Error deleting Category from Firestore: ", error);
	}
}

const categorySection = document.getElementById("categorySection");

const createCategory = () => {
	const newCategoryDiv = document.createElement("div");
	newCategoryDiv.classList.add("category");

	const categoryNameInput = document.createElement("input");
	categoryNameInput.type = "text";
	categoryNameInput.classList.add(
		"form-control",
		"border-2",
		"border",
		"border-primary"
	);
	categoryNameInput.placeholder = "Category Name";

	const errorMessageSpan = document.createElement("span");
	errorMessageSpan.classList.add("error-message");
	errorMessageSpan.style.color = "red";
	errorMessageSpan.style.display = "none";
	errorMessageSpan.textContent = "Category Name cannot be empty";

	const categoryImageInput = document.createElement("input");
  categoryImageInput.type = "file";
  categoryImageInput.classList.add("category-image-input");
  categoryImageInput.style.marginTop = "10px";

  const categoryDescriptionInput = document.createElement("input");
  categoryDescriptionInput.type = "text";
  categoryDescriptionInput.classList.add(
    "form-control",
    "border-2",
    "border",
    "border-primary"
  );
  categoryDescriptionInput.style.marginTop = "10px";
  categoryDescriptionInput.placeholder = "Category Description";

	categoryNameInput.appendChild(errorMessageSpan);

	const addProductUnderCategoryButton = document.createElement("button");
	addProductUnderCategoryButton.textContent = "+ Add Products";
	addProductUnderCategoryButton.classList.add("btn", "btn-primary", "mt-1");
	addProductUnderCategoryButton.addEventListener("click", (e) => {
		e.preventDefault();
		addProductUnderCategory(newCategoryDiv);
		e.stopPropagation();
	});

	const deleteCategoryButton = document.createElement("button");
	deleteCategoryButton.textContent = "Delete";
	deleteCategoryButton.classList.add("btn", "btn-danger", "mt-1");
	deleteCategoryButton.addEventListener("click", (e) => {
		e.preventDefault();
		deleteCategory(newCategoryDiv);
		e.stopPropagation();
	});
	const categoryProductsDiv = document.createElement("div");
	categoryProductsDiv.classList.add("category-products");

	newCategoryDiv.appendChild(document.createTextNode("Category Name: "));
	
	newCategoryDiv.appendChild(categoryNameInput);
  newCategoryDiv.appendChild(categoryDescriptionInput);
  newCategoryDiv.appendChild(categoryImageInput);
	newCategoryDiv.appendChild(addProductUnderCategoryButton);
	newCategoryDiv.appendChild(deleteCategoryButton);
	newCategoryDiv.appendChild(categoryProductsDiv);

	

	categorySection.appendChild(newCategoryDiv);
};

const addProductUnderCategory = (categoryDiv) => {
	const categoryProductsDiv = categoryDiv.querySelector(".category-products");

	const newProductDiv = document.createElement("div");
	newProductDiv.classList.add("product");

	const titleInput = document.createElement("input");
	titleInput.type = "text";
	titleInput.classList.add(
		"form-control",
		"border-2",
		"border",
		"border-primary"
	);
	titleInput.placeholder = "Product Title";

	const PriceInput = document.createElement("input");
	PriceInput.type = "text";
	PriceInput.classList.add(
		"form-control",
		"border-2",
		"border",
		"border-primary"
	);
	PriceInput.placeholder = "Product Price";

	const QuantityInput = document.createElement("input");
	QuantityInput.type = "text";
	QuantityInput.classList.add(
		"form-control",
		"border-2",
		"border",
		"border-primary"
	);
	QuantityInput.placeholder = "Product Quantity";

	const descriptionInput = document.createElement("input");
	descriptionInput.type = "text";
	descriptionInput.classList.add(
		"form-control",
		"border-2",
		"border",
		"border-primary"
	);
	descriptionInput.placeholder = "Product Description";

	const imagePreview = document.createElement("div");
	imagePreview.classList.add("image-preview");
	imagePreview.style.width = "3cm";
	imagePreview.style.height = "3cm";
	imagePreview.style.marginBottom = "10px";

	const imageInput = document.createElement("input");
	imageInput.type = "file";
	imageInput.classList.add(
		"form-control",
		"border-2",
		"border",
		"border-primary"
	);

	imageInput.addEventListener("change", (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (event) => {
			const imageUrl = event.target.result;
			const imageElement = document.createElement("img");
			imageElement.src = imageUrl;
			imageElement.classList.add("preview-image");
			imageElement.style.width = "100%";
			imageElement.style.height = "100%";
			imagePreview.innerHTML = "";
			imagePreview.appendChild(imageElement);
		};
		reader.readAsDataURL(file);
	});

	const deleteButton = document.createElement("button");
	deleteButton.textContent = "Delete";
	deleteButton.classList.add(
		"btn",
		"btn-primary",
		"delete-product",
		"red-button"
	);

	deleteButton.addEventListener("click", (e) => {
		e.preventDefault();
		const productTitle = titleInput.value;
		deleteProduct(categoryProductsDiv, productTitle);
		e.stopPropagation();
	});

	newProductDiv.appendChild(document.createTextNode("Product Title: "));
	newProductDiv.appendChild(titleInput);
	newProductDiv.appendChild(document.createTextNode("Product Price: "));
	newProductDiv.appendChild(PriceInput);
	newProductDiv.appendChild(document.createTextNode("Product Quantity: "));
	newProductDiv.appendChild(QuantityInput);
	newProductDiv.appendChild(document.createTextNode("Product Description: "));
	newProductDiv.appendChild(descriptionInput);
	newProductDiv.appendChild(document.createTextNode("Product Image: "));
	newProductDiv.appendChild(imagePreview);
	newProductDiv.appendChild(imageInput);
	newProductDiv.appendChild(deleteButton);

	categoryProductsDiv.appendChild(newProductDiv);
};

const addCategoryButton = document.getElementById("addCategory");
addCategoryButton.addEventListener("click", createCategory);

function populateFormFields() {
	getDoc(homepageDocRef)
		.then((docSnapshot) => {
			if (docSnapshot.exists()) {
				const data = docSnapshot.data();
				//webAppNameInput.value = data.webAppName || "";
				homePageWelcomeInput.value = data.homePageWelcome || "";
				homePageCaptionInput.value = data.homePageCaption || "";
				homePageCaptionInput2.value = data.homePageCaption2 || "";
				homePageCaptionInput3.value = data.homePageCaption3 || "";
				footerMessageInput.value = data.footerMessage || "";
				populateAboutUsForm(docSnapshot);
				populateWhyUsForm(docSnapshot);
			}
		})
		.catch((error) => {
			console.error("Error retrieving data: ", error);
		});
	getDoc(productsAndServicesDocRef)
		.then((docSnapshot) => {
			if (docSnapshot.exists()) {
				populateProductsFromFirebase(docSnapshot);
				populateServicesForm(docSnapshot);
			}
		})
		.catch((error) => {
			console.error("Error retrieving services data: ", error);
		});
}

var fontFamilyDropdown = document.getElementById("fontFamily");
fontFamilyDropdown.addEventListener("change", function () {
	var selectedFont = fontFamilyDropdown.value;
	var fontPreview = document.getElementById("fontPreview");
	fontPreview.style.fontFamily = selectedFont;
});

const applyButton = document.getElementById("applyButton");
const fontFamilyError = document.getElementById("fontFamily-error");

applyButton.addEventListener("click", async (event) => {
	event.preventDefault();
	event.stopPropagation();

	const selectedFont = document.getElementById("fontFamily").value;
	const selectedFontSize = document.getElementById("fontSize").value;

	if (!selectedFont) {
		fontFamilyError.style.display = "block";
		return;
	} else {
		fontFamilyError.style.display = "none";
	}

	try {
		await updateDoc(homepageDocRef, {
			font: selectedFont,
			fontSize: selectedFontSize || null,
		});
		messageElement.textContent =
			"Font Applied successfully, Go to Home Page and Refresh to see the changes.";
		messageElement.style.color = "green";
		messageElement.style.display = "block";
		console.log("Font updated successfully in Firebase.");
		window.scrollTo(0, 0);
	} catch (error) {
		console.error("Error updating font and preview in Firebase:", error);
	}
});

document.addEventListener("DOMContentLoaded", async function () {
	try {
		populateFormFields();
		try {
			const doc = await getDoc(homepageDocRef);
			const font = doc.data().font;
			const fontSize = doc.data().fontSize;

			if (font) {
				document.getElementById("fontFamily").value = font;
			}

			if (fontSize) {
				document.getElementById("fontSize").value = fontSize;
			}
		} catch (error) {
			console.error("Error getting font details from the database:", error);
		}
	} catch (error) {
		console.error("Error:", error);
	}
});
