import {
	collection,
	doc,
	getDocs,
	orderBy,
	query,
	updateDoc,
	where,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { firestore } from "../js/firebase-config.js";

const totfd = collection(firestore, "totfd");
const totfdDocRef = doc(totfd, "totfdDoc");
const leadsCollection = collection(totfdDocRef, "paymentLeadsData");

function populateLeadsTable(leads) {
	const tbody = document.getElementById("leadsTableBody");
	let leadCounter = 1;
	// Clear existing table rows if any
	tbody.innerHTML = "";

	// Create an array of status options for the dropdown
	const statusOptions = ["New", "Accepted", "Rejected"];

	let totalAmount = 0;

	// Loop through the leads data and create table rows
	leads.forEach((lead) => {
		const row = document.createElement("tr");

		// Add a cell for the SNO (index + 1)
		const snoCell = document.createElement("td");
		snoCell.textContent = leadCounter;
		row.appendChild(snoCell);

		// Add cells for the other data
		const nameCell = document.createElement("td");
		nameCell.textContent = lead.name;
		row.appendChild(nameCell);

		const mobileNumberCell = document.createElement("td");
		mobileNumberCell.textContent = lead.mobile;
		row.appendChild(mobileNumberCell);

		const purposeCell = document.createElement("td");
		purposeCell.textContent = lead.purpose;
		row.appendChild(purposeCell);

		const amountCell = document.createElement("td");
		const amountValue = document.createElement("span");
    	amountValue.textContent = lead.amount;

		amountValue.style.marginRight = "50px";
    	amountCell.appendChild(amountValue);

    	const editIcon = document.createElement("i");
    	editIcon.className = "fas fa-edit";
    	editIcon.style.cursor = "pointer";
    	editIcon.title = "Edit Amount";
    	amountCell.appendChild(editIcon);

    	row.appendChild(amountCell);

		editIcon.addEventListener("click", () => {
			const amountInput = document.createElement("input");
			amountInput.type = "text";
			amountInput.value = lead.amount; // Initialize with the current amount
			amountValue.style.display = "none"; // Hide the amount span
			editIcon.style.display = "none"; // Hide the edit icon
	
			// Append the input field for editing the amount
			amountCell.appendChild(amountInput);
	
			// Create a save icon
			const saveIcon = document.createElement("i");
			saveIcon.className = "fas fa-save"; // You can use Font Awesome or another icon library
			saveIcon.style.cursor = "pointer";
			saveIcon.title = "Save Amount";
			amountCell.appendChild(saveIcon);
	
			// Add a click event listener to the save icon to save the edited amount
			saveIcon.addEventListener("click", () => {
				const editedAmount = parseFloat(amountInput.value);
				if (!isNaN(editedAmount)) {
					lead.amount = editedAmount;
					amountValue.textContent = editedAmount.toFixed(2);

					updateLeadStatus(lead.ref, lead.status, editedAmount);
				}
				amountInput.remove();
				saveIcon.remove();
				amountValue.style.display = "inline";
				editIcon.style.display = "inline";
			});
		});

		totalAmount += parseFloat(lead.amount);

		const screenShotCell = document.createElement("img");
        screenShotCell.src = lead.picUrl;
        row.appendChild(screenShotCell);
		screenShotCell.style.width = "50px";
		screenShotCell.style.height = "50px";

        // Add a click event listener to open the modal
        screenShotCell.addEventListener("click", () => {
            const modal = document.getElementById("imageModal");
            const modalImage = document.getElementById("modalImage");

            modal.style.display = "block"; // Display the modal
			// modal.style.alignItems = "center";
			// modal.style.width = "50%";
            modalImage.src = lead.picUrl; // Set the modal image source

            // Add a click event listener to close the modal when the 'x' is clicked
            const closeBtn = document.querySelector(".close");
            closeBtn.addEventListener("click", () => {
                modal.style.display = "none"; // Hide the modal
            });

            // Add a click event listener to close the modal when the modal background is clicked
            window.addEventListener("click", (event) => {
                if (event.target == modal) {
                    modal.style.display = "none"; // Hide the modal
                }
            });
        });



		const timestamp = new Date(lead.timestamp.toDate());
		const formattedDate = timestamp.toLocaleDateString();
		const dateCell = document.createElement("td");
		dateCell.textContent = formattedDate;
		row.appendChild(dateCell);

		// Add a dropdown cell for the Status
		const statusCell = document.createElement("td");
		const statusSelect = document.createElement("select");
		statusSelect.classList.add("status-select"); // Add a class for easier selection
		statusOptions.forEach((option) => {
			const optionElement = document.createElement("option");
			optionElement.textContent = option;
			optionElement.value = option; // Set the current status as value
			statusSelect.appendChild(optionElement);
		});

		// Set the selected status based on the lead's status property
		statusSelect.value = lead.status;

		// Add an event listener to the status dropdown to update the status in Firestore
		statusSelect.addEventListener("change", async (event) => {
			const selectedStatus = event.target.value;
			lead.status = selectedStatus; // Update the status in the lead object
			await updateLeadStatus(lead.ref, selectedStatus, lead.amount); // Update status in Firestore
		});
		statusCell.appendChild(statusSelect);
		row.appendChild(statusCell);

		row.dataset.leadRef = lead.ref.path;

		// Append the row to the table body
		tbody.appendChild(row);
		//console.log(lead);
		leadCounter++;
	});

	const totalAmountRow = document.createElement("tr");
    const totalAmountCell = document.createElement("td");
    totalAmountCell.textContent = "Total Amount";
    totalAmountCell.colSpan = 4; // Span the cell across four columns
    totalAmountRow.appendChild(totalAmountCell);

    // Create a cell to display the dynamically calculated total amount
    const totalAmountValueCell = document.createElement("td");
    totalAmountValueCell.textContent = totalAmount.toFixed(2); // Display total amount with two decimal places
    totalAmountRow.appendChild(totalAmountValueCell);

    tbody.appendChild(totalAmountRow);
}

// async function updateLeadStatus(leadRef, newStatus) {
// 	try {
// 		await updateDoc(leadRef, { status: newStatus });
// 		//console.log("Status updated successfully");
// 	} catch (error) {
// 		//console.error("Error updating status:", error);
// 		throw error;
// 	}
// }
async function updateLeadStatus(leadRef, newStatus, newAmount) {
	try {
		const updatedData = {
			status: newStatus,
			amount: newAmount, // Include the updated amount in the data
		};

		await updateDoc(leadRef, updatedData);
		//console.log("Status and amount updated successfully");
	} catch (error) {
		//console.error("Error updating status and amount:", error);
		throw error;
	}
}











async function readAllLeads() {
	try {
		clearLeadsTable();
		const querySnapshot = await getDocs(
			query(leadsCollection, orderBy("timestamp"))
		);
		const leads = querySnapshot.docs.map((doc) => ({
			...doc.data(),
			ref: doc.ref,
		}));
		await populateLeadsTable(leads);
		checkLeadsAndDisplay();
		return leads;
	} catch (error) {
		//console.error("Error fetching leads:", error);
		throw error;
	}
}

// Function to fetch and display leads with status "New"
async function readNewLeads() {
	try {
		clearLeadsTable();
		const leadsQuery = query(leadsCollection, where("status", "==", "New"));
		const leads = await getDocs(leadsQuery);
		const leadsData = leads.docs.map((doc) => ({
			...doc.data(),
			ref: doc.ref,
		}));
		await populateLeadsTable(leadsData);
		checkLeadsAndDisplay();
		updateTotalRecordsCount();
		return leadsData;
	} catch (error) {
		//console.error("Error fetching new leads:", error);
	}
}

// Function to fetch and display leads with status "Processing"
async function readAcceptedLeads() {
	try {
		clearLeadsTable();
		const leadsQuery = query(
			leadsCollection,
			where("status", "==", "Accepted")
		);
		const leads = await getDocs(leadsQuery);
		const leadsData = leads.docs.map((doc) => ({
			...doc.data(),
			ref: doc.ref,
		}));
		await populateLeadsTable(leadsData);
		checkLeadsAndDisplay();
		updateTotalRecordsCount();
		return leadsData;
	} catch (error) {
		//console.error("Error fetching processing leads:", error);
	}
}

async function readRejectedLeads() {
	try {
		clearLeadsTable();
		const leadsQuery = query(
			leadsCollection,
			where("status", "==", "Rejected")
		);
		const leads = await getDocs(leadsQuery);
		const leadsData = leads.docs.map((doc) => ({
			...doc.data(),
			ref: doc.ref,
		}));
		await populateLeadsTable(leadsData);
		checkLeadsAndDisplay();
		updateTotalRecordsCount();
		return leadsData;
	} catch (error) {
		//console.error("Error fetching rejected leads:", error);
	}
}

const dateSearchFromInput = document.getElementById("dateSearchFrom");
const dateSearchToInput = document.getElementById("dateSearchTo");

async function readLeadsInDateRange() {
	try {
		clearLeadsTable();

		const fromDate = new Date(dateSearchFromInput.value);
		const toDate = new Date(dateSearchToInput.value);

		// Add 1 day to toDate to include leads on the end date
		toDate.setDate(toDate.getDate() + 1);
		//console.log(fromDate);

		const leadsQuery = query(
			leadsCollection,
			where("timestamp", ">=", fromDate),
			where("timestamp", "<", toDate)
		);

		const leads = await getDocs(leadsQuery);
		const leadsData = leads.docs.map((doc) => ({
			...doc.data(),
			ref: doc.ref,
		}));
		await populateLeadsTable(leadsData);
		checkLeadsAndDisplay();
		updateTotalRecordsCount();
		return leadsData;
	} catch (error) {
		//console.error("Error fetching leads in date range:", error);
	}
}

const dateSearchButton = document.getElementById("searchButton");
dateSearchButton.addEventListener("click", readLeadsInDateRange);

function clearLeadsTable() {
	const tbody = document.getElementById("leadsTableBody");
	tbody.innerHTML = ""; // Clear the table content
}

function checkLeadsAndDisplay() {
	const leadsTableBody = document.getElementById("leadsTableBody");
	const form = document.getElementById("form");
	const noLeadsMessage = document.getElementById("noLeadsMessage");

	if (leadsTableBody.children.length > 0) {
		form.style.display = "block";
		noLeadsMessage.style.display = "none";
	} else {
		form.style.display = "none";
		noLeadsMessage.style.display = "block";
	}
}

document
	.getElementById("allLeadsButton")
	.addEventListener("click", readAllLeads);
document
	.getElementById("newLeadsButton")
	.addEventListener("click", readNewLeads);
document
	.getElementById("acceptedLeadsButton")
	.addEventListener("click", readAcceptedLeads);
document
	.getElementById("rejectedLeadsButton")
	.addEventListener("click", readRejectedLeads);

function generateExcelData() {
	// Create a new Excel Workbook
	const wb = XLSX.utils.book_new();

	// Create an array to store the column headings from form fields
	const columnHeadings = [
		"SL NO",
		"Name",
		"Mobile Number",
		"purpose",
		"amount",
		"Date",
		"Status",
	];

	// Create a worksheet for the data
	const ws = XLSX.utils.aoa_to_sheet([columnHeadings]);

	// Extract data from the table
	const table = document.querySelector("table");
	const rows = table.querySelectorAll("tbody tr");

	// Loop through the rows and add data to the worksheet
	rows.forEach((row, rowIndex) => {
		const rowData = [];

		row.querySelectorAll("td").forEach((cell, columnIndex) => {
			if (columnIndex !== columnHeadings.indexOf("Status")) {
				rowData.push(cell.textContent);
			}
		});

		// Get the selected Status from the dropdown
		const statusSelect = row.querySelector(".status-select");
		if (statusSelect) {
			const selectedStatus = statusSelect.value;
			rowData.push(selectedStatus); // Add the selected status to the row data
		}

		// Add the row data to the worksheet
		XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: rowIndex + 1 });
	});

	// Add the worksheet to the workbook
	XLSX.utils.book_append_sheet(wb, ws, "Leads Data");

	return wb;
}

// Function to trigger download
function downloadExcel() {
	const wb = generateExcelData();
	// Generate an array buffer containing the Excel data
	const excelArrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

	// Convert the array buffer to a Blob
	const excelBlob = new Blob([excelArrayBuffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});

	// Use FileSaver.js to trigger the download
	saveAs(excelBlob, "paymentLeads_data.xlsx");
}

const downloadButton = document.getElementById("downloadExcelButton");
downloadButton.addEventListener("click", downloadExcel);

function updateTotalRecordsCount() {
	const totalRecordsCount = document.getElementById("totalRecordsCount");
	const tbody = document.getElementById("leadsTableBody");
	totalRecordsCount.textContent = 0;
	const rowCount = tbody.getElementsByTagName("tr").length-1;
	totalRecordsCount.textContent = rowCount;
}

const updateButton = document.getElementById("updateButton");
const successMessage = document.getElementById("successMessage");

updateButton.addEventListener("click", () => {
	successMessage.style.display = "block";

	setTimeout(() => {
		successMessage.style.display = "none";
	}, 3000);
});

document.addEventListener("DOMContentLoaded", async function () {
	try {
		await readAllLeads();
		//console.log("Leads fetched successfully.");
		checkLeadsAndDisplay();
		updateTotalRecordsCount();
	} catch (error) {
		//console.error("Error:", error);
	}
});
