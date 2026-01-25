import { supabase } from "./supabase";

//Selectors
const loginForm = document.getElementById("loginForm");
const emailInput = loginForm.querySelector('input[type="email"]');
const passwordInput = loginForm.querySelector('input[type="password"]');
const forgotPasswordBtn = document.querySelector(".forgot-password");
const errorMsg = document.querySelector(".Msg");

// Forgotten password
const forgotPassword = async function (email) {
  let { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:1234/resetPass.html",
  });
  document.querySelector(".Msg").textContent =
    "Reset link is sent to your email.";
};

//Login function
const login = async function (email, password) {
  try {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log("before");
    if (error?.code === "invalid_credentials") {
      errorMsg.textContent = "Invalid credentials. Try again!";
      return;
    }
    console.log("after");
    if (data.user) {
      window.location.href = "profile.html";
    }
  } catch (error) {
  } finally {
  }
};

forgotPasswordBtn.addEventListener("click", function () {
  const userEmail = emailInput.value;
  forgotPassword(userEmail);
});

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  errorMsg.textContent = "";
  const userEmail = emailInput.value;
  const userPassword = passwordInput.value;
  login(userEmail, userPassword);
});
