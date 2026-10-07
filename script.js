
let focusMinutes = Number(localStorage.getItem("ff_focusMinutes") || 25);
let timeLeft = focusMinutes * 60;
let timerId = null;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-timer');
const pauseBtn = document.getElementById('pause-timer');
const resetBtn = document.getElementById('reset-timer');
const focusSelect = document.getElementById('focusTime');


function updateDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    if (hours > 0) {
        timerDisplay.textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else {
        timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
}


if (focusSelect) {
    focusSelect.value = focusMinutes;
    focusSelect.addEventListener('change', () => {
        if (timerId !== null) {
            alert("Please pause the timer before changing the focus time.");
            focusSelect.value = focusMinutes;
            return;
        }
        focusMinutes = Number(focusSelect.value);
        localStorage.setItem("ff_focusMinutes", focusMinutes);
        timeLeft = focusMinutes * 60;
        updateDisplay();
    });
}

updateDisplay();

startBtn.addEventListener('click', () => {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                alert('Focus session completed! Take a break.');
                timeLeft = focusMinutes * 60;
                updateDisplay();
            }
        }, 1000);
    }
});

pauseBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = focusMinutes * 60;
    updateDisplay();
});


const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
            <span>${task.text}</span>
            <button class="delete-btn" data-index="${index}">×</button>
        `;
        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    const text = taskInput.value.trim();
    if (text !== '') {
        tasks.push({ text, completed: false });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    }
}

taskList.addEventListener('click', (e) => {
    if (e.target.tagName === 'INPUT') {
        const index = e.target.dataset.index;
        tasks[index].completed = e.target.checked;
        saveTasks();
        renderTasks();
    } else if (e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
});

renderTasks();


const quickNotes = document.getElementById('quick-notes');

quickNotes.value = localStorage.getItem('quickNotes') || '';

quickNotes.addEventListener('input', () => {
    localStorage.setItem('quickNotes', quickNotes.value);
});
