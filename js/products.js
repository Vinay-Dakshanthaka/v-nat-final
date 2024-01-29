function fetchProductsDataFromLocalStorage() {
	const productsData = JSON.parse(
		sessionStorage.getItem("productsAndServicesData")
	);
	return productsData;
}

async function populateProductsContainer(productsData) {
	// console.log(productsData);
	if (!productsData || !productsData.categories) {
		// console.log("No product data available.");
		return;
	}

	const productsCaption = document.getElementById("ourProductsCaption");
	productsCaption.textContent = productsData.productCaption;

	const productContainer = document.getElementById("productContainer");
	productContainer.innerHTML = "";

	productsData.categories.forEach((category, categoryIndex) => {
		category.products.forEach((product, productIndex) => {
			const productCard = document.createElement("div");
			productCard.classList.add("col-lg-4", "col-md-6", "wow", "zoomIn");
			productCard.dataset.wowDelay = `${
				0.1 * (categoryIndex * category.products.length + productIndex + 1)
			}s`;

			const cardBody = document.createElement("div");
			cardBody.classList.add(
				"product-item",
				"bg-light",
				"rounded",
				"d-flex",
				"flex-column",
				"align-items-center",
				"justify-content-center",
				"text-center"
			);

			const productImage = document.createElement("div");
productImage.style.width = "80%"; // Set the width of the image container
productImage.style.height = "200px"; // Set the height of the image container or adjust as needed
productImage.style.backgroundImage = `url("${product.imageUrl}")`;
productImage.style.backgroundSize = "cover";
productImage.style.backgroundPosition = "center";
productImage.style.backgroundRepeat = "no-repeat";

			productImage.addEventListener("click", () => {
				const modal = new bootstrap.Modal(
					document.getElementById("imageModal")
				);
				const modalImage = document.getElementById("modalImage");
				modalImage.src = product.imageUrl;
				document.getElementById("imageModalLabel").innerHTML = product.title;
				modal.show();
			});

			cardBody.appendChild(productImage);

			const productTitle = document.createElement("h5"); 
			productTitle.classList.add("mb-3");
			productTitle.textContent = product.title;

			cardBody.appendChild(productTitle);

			const productPrice = document.createElement("h5");
            productPrice.classList.add("mb-3");
            const ptextNode = document.createTextNode("Price: ");
            productPrice.appendChild(ptextNode);
            productPrice.appendChild(document.createTextNode(product.Price));

			cardBody.appendChild(productPrice);


			const productQuantity = document.createElement("h5");
            productQuantity.classList.add("mb-3");
            const qtextNode = document.createTextNode("Qty: ");
            productQuantity.appendChild(qtextNode);
            productQuantity.appendChild(document.createTextNode(product.Quantity));

			cardBody.appendChild(productQuantity);

			const productDescription = document.createElement("p");
			productDescription.classList.add("m-0");
			productDescription.textContent = product.description;

			cardBody.appendChild(productDescription);

			const buyButton = document.createElement("button");
			buyButton.className = "btn btn-lg btn-success rounded";
			buyButton.innerHTML = '<i class="bi bi-cart"></i> Buy';

			buyButton.addEventListener("click", () => {
				const buyModal = new bootstrap.Modal(
					document.getElementById("buyModal")
				);

				document.getElementById("productNameInput").value = product.title;
				document.getElementById("productImageInput").value = product.imageUrl;
				//document.getElementById("productPriceInput").value = product.Price;
				//document.getElementById("productQuantityInput").value = product.Quantity;

				buyModal.show();
			});

			cardBody.appendChild(buyButton);

			productCard.appendChild(cardBody);

			productContainer.appendChild(productCard);
		});
	});
}

document
	.getElementById("submitBuyForm")
	.addEventListener("click", function (event) {
		event.preventDefault();
		const productName = document.getElementById("productNameInput").value;
		const productImage = document.getElementById("productImageInput").value;
		const name = document.getElementById("nameInput").value;
		const email = document.getElementById("emailInput").value;
		const mobile = document.getElementById("mobileInput").value;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmailValid = emailRegex.test(email);

// Validation for mobile number using regex
const mobileRegex = /^[0-9]{10}$/;
const isMobileValid = mobileRegex.test(mobile);

if (!isEmailValid && !isMobileValid) {
    alert("Please enter a valid Email or Mobile Number.");
    // console.error("Invalid email or mobile number.");
    return false;
}

		emailjs.init("vb9KEKs3BpHBPC0_H");

		const templateParams = {
			from_name: name,
			from_email: email || "Not Provided",
			mobile_number: mobile || "Not Provided",
			subject: "Product Order",
			message: "Product Name: " + productName,
			referenceImage: productImage,
		};

		emailjs
			.send("service_reh310e", "template_0lqohuh", templateParams)
			.then(function (response) {
				// console.log("Email sent:", response);
				document.getElementById("successMessage").style.display = "block";
				document.getElementById("buyForm").reset();
			})
			.catch(function (error) {
				// console.error("Email sending failed:", error);
			});

		const buyModal = new bootstrap.Modal(document.getElementById("buyModal"));
		buyModal.hide();
	});

	

function populateCategories(productsData) {
	const categoryContainer = document.getElementById("categoryContainer");

	categoryContainer.innerHTML = "";

	const allProductsItem = document.createElement("div");
	allProductsItem.classList.add("btn", "btn-secondary", "btn-sm", "m-2");
	allProductsItem.textContent = "All Products";
	allProductsItem.addEventListener("click", () => {
		populateProductsContainer(productsData);
	});
	categoryContainer.appendChild(allProductsItem);
	const categoryId = window.location.hash.slice(1);
	console.log("url id",categoryId)
	productsData.categories.forEach((category) => {
		const categoryItem = document.createElement("button");
		categoryItem.classList.add("btn", "btn-secondary", "btn-sm", "m-2");
		categoryItem.textContent = category.name;
		let categoryName = category.name;
		categoryItem.id = categoryName.replace(/\s/g, '').trim()
		let buttonId = categoryItem.id
		// console.log(buttonId)
		categoryItem.addEventListener("click", () => {
			const categoryData = getCategoryDataByName(productsData, category.name);
			populateProductsContainer(categoryData);
			// console.log(categoryData);
		});
		categoryContainer.appendChild(categoryItem);
		if (buttonId === categoryId) {
            // Schedule the click event for the next tick using setTimeout
            setTimeout(() => {
                categoryItem.click();
            }, 0);
        }

	});

}

function getCategoryDataByName(productsData, categoryName) {
	const filteredCategories = productsData.categories.filter(
		(category) => category.name === categoryName
	);

	if (filteredCategories.length === 0) {
		// console.log(`No category found with the name ${categoryName}.`);
		return null;
	}

	const filteredCategory = JSON.parse(JSON.stringify(filteredCategories[0]));
	filteredCategory.productCaption = `${categoryName}`;

	// Remove other categories from the filtered category
	filteredCategory.categories = [filteredCategory];

	return filteredCategory;
}
document.addEventListener("DOMContentLoaded", () => {
	const productsData = fetchProductsDataFromLocalStorage();
	populateProductsContainer(productsData);
	populateCategories(productsData);
});
