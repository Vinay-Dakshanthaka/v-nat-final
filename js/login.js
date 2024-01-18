import {
	getAuth,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-auth.js";
import { app } from "../js/firebase-config.js";

const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
	function togglePasswordVisibility() {
		const passwordInput = document.getElementById("password");
		const passwordToggle = document.getElementById("passwordToggle");

		if (passwordInput.type === "password") {
			passwordInput.type = "text";
			passwordToggle.classList.remove("fa-eye");
			passwordToggle.classList.add("fa-eye-slash");
		} else {
			passwordInput.type = "password";
			passwordToggle.classList.remove("fa-eye-slash");
			passwordToggle.classList.add("fa-eye");
		}
	}

	const passwordToggle = document.getElementById("passwordToggle");
	if (passwordToggle) {
		passwordToggle.addEventListener("click", togglePasswordVisibility);
	}

	function saveLoginCredentials(email) {
		localStorage.setItem("rememberedEmail", email);
	}

	function getRememberedCredentials() {
		const rememberedEmail = localStorage.getItem("rememberedEmail");
		if (rememberedEmail) {
			document.getElementById("email").value = rememberedEmail;
			document.getElementById("rememberMe").checked = true;
		}
		1;
	}

	function rememberMe() {
		if (document.getElementById("rememberMe").checked) {
			const email = document.getElementById("email").value;
			saveLoginCredentials(email);
		} else {
			localStorage.removeItem("rememberedEmail");
		}
	}

	getRememberedCredentials();

	function detectUserRole() {
		window.location.href = "././content-edit.html";
		window.history.replaceState({}, "", "././content-edit.html");
	}

	async function loginUser(email, password) {
		signInWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				document.querySelector("#sub_btn").textContent = "Submit";
				//console.log("login sucess");
				rememberMe();
				const user = userCredential.user;
				const loginForm = document.getElementById("loginForm");
				loginForm.reset();
				document.querySelector("#sub_btn").disabled = false;
				sessionStorage.setItem("loggedIn", "true");
				detectUserRole();
			})
			.catch((error) => {
				const authError = document.getElementById("loginError");
				console.error(error);

				if (error.code && error.code.startsWith("auth/")) {
					const errorCode = error.code.split("/")[1];
					if (errorCode === "wrong-password") {
						authError.textContent = `Bad Credentials`;
					} else if (errorCode === "missing-password")
						authError.textContent = `Bad Credentials`;
					else
						authError.innerHTML =
							errorCode.split("-").join(" ") +
							"<br>" +
							error.message.match(/Firebase:(.*)\(auth\/.*\)/)[1];
				} else {
					authError.textContent = "An error occurred. Please try again later.";
				}
				authError.style.display = "block";

				document.querySelector("#sub_btn").disabled = false;
				document.querySelector("#sub_btn").textContent = "Submit";
			});
	}

	function showLoginForm() {
		const loginForm = document.getElementById("loginForm");
		const forgotPasswordForm = document.getElementById("forgotPasswordForm");

		loginForm.style.display = "block";
		forgotPasswordForm.style.display = "none";
	}

	const backToLoginButton = document.getElementById("backToLoginButton");
	backToLoginButton.addEventListener("click", (e) => {
		e.preventDefault();
		showLoginForm();
	});

	//login Form find
	const loginForm = document.getElementById("formContainer");
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();
		document.querySelector("#sub_btn").disabled = true;
		document.querySelector("#sub_btn").textContent = "Logging in ...";
		// console.log("inside loginformevent")
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;

		loginUser(email, password);
	});

	function showForgotPasswordForm() {
		const loginForm = document.getElementById("loginForm");
		const forgotPasswordForm = document.getElementById("forgotPasswordForm");

		loginForm.style.display = "none";
		forgotPasswordForm.style.display = "block";
	}

	const forgotPasswordLink = document.getElementById("forgotPasswordLink");
	forgotPasswordLink.addEventListener("click", (e) => {
		e.preventDefault();
		showForgotPasswordForm();
	});

	const forgotPasswordSubmitButton = document.getElementById(
		"forgotPasswordSubmit"
	);
	forgotPasswordSubmitButton.addEventListener("click", (e) => {
		e.preventDefault();
		forgotPasswordSubmitButton.textContent = "Sending Link ...";
		forgotPasswordSubmitButton.disabled = true;
		const forgotEmail = document.getElementById("forgotEmail").value;
		sendPasswordResetEmail(auth, forgotEmail)
			.then(() => {
				forgotPasswordSubmitButton.textContent = "Link sent";
				forgotPasswordSubmitButton.disabled = false;

				document.getElementById("forgotEmail").value = "";
			})
			.catch((error) => {
				displayMessage("Please enter your registered email!", "danger");

				forgotPasswordSubmitButton.textContent = "Submit";
				forgotPasswordSubmitButton.disabled = false;
				document.getElementById("forgotEmail").value = "";
			});
	});
});
