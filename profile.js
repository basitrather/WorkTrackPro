import { supabase } from "./supabase";
//Selectors
const profileContainer = document.querySelector(".profile-container");
const profileTitle = document.getElementById("profileTitle");

const userName = document.getElementById("userNameInput");
const userEmail = document.getElementById("userEmailInput");

const changePasswordLink = document.getElementById("changePasswordLink");
const passwordHint = document.getElementById("passwordHint");

(async function () {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  userName.value = user.identities[0].identity_data.display_name;
  userEmail.value = user.email;
})();

const resetPassword = async function () {
  // let { data, error } = await supabase.auth.resetPasswordForEmail(
  //   userEmail.value,
  // );
  window.location.href = "resetProfile.html";
  console.log(data);
};
changePasswordLink.addEventListener("click", function () {
  resetPassword();
});
