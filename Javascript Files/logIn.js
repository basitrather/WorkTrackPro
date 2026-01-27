import { supabase } from "./supabase";
// document.addEventListener("load", called);
(async function () {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    window.location.href = "profile.html";
  }
})();
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
  if (emailInput.value === "") {
    errorMsg.textContent = "Please enter the email first";
    return;
  }
  const userEmail = emailInput.value;
  forgotPassword(userEmail);
});

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const userEmail = emailInput.value;
  const userPassword = passwordInput.value;
  errorMsg.textContent = "";
  login(userEmail, userPassword);
});

emailInput.addEventListener("click", function () {
  errorMsg.textContent = "";
});
