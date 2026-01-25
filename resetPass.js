import { supabase } from "./supabase";
const resetContainer = document.querySelector(".reset-container");
const newPasswordInput = document.querySelector(
  '.reset-field input[type="password"]',
);
const confirmPasswordInput = document.querySelectorAll(
  '.reset-field input[type="password"]',
)[1];
const resetButton = document.querySelector(".reset-btn");

const UpdateUserPassword = async function () {
  const { data, error } = await supabase.auth.updateUser({
    password: newPasswordInput.value,
  });
  window.location.href = "login.html";
  console.log(data.user.email);
};

resetButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (newPasswordInput.value === confirmPasswordInput.value) {
    UpdateUserPassword();
  }
});
