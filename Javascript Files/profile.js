import { supabase } from "./supabase";
(async function () {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  if (!user) {
    window.location.href = "index.html";
  }
})();
//Selectors
const userName = document.getElementById("userNameInput");
const userEmail = document.getElementById("userEmailInput");
const changePasswordLink = document.getElementById("changePasswordLink");
const logOutBtn = document.querySelector(".logout-btn");

(async function () {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  userName.value = user.identities[0].identity_data.display_name;
  userEmail.value = user.email;
})();

//Logout Function
const logOut = async function () {
  let { error } = await supabase.auth.signOut();
  window.location.href = "index.html";
};

//Reset password function
const resetPassword = async function () {
  let { data, error } = await supabase.auth.resetPasswordForEmail(
    userEmail.value,
  );
  window.location.href = "resetProfile.html";
  console.log(data);
};
changePasswordLink.addEventListener("click", function () {
  resetPassword();
});
logOutBtn.addEventListener("click", function () {
  logOut();
});
