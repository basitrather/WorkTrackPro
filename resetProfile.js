import { supabase } from "./supabase";

const currentPassword = document.querySelector(".current-password");
const newPasswordInput = document.querySelector(".new-password");
const confirmPasswordInput = document.querySelector(".confirm-password");
const resetButton = document.querySelector(".reset-btn");

const verifyUser = async function () {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword.value,
  });
  if (error) {
    console.log("error in verifyuser");
    return;
  }
};
const UpdateUserPassword = async function () {
  const { error } = await supabase.auth.updateUser({
    password: newPasswordInput.value,
  });
  //   console.log(res2);
  if (!error) {
    alert("Password updated successfully");
  }
  //   window.location.href = "profile.html";
};

resetButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (newPasswordInput.value === confirmPasswordInput.value) {
    verifyUser();
    UpdateUserPassword();
  }
});
