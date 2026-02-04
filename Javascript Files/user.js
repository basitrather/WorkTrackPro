import { supabase } from "./supabase";
(async function () {
  //Get currentlogged in user details
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id);
  totalTaksQauntity.textContent = tasks.length;
})();

const totalTaksQauntity = document.querySelector("#total-taks");
const logOutBtn = document.querySelector(".logout-btn");
const taskContainer = document.querySelector(".task-list");
const taskNotesContainer = document.querySelector(".task-list-section");

const getUploadedFiles = async function (taskId) {
  try {
    // get Task details by task Id
    const { data: files } = await supabase
      .from("user_submitted_files")
      .select("*")
      .eq("task_id", taskId);
    const file = files[0];

    // Get image using signedUrl method
    const { data } = await supabase.storage
      .from("user_submitted_files")
      .createSignedUrl(file.file_path, 3600);
    console.log(data.signedUrl);

    // Get image using blob method
    // const { data: blob } = await supabase.storage
    //   .from("user_submitted_files")
    //   .download(file.file_path);
    // const url = URL.createObjectURL(blob);
  } catch (error) {
    console.error(error);
  }
};

const uploadProof = async function (file, taskId) {
  const selectedFile = file[0];
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const safeFileName = selectedFile.name
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/g, "");

    const filePath = `${user.id}/${Date.now()}_${safeFileName}`;

    const { data, error } = await supabase.storage
      .from("user_submitted_files")
      .upload(filePath, selectedFile);

    if (error) {
      console.error(error);
      alert("Upload failed");
      return;
    }

    const task_return = await supabase
      .from("user_submitted_files")
      .insert({
        task_id: taskId,
        file_path: filePath,
        uploaded_by: user.id,
      })
      .select();

    const proofStatusUpload = await supabase
      .from("tasks")
      .update({ proof_uploaded: "yes" })
      .eq("id", taskId)
      .select();
    console.log(proofStatusUpload);
    // getUploadedFiles(taskId, task_return.data[0].file_path);
    return "true";
  } catch (error) {
    console.error(error);
  }
};

const getCompletedBtnStatus = function (task) {
  if (
    task.status === "in-progress" ||
    task.status === "on-hold" ||
    task.status === "pending"
  )
    return "Mark Completed";
  if (task.status === "completed") return "Completed";
};

const getStartBtnStatus = function (task) {
  if (task.status === "in-progress") return "Hold Task";

  if (task.status === "on-hold" || task.status === "pending")
    return "Start Task";

  if (task.status === "completed") return "Completed";
};

const changeStatus = async function (status, id) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ status: status.textContent.toLowerCase() })
    .eq("id", id)
    .select();
};
const readableTimeConvert = function formatTimestamp(ts) {
  return new Date(ts)
    .toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "");
};

const displayNote = function (note, noteParent, noteInput) {
  noteParent.insertAdjacentHTML(
    "beforeend",
    `<div class="note">
      <strong>${note.data[0].username}</strong>
      <span>${readableTimeConvert(new Date().toISOString())}</span>
      <p>${noteInput}</p>
    </div>`,
  );
};

const addNote = async function (noteInput, id, noteElement) {
  const { data, error } = await supabase
    .from("tasks")
    .select("notes")
    .eq("id", id)
    .single();

  const newNote = {
    note: noteInput,
    created_at: new Date().toISOString(),
  };

  const updatedNotes = [...(data.notes || []), newNote];
  const createdNote = await supabase
    .from("tasks")
    .update({ notes: updatedNotes })
    .eq("id", id)
    .select();
  displayNote(createdNote, noteElement, noteInput);
};

const createTaskHTML = function (task) {
  taskContainer.insertAdjacentHTML(
    "beforeend",
    `<div class="task-card" data-task-id="${task.id}">
                <div class="task-header">
                  <h3>${task.title}</h3>
                  <div class="badges">
                    <span class="priority high">${task.priority}</span>
                    <span class="status pending">${task.status}</span>
                  </div>
                </div>

                <p class="task-desc">
                  ${task.description}
                </p>

                <div class="assigned-user">
                  🧑‍💼 Assigned By: <strong>${task.created_by}</strong>
                </div>

                <!-- Status Actions -->
                <div class="task-actions">
                 ${task.status !== "completed" ? `<button class="status-btn start-btn" ${task.status !== "completed" ? "" : "disabled"}>${getStartBtnStatus(task)}</button>` : ""}
                  <button class="status-btn complete-btn" ${task.status !== "in-progress" ? "disabled" : ""}>
                    ${getCompletedBtnStatus(task)}
                  </button>
                </div>

                <div class="task-notes">
                  <h4>Notes</h4>

                  <div class="notes-list">
${task.notes
  .map(
    (element, index) => `
  <div class="note">
    <strong>${task.username}</strong>
    <span>${readableTimeConvert(element.created_at)}</span>
    <p>${element.note}</p>
  </div>
`,
  )
  .join("")}

                  </div>
                  
                  <textarea
                    class="note-input"
                    placeholder="Add a note..."
                  ></textarea>

                  <button class="add-note-btn">Add Note</button>
                </div>

                <div class="task-files">
                  <label class="upload-btn ${task.proof_uploaded === "yes" && task.status === "completed" ? "disabled" : ""}">
                    Upload Proof
                    <input class="file-upload-btn" type="file" multiple hidden ${task.proof_uploaded === "yes" && task.status === "completed" ? "disabled" : ""}/>
                  </label>
                </div>
     </div>`,
  );
};
// Display tasks function
const displayTask = async function (params) {
  //Get currentlogged in user details
  const {
    data: { user },
  } = await supabase.auth.getUser();

  //   Get currentuser Tasks
  let { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id);
  tasks.forEach((element) => {
    createTaskHTML(element);
  });
};
displayTask();

//LogoutUser function
const logOut = async function () {
  let { error } = await supabase.auth.signOut();
  window.location.href = "index.html";
};

logOutBtn.addEventListener("click", function () {
  logOut();
});
taskNotesContainer.addEventListener("click", function (e) {
  const taskCard = e.target.closest(".task-card");
  if (!taskCard) return;
  const input = taskCard.querySelector(".note-input").value;
  const taskNotes = taskCard.querySelector(".notes-list");
  const taskId = taskCard.dataset.taskId;
  const addNoteBtn = e.target.closest(".add-note-btn");
  const statustBtn = e.target.closest(".status-btn");
  const taskCompletedBtn = e.target.closest(".complete-btn");
  const taskComplete = taskCard.querySelector(".complete-btn");
  const status = taskCard.querySelector(".status-btn");
  const currentStatus = taskCard.querySelector(".status");

  if (addNoteBtn) addNote(input, taskId, taskNotes);

  if (statustBtn && statustBtn.textContent === "Start Task") {
    currentStatus.textContent = "in-progress";
    status.textContent = "Hold Task";
    taskComplete.disabled = false;
    changeStatus(currentStatus, taskId);
    return;
  }

  if (statustBtn && statustBtn.textContent === "Hold Task") {
    currentStatus.textContent = "on-hold";
    status.textContent = "Start Task";
    taskComplete.disabled = true;
    changeStatus(currentStatus, taskId);
    return;
  }

  if (taskCompletedBtn) {
    status.textContent = "Completed";
    status.disabled = true;
    currentStatus.textContent = "Completed";
    taskComplete.remove();
    changeStatus(currentStatus, taskId);
    return;
  }
});

taskNotesContainer.addEventListener("change", async function (e) {
  if (!e.target.classList.contains("file-upload-btn")) return;
  const taskCard = e.target.closest(".task-card");
  const taskId = taskCard.dataset.taskId;
  const files = e.target.files;
  const fileBtn = taskCard.querySelector(".file-upload-btn");
  const fileLabel = taskCard.querySelector(".upload-btn");
  const currentStatus = taskCard.querySelector(".status");
  uploadProof(files, taskId);
  fileBtn.disabled = true;
  fileLabel.classList.add("disabled");
});
