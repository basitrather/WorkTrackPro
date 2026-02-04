import { emit, title } from "process";
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
const optionsBox = document.querySelector("#userSelect .options");
const selectBox = document.querySelector("#userSelect .select-box");
(async function () {
  let { data: user_roles, error } = await supabase
    .from("user_roles")
    .select("*");
  // create checkboxes dynamically
  user_roles.forEach((user) => {
    if (user.role === "admin") return;
    const label = document.createElement("label");
    label.innerHTML = `
    <input type="checkbox" value="${user.user_id}">
    ${user.display_name}
  `;
    optionsBox.appendChild(label);
  });

  // toggle dropdown
  selectBox.addEventListener("click", () => {
    document.getElementById("userSelect").classList.toggle("open");
  });
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
const createUserSection = document.querySelector(".user-management");
const displayUsersContainer = document.querySelector(".user-box");
const searchBar = document.querySelector(".searchBar");
const sortBtn = document.querySelector(".sort");
const modalWindowContainer = document.querySelector(".modal-overlay");
const modalWindowCloseBtn = document.querySelector(".modal-close");
const modalWindowCloseBtn2 = document.querySelector(".secondary-btn");
const updateBtn = document.querySelector(".update-btn");
const editProfileBtn = document.querySelector(".edit-btn");
const updateProfileBtn = document.querySelector(".editProfile-primary-btn");
const exitProfileBtn = document.querySelector(".editProfile-secondary-btn");
const editModalWindow = document.querySelector(".editProfileModalWindow");
const editProfileNameField = document.querySelector(".edit-profile-name");
const editProfileEmailField = document.querySelector(".edit-profile-email");
const editProfilePicture = document.querySelector(".editProfile-picture-btn");
const TaskCreationContainer = document.querySelector(".task-create-section");
const taskSectionBtn = document.querySelector(".tasks");
const totalUsers = document.querySelector(".totalUsers");
const createTaskBtn = document.querySelector(".task-create-btn");
const taskListContainer = document.querySelector(".task-list");
let selectedEmail = "";

// get selected users upon selecting Function
function getSelectedUsers() {
  return [...optionsBox.querySelectorAll("input:checked")].map(
    (cb) => cb.value,
  );
}

// Create Tasks dynamically function
const createTaskHTML = function (task) {
  if (
    new Date().toISOString().split("T")[0] > task.due_date &&
    task.status !== "completed"
  ) {
    task.status = "overdue";
  }
  taskListContainer.insertAdjacentHTML(
    "beforeend",
    `<div class="task-card">
      <div class="task-header">
        <h3>${task.title}</h3>

        <div class="badges">
          <span class="priority ${task.priority}">${task.priority}</span>
          <span class="status ${task.status}">
            ${task.status}
          </span>
        </div>
      </div>
      <p class="task-desc">${task.description}</p>
      <div class="assigned-user">
        👤 Assigned To: <strong>${task.username}</strong>
      </div>
      <div class="task-meta">
        <span>🧑‍💼 Assigned By: ${task.created_by}</span>
        <span>📅 Due: ${task.due_date}</span>
        <span>⏰ Due: ${task.due_time}</span>
      </div>
    </div>`,
  );
};

// Display tasks function
const displayTasks = async function (params) {
  if (params) {
    createTaskHTML(params);
    return;
  }
  //Get task details
  let { data: tasks } = await supabase.from("tasks").select("*");
  tasks.forEach((element) => {
    createTaskHTML(element);
  });
};
displayTasks();

const multipleTaskCreation = async function (user, admin) {
  const taskTitle = document.querySelector(".taskTitle").value;
  const taskDescription = document.querySelector(".taskDescription").value;
  const taskDueDate = document.querySelector(".taskDueDate").value;
  const taskDueTime = document.querySelector(".taskDueTime").value;
  const taskPriority = document.querySelector(".taskPriority").value;
  const taskCatagory = document.querySelector(".taskCatagory").value;
  try {
    //To get user display Name
    let { data } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", user);

    //insert task into the tasks row
    const task = await supabase
      .from("tasks")
      .insert({
        user_id: user,
        title: taskTitle,
        description: taskDescription,
        due_date: taskDueDate,
        due_time: taskDueTime,
        priority: taskPriority,
        Category: taskCatagory,
        created_by: admin[0].display_name,
        created_at: new Date().toISOString(),
        username: data[0].display_name,
      })
      .select();
    //Display tasks after creating
    displayTasks(task.data[0]);
  } catch (error) {
    console.error(error);
  }
};
//Create task function
const createTask = async function (params) {
  try {
    //Task Assigner
    const currentLoggedInUser = await supabase.auth.getUser();
    let { data: user_roles } = await supabase
      .from("user_roles")
      .select("display_name")
      .eq(
        "display_name",
        currentLoggedInUser.data.user.identities[0].identity_data.display_name,
      );
    const selectedUsers = getSelectedUsers();
    selectedUsers.forEach((element) => {
      multipleTaskCreation(element, user_roles);
    });
  } catch (error) {
    console.error(error);
  }
};

//User activate/deActivate function
const activateDecactivate = async function (currentStatus, selectedEmail) {
  const isActive = currentStatus.classList.toggle("active");
  currentStatus.textContent = isActive ? "Activated" : "Deactivated";
  currentStatus.dataset.active = isActive;
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .update({ status: currentStatus.textContent.toLowerCase() })
      .eq("email", selectedEmail.textContent)
      .select();
  } catch (error) {
    console.error(error);
  }
};

// Edit profile for user function
const editProfile = async function (newName, newEmail) {
  console.log(newName, newEmail);
  try {
    // Get userData
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
    // Update user data in auth
    const updateUserAuth = await supabase.auth.updateUser({
      email: newEmail,
      data: { display_name: newName },
    });
    console.log(updateUserAuth);
    //Update user data in table
    const { data, error } = await supabase
      .from("user_roles")
      .update({ display_name: newName, email: newEmail })
      .eq("user_id", user.id)
      .select();
    console.log(data, error);
  } catch (error) {
    console.error(error);
  }
};

//Edit user Function
const editUser = async function (user) {
  const updatedUsername = document.querySelector(".edit-user-name").value;
  const updatedEmail = document.querySelector(".edit-user-email").value;
  const updatedRole = document.querySelector(".edit-user-role").value;
  try {
    if (updatedUsername) {
      const res1 = await supabase
        .from("user_roles")
        .update({
          display_name: updatedUsername,
        })
        .eq("email", user.textContent)
        .select();
    }
    if (updatedEmail) {
      const res2 = await supabase
        .from("user_roles")
        .update({
          email: updatedEmail,
        })
        .eq("email", user.textContent)
        .select();
    }
    if (updatedRole) {
      const res3 = await supabase
        .from("user_roles")
        .update({
          role: updatedRole,
        })
        .eq("email", user.textContent)
        .select();
    }
    let { data: user_roles, error } = await supabase
      .from("user_roles")
      .select("*");
    displayUsersContainer.replaceChildren();
    user_roles.forEach((user) => {
      createUserHTML(user);
    });
  } catch (error) {
    console.error(error);
  }
};

// Create user HTML Function
const createUserHTML = function (user) {
  if (user.role === "admin") return;
  //Render the users in user list
  displayUsersContainer.insertAdjacentHTML(
    "beforeend",
    `<div class="user-box user-row">
     <span class="user-name">${user.display_name}</span>
     <span class="contact-info">${user.email}</span>
    <button 
       class="toggle-btn status ${user.status === "activated" ? "active" : ""}" 
       data-active="${user.status === "active"}">${user.status === "activated" ? "Activated" : "Deactivated"}</button>
     <span class="acc-creation-date">${user.created_at}</span>
     <span class="user-role">${user.role}</span>
     <span class="edit-user" style="color: #007bff; cursor:pointer">Edit</span>
   </div>`,
  );
};
//Sort Array
const sortByNameAsc = (userArray, sortUsersBy) => {
  return [...userArray].sort((a, b) =>
    a[sortUsersBy].localeCompare(b[sortUsersBy]),
  );
};

//Display Sorted Users Function
const sortUsers = async function (sortby) {
  try {
    let { data: user_roles, error } = await supabase
      .from("user_roles")
      .select("*");
    // Clear already displayed users
    displayUsersContainer.replaceChildren();

    //Sort by date
    if (sortby === "created_at") {
      const sortByDateAsc = (arr, key) => {
        return [...arr].sort((a, b) => {
          const timeA = Date.parse(a[key]); // safe for YYYY-MM-DD
          const timeB = Date.parse(b[key]);
          return timeA - timeB;
        });
      };
      const sortedUsersbyDate = sortByDateAsc(user_roles, sortby);
      sortedUsersbyDate.forEach((element) => {
        createUserHTML(element);
      });
      return;
    }

    //Sort by name,role,status
    const sortedUsers = sortByNameAsc(user_roles, sortby.toLowerCase());
    sortedUsers.forEach((element) => {
      createUserHTML(element);
    });
  } catch {}
};

//Display users to dashboard admin panel
const displayUsers = async function (params) {
  // totalUsers.innerHTML = "";
  if (params) {
    createUserHTML(params);
    return;
  }
  //Get task details

  let { data: tasks } = await supabase.from("tasks").select("*");

  //Get user details
  let { data: user_roles, error } = await supabase
    .from("user_roles")
    .select("*");

  //Sort by given value
  const sortedUsers = sortByNameAsc(user_roles, "display_name");
  sortedUsers.forEach((element) => {
    createUserHTML(element);
  });
  sortUsers(sortBtn.value);
};
displayUsers();

//FilterUser
const filterUser = async function (search) {
  try {
    let { data: user_roles, error } = await supabase
      .from("user_roles")
      .select("*");
    if (!search) return;
    displayUsersContainer.replaceChildren();
    user_roles.forEach((user) => {
      if (user.display_name.toLowerCase() == search) {
        displayUsers(user);
      }
      if (user.email == search) {
        displayUsers(user);
      }
      if (user.role == search) {
        displayUsers(user);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
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
    console.log(createUserRequest);
    // Send user email for password reset
    let resetPassRequest = await supabase.auth.resetPasswordForEmail(newEmail, {
      redirectTo: "http://localhost:1234/resetPass.html",
    });
    console.log(createUserRequest.data.user.created_at);
    //Add user into tables
    const addUserToTabe = await supabase
      .from("user_roles")
      .insert([
        {
          user_id: createUserRequest.data.session.user.id,
          role: selectBtn.value,
          display_name: newUserName,
          email: newEmail,
          created_at: createUserRequest.data.user.created_at,
        },
      ])
      .select();
    displayUsers(addUserToTabe.data[0]);
    sortUsers(sortBtn.value);
  } catch (error) {
    console.log(error);
  }
};

//Show/Hide dashboard content
const toggleContent = function () {
  ProfileContainer.classList.toggle("hideView");
  topBar.classList.toggle("hideView");
  createUserSection.classList.toggle("hideView");
  TaskCreationContainer.classList.toggle("active");
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

//Eventlistners
changePasswordLink.addEventListener("click", function () {
  resetPassword();
});

logOutBtn.addEventListener("click", function () {
  logOut();
});

// sideBar.addEventListener("click", function (e) {
//   const btnClicked = e.target.closest("li");

//   if (!btnClicked) return;
//   sideBarOpts.forEach((li) => {
//     if (li !== btnClicked) {
//       li.classList.remove("active");
//     }
//   });
//   btnClicked.classList.add("active");
// });

// userProfilesBtn.addEventListener("click", function (e) {
//   toggleContent();
// });

// dashBoardBtn.addEventListener("click", function () {
//   toggleContent();
// });
// taskSectionBtn.addEventListener("click", function () {
//   toggleContent();
// });

primaryBtn.addEventListener("click", function (e) {
  e.preventDefault();
  createUser();
});
searchBar.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const findUser = searchBar.value;
    filterUser(findUser);
  }
});
searchBar.addEventListener("input", () => {
  if (searchBar.value === "") {
    displayUsers();
    displayUsersContainer.replaceChildren();
  }
});
sortBtn.addEventListener("change", function (e) {
  sortUsers(sortBtn.value);
});
displayUsersContainer.addEventListener("click", function (e) {
  const selectedEditBtn = e.target.closest(".edit-user");
  const selectedRow = e.target.closest(".user-row");
  const statusSelect = e.target.closest(".toggle-btn");
  selectedEmail = selectedRow.querySelector(".contact-info");
  if (statusSelect) activateDecactivate(statusSelect, selectedEmail);
  if (selectedEditBtn)
    modalWindowContainer.classList.add("toggle-modal-overlay");
});
modalWindowCloseBtn.addEventListener("click", function () {
  modalWindowContainer.classList.remove("toggle-modal-overlay");
});
modalWindowCloseBtn2.addEventListener("click", function () {
  modalWindowContainer.classList.remove("toggle-modal-overlay");
});
updateBtn.addEventListener("click", function () {
  editUser(selectedEmail);
});
editProfileBtn.addEventListener("click", function () {
  editModalWindow.classList.add("active");
});
exitProfileBtn.addEventListener("click", function () {
  editModalWindow.classList.remove("active");
});
updateProfileBtn.addEventListener("click", function () {
  if (!editProfileNameField.value && !editProfileEmailField.value) return;
  editProfile(editProfileNameField.value, editProfileEmailField.value);
});
createTaskBtn.addEventListener("click", function (e) {
  e.preventDefault();
  createTask();
});
