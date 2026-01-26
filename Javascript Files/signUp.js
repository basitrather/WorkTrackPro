import { supabase } from "./supabase";
// Selectors of signup page
const signupForm = document.getElementById("signupForm");
const fullNameInput = signupForm.querySelector('input[type="text"]');
const emailInput = signupForm.querySelector('input[type="email"]');
const passwordInput = signupForm.querySelectorAll('input[type="password"]')[0];
const confirmPasswordInput = signupForm.querySelectorAll(
  'input[type="password"]',
)[1];
const submitBtn = signupForm.querySelector(".submit");

//Function for error message
const errorMsg = function (Msg) {
  document.querySelector(".msg").textContent = Msg;
  console.log("errormsg");
  return;
};
const signUp = async (name, email, pass) => {
  submitBtn.disabled = true;
  submitBtn.classList.add("notAllow");
  try {
    // Send request to supabase for creating user
    let response = await supabase.auth.signUp({
      email: email,
      password: pass,
      options: {
        data: {
          display_name: name,
        },
      },
    });
    console.log(response);
    //To generate error messege on DOM
    if (
      response.error?.code === "user_already_exists" &&
      response.error?.status === 422
    )
      errorMsg("User already exists");

    //Redirect user to Login Page
    if (response.data.user) {
      window.location.href = "index.html";
    }
    // Insert rows in tables
    const create = await supabase
      .from("user_roles")
      .insert([{ user_id: response.data.session.user.id }])
      .select();
  } catch (error) {
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("notAllow");
  }
};

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const userFullName = fullNameInput.value;
  const userEmail = emailInput.value;
  const userPassword = passwordInput.value;
  if (userPassword !== confirmPasswordInput.value) {
    errorMsg("Passwords doesn't match");
    return;
  }
  signUp(userFullName, userEmail, userPassword);
});
