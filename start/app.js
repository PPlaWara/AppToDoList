"use strict";

const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

document.addEventListener("DOMContentLoaded", loadTasks);

taskForm.addEventListener("submit", addTask);
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask(e) {
  e.preventDefault();

  // Get input values
  const topic = document.getElementById("task-topic").value;
  const description = document.getElementById("task-desc").value;
  const dateTime = document.getElementById("task-date").value;
  const type = document.getElementById("task-type").value;

  // Validate inputs
  if (!topic || !description || !dateTime || !type) {
    alert("Please fill in all fields!");
    return;
  }

  // Create a new task object
  const task = {
    id: Date.now(),
    topic,
    description,
    dateTime,
    type,
  };

  tasks.push(task);
  renderTask(task);
  taskForm.reset();

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  tasks.forEach((task) => renderTask(task));
}

function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = task.id;

  li.innerHTML = `
    <h3>${task.topic}</h3>
    <p><strong>Description:</strong> ${task.description}</p>
    <p><strong>Date and Time:</strong> ${new Date(
      task.dateTime
    ).toLocaleString()}</p
    <p><strong>Type:</strong> ${task.type}</p>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  `;
  li.querySelector(".edit-btn").addEventListener("click", () =>
    editTask(task, li)
  );

  taskList.appendChild(li);
}

function editTask(task, taskElement) {
  taskElement.innerHTML = `
    <form class="edit-form">
    <h3>Topic:
      <input type="text" name="topic" value="${task.topic}" required /> </h3>
      <p><strong>Description: <input type="text" name="description" value="${
        task.description
      }"required /></strong><br>
      <p><strong>Date and Time: <input type="datetime-local" name="dateTime" value="${
        task.dateTime
      }" required /></strong><br>
      <p><strong>Type: <select name="type">
        <option value="Meeting" ${
          task.type === "Meeting" ? "selected" : ""
        }>Meeting</option>
        <option value="Task" ${
          task.type === "Task" ? "selected" : ""
        }>Task</option>
        <option value="Event" ${
          task.type === "Event" ? "selected" : ""
        }>Event</option></strong> 
      </select><br>
      <br />
      <button type="submit">Save</button>
      <button type="button" class="cancel-btn">Cancel</button>
    </form>
  `;

  const editForm = taskElement.querySelector(".edit-form");
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Update task with new values
    task.topic = editForm.topic.value;
    task.description = editForm.description.value;
    task.dateTime = editForm.dateTime.value;
    task.type = editForm.type.value;

    // Update task
    const taskUpdate = tasks.findIndex((t) => t.id === task.id);
    tasks[taskUpdate] = task;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Re-render the task
    taskElement.innerHTML = "";
    renderTask(task);
    location.reload();
  });

  // cancel button
  taskElement.querySelector(".cancel-btn").addEventListener("click", () => {
    taskElement.innerHTML = "";
    renderTask(task);
    location.reload();
  });
}

const filterType = document.getElementById("filter-type");
const filterDate = document.getElementById("filter-date");

filterType.addEventListener("change", filterTasks);
filterDate.addEventListener("change", filterTasks);

function filterTasks() {
  // Clear current task list
  taskList.innerHTML = "";

  // Get filter values
  const selectedType = filterType.value;
  const selectedDate = filterDate.value;

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    const isTypeMatch = selectedType === "all" || task.type === selectedType;
    const isDateMatch =
      selectedDate === "all" ||
      (selectedDate === "upcoming" && new Date(task.dateTime) > new Date()) ||
      (selectedDate === "expired" && new Date(task.dateTime) <= new Date());

    return isTypeMatch && isDateMatch;
  });

  filteredTasks.forEach((task) => renderTask(task));
}
