import { supabase } from "./supabase";
import { generate } from "generate-password";
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
const ProfileContainer = document.querySelector(".profile-section");
const sideBar = document.querySelector(".sidebar-menu");
const topBar = document.querySelector(".stats");
const sideBarOpts = document.querySelectorAll("ul li");
const totaluserCount = document.querySelector(".totalusers");
const userProfilesBtn = document.querySelector(".userProfiles");
const dashBoardBtn = document.querySelector(".dashBoard");
const primaryBtn = document.querySelector(".primary-btn");
const selectBtn = document.querySelector(".new-user-role");

//Generate password Function
const generatepassword = function () {
  let generator = require("generate-password");

  let password = generator.generate({
    length: 10,
    numbers: true,
  });
  return password;
};

//Create new user Function
const createUser = async function () {
  const newUserName = document.querySelector(".new-user-name").value;
  const newEmail = document.querySelector(".new-email").value;
  // const usertype = document.
  const password = generatepassword();
  try {
    //Create new user
    let createUserRequest = await supabase.auth.signUp({
      email: newEmail,
      password: password,
      options: {
        data: {
          display_name: newUserName,
        },
      },
    });

    // Send user email for password reset
    let resetPassRequest = await supabase.auth.resetPasswordForEmail(newEmail, {
      redirectTo: "http://localhost:1234/resetPass.html",
    });

    //Add user into tables
    const addUserToTabe = await supabase
      .from("user_roles")
      .insert([
        {
          user_id: createUserRequest.data.session.user.id,
          role: selectBtn.value,
        },
      ])
      .select();
  } catch (error) {
    console.log(error);
  }
};
//Show content Function
const toggleContent = function () {
  ProfileContainer.classList.toggle("showView");
  topBar.classList.toggle("hideView");
};

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
});

userProfilesBtn.addEventListener("click", function (e) {
  toggleContent();
});
dashBoardBtn.addEventListener("click", function () {
  toggleContent();
});
primaryBtn.addEventListener("click", function (e) {
  e.preventDefault();
  // const event = e.target;
  createUser();
});
