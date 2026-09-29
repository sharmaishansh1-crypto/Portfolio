// ==============================
// GET HTML ELEMENTS
// ==============================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");


// ==============================
// LOAD SAVED TASKS
// ==============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ==============================
// DISPLAY TASKS
// ==============================

function displayTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span class="task-text">${task.text}</span>

            <div class="task-actions">

                <button
                    type="button"
                    class="edit-btn"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="delete-btn"
                >
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);

    });

    updateTaskCount();

    updateEmptyMessage();
}


// ==============================
// ADD TASK
// ==============================

function addTask() {

    const taskText = taskInput.value.trim();


    // Check empty input
    if (taskText === "") {

        alert("Please enter a task.");

        taskInput.focus();

        return;
    }


    // Create task object
    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    // Add task to array
    tasks.push(newTask);


    // Save tasks
    saveTasks();


    // Display tasks
    displayTasks();


    // Clear input
    taskInput.value = "";


    // Focus input
    taskInput.focus();
}


// ==============================
// ADD TASK BUTTON
// ==============================

addTaskBtn.addEventListener("click", addTask);


// ==============================
// ENTER KEY
// ==============================

taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// ==============================
// TASK ACTIONS
// ==============================

taskList.addEventListener("click", function(event) {

    const taskItem = event.target.closest(".task-item");


    if (!taskItem) {
        return;
    }


    const taskIndex = Array.from(taskList.children)
        .indexOf(taskItem);


    // ==========================
    // COMPLETE TASK
    // ==========================

    if (event.target.classList.contains("task-text")) {

        tasks[taskIndex].completed =
            !tasks[taskIndex].completed;

        saveTasks();

        displayTasks();

    }


    // ==========================
    // DELETE TASK
    // ==========================

    if (event.target.classList.contains("delete-btn")) {

        tasks.splice(taskIndex, 1);

        saveTasks();

        displayTasks();

    }


    // ==========================
    // EDIT TASK
    // ==========================

    if (event.target.classList.contains("edit-btn")) {

        const currentTask =
            tasks[taskIndex].text;


        const updatedTask = prompt(
            "Edit your task:",
            currentTask
        );


        if (
            updatedTask !== null &&
            updatedTask.trim() !== ""
        ) {

            tasks[taskIndex].text =
                updatedTask.trim();

            saveTasks();

            displayTasks();

        }

    }

});


// ==============================
// CLEAR COMPLETED TASKS
// ==============================

clearCompletedBtn.addEventListener(
    "click",
    function() {

        tasks = tasks.filter(function(task) {

            return !task.completed;

        });

        saveTasks();

        displayTasks();

    }
);


// ==============================
// SAVE TASKS
// ==============================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ==============================
// UPDATE TASK COUNT
// ==============================

function updateTaskCount() {

    taskCount.textContent = tasks.length;

}


// ==============================
// EMPTY MESSAGE
// ==============================

function updateEmptyMessage() {

    if (tasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }

}


// ==============================
// INITIAL DISPLAY
// ==============================

displayTasks();