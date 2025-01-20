"use strict";

const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

// Event listeners
taskForm.addEventListener("submit", addTask);

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

  renderTask(task);
  taskForm.reset();
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
    <p><strong>Date and Time:</strong> ${new Date(task.dateTime)}</p`;

  taskList.appendChild(li);
}
