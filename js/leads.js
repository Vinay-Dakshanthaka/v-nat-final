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
const leadsCollection = collection(totfdDocRef, "leadsData");

function populateLeadsTable(leads) {
	const tbody = document.getElementById("leadsTableBody");
	let leadCounter = 1;
	// Clear existing table rows if any
	tbody.innerHTML = "";

	// Create an array of status options for the dropdown
	const statusOptions = ["New", "Processing", "Closed", "Rejected"];

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

		const emailCell = document.createElement("td");
		emailCell.textContent = lead.email;
		row.appendChild(emailCell);

		const subjectCell = document.createElement("td");
		subjectCell.textContent = lead.subject;
		row.appendChild(subjectCell);

		const descriptionCell = document.createElement("td");
		descriptionCell.textContent = lead.comments;
		row.appendChild(descriptionCell);

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
			await updateLeadStatus(lead.ref, selectedStatus); // Update status in Firestore
		});
		statusCell.appendChild(statusSelect);
		row.appendChild(statusCell);

		row.dataset.leadRef = lead.ref.path;

		// Append the row to the table body
		tbody.appendChild(row);
		console.log(lead);
		leadCounter++;
	});
}

async function updateLeadStatus(leadRef, newStatus) {
	try {
		await updateDoc(leadRef, { status: newStatus });
		console.log("Status updated successfully");
	} catch (error) {
		console.error("Error updating status:", error);
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
		console.error("Error fetching leads:", error);
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
		console.error("Error fetching new leads:", error);
	}
}

// Function to fetch and display leads with status "Processing"
async function readProcessingLeads() {
	try {
		clearLeadsTable();
		const leadsQuery = query(
			leadsCollection,
			where("status", "==", "Processing")
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
		console.error("Error fetching processing leads:", error);
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
		console.error("Error fetching rejected leads:", error);
	}
}

// Function to fetch and display leads with status "Closed"
async function readClosedLeads() {
	try {
		clearLeadsTable();
		const leadsQuery = query(leadsCollection, where("status", "==", "Closed"));
		const leads = await getDocs(leadsQuery);
		const leadsData = leads.docs.map((doc) => ({
			...doc.data(),
			ref: doc.ref,
		}));

		console.log("Number of closed leads:", leadsData.length); // Debugging statement

		await populateLeadsTable(leadsData);
		checkLeadsAndDisplay();
		updateTotalRecordsCount();

		return leadsData;
	} catch (error) {
		console.error("Error fetching closed leads:", error);
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
		console.log(fromDate);

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
		console.error("Error fetching leads in date range:", error);
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
	.getElementById("processingLeadsButton")
	.addEventListener("click", readProcessingLeads);
document
	.getElementById("rejectedLeadsButton")
	.addEventListener("click", readRejectedLeads);
document
	.getElementById("closedLeadsButton")
	.addEventListener("click", readClosedLeads);

function generateExcelData() {
	// Create a new Excel Workbook
	const wb = XLSX.utils.book_new();

	// Create an array to store the column headings from form fields
	const columnHeadings = [
		"SL NO",
		"Name",
		"Mobile Number",
		"Email",
		"Subject",
		"Description",
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
	saveAs(excelBlob, "leads_data.xlsx");
}

const downloadButton = document.getElementById("downloadExcelButton");
downloadButton.addEventListener("click", downloadExcel);

function updateTotalRecordsCount() {
	const totalRecordsCount = document.getElementById("totalRecordsCount");
	const tbody = document.getElementById("leadsTableBody");
	totalRecordsCount.textContent = 0;
	const rowCount = tbody.getElementsByTagName("tr").length;
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
		console.log("Leads fetched successfully.");
		checkLeadsAndDisplay();
		updateTotalRecordsCount();
	} catch (error) {
		console.error("Error:", error);
	}
});
