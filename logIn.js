import { supabase } from "./supabase";

//Selectors
const loginForm = document.getElementById("loginForm");
const emailInput = loginForm.querySelector('input[type="email"]');
const passwordInput = loginForm.querySelector('input[type="password"]');
const submitBtn = loginForm.querySelector(".submit");

//Login function
const login = async function (email, password) {
  try {
    let response = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(response);
    if (response.data.user) {
      window.location.href = "profile.html";
    }
  } catch {
  } finally {
  }
};

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const userEmail = emailInput.value;
  const userPassword = passwordInput.value;
  login(userEmail, userPassword);
});
