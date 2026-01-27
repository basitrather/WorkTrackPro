import { supabase } from "./supabase";

//IFIE functions
(async function () {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "index.html";
  }
})();
(async function () {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  userName.value = user.identities[0].identity_data.display_name;
  navUserName.textContent = user.identities[0].identity_data.display_name;
  userEmail.value = user.email;
})();
(async function () {
  let { data: user_roles, error } = await supabase
    .from("user_roles")
    .select("*");
  totaluserCount.textContent = user_roles.length;
})();

//Selectors
const userName = document.getElementById("userNameInput");
const userEmail = document.getElementById("userEmailInput");
const changePasswordLink = document.getElementById("changePasswordLink");
const logOutBtn = document.querySelector(".logout-btn");
const navUserName = document.querySelector(".nav-user-name");
const ProfileSection = document.querySelector(".profile-section");
const sideBar = document.querySelector(".sidebar-menu");
const topBar = document.querySelector(".stats");
const sideBarOpts = document.querySelectorAll("ul li");
const totaluserCount = document.querySelector(".totalusers");

//Show content Function
const showContent = function (event) {};

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
};

changePasswordLink.addEventListener("click", function () {
  resetPassword();
});
logOutBtn.addEventListener("click", function () {
  logOut();
});

sideBar.addEventListener("click", function (e) {
  const btnClicked = e.target.closest("li");

  if (!btnClicked) return;
  sideBarOpts.forEach((li) => {
    if (li !== btnClicked) {
      li.classList.remove("active");
    }
  });
  btnClicked.classList.add("active");
  showContent(btnClicked);
});
