
const $ = (id) => document.getElementById(id);


let focusMinutes = Number(localStorage.getItem("ff_focusMinutes") || 25);
let timerSeconds = focusMinutes * 60;
let timerId = null;


function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}


function updateTimer() {
  if ($("timerDisplay")) {
    $("timerDisplay").textContent = formatTime(timerSeconds);
  }
}


if ($("focusTime")) {
  $("focusTime").value = focusMinutes;
}
updateTimer();


if ($("focusTime")) {
  $("focusTime").onchange = () => {
    if (timerId) {
      alert("Please pause the timer before changing the focus time.");
      $("focusTime").value = focusMinutes;
      return;
    }
    focusMinutes = Number($("focusTime").value);
    localStorage.setItem("ff_focusMinutes", focusMinutes);
    timerSeconds = focusMinutes * 60;
    updateTimer();
    $("timerStatus").textContent = `Focus time set to ${focusMinutes} minutes.`;
  };
}


if ($("startTimer")) {
  $("startTimer").onclick = () => {
    if (timerId) return;

    $("timerStatus").textContent = "Focusing...";
    timerId = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimer();
      } else {
        clearInterval(timerId);
        timerId = null;
        $("timerStatus").textContent = "Session completed! Great job.";
        timerSeconds = focusMinutes * 60;
        updateTimer();
      }
    }, 1000);
  };
}


if ($("pauseTimer")) {
  $("pauseTimer").onclick = () => {
    if (!timerId) return;
    clearInterval(timerId);
    timerId = null;
    $("timerStatus").textContent = "Paused.";
  };
}


if ($("resetTimer")) {
  $("resetTimer").onclick = () => {
    clearInterval(timerId);
    timerId = null;
    timerSeconds = focusMinutes * 60;
    updateTimer();
    $("timerStatus").textContent = "Ready when you are.";
  };
}


let tasks = JSON.parse(localStorage.getItem("ff_tasks") || "[]");

function saveAndRenderTasks() {
  localStorage.setItem("ff_tasks", JSON.stringify(tasks));
  const list = $("taskList");
  if (!list) return;

  list.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "task-item completed" : "task-item";

    const span = document.createElement("span");
    span.textContent = task.text;
    span.onclick = () => {
      tasks[index].completed = !tasks[index].completed;
      saveAndRenderTasks();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveAndRenderTasks();
    };

    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

if ($("taskForm")) {
  $("taskForm").onsubmit = (e) => {
    e.preventDefault();
    const input = $("taskInput");
    const text = input.value.trim();
    if (!text) return;

    tasks.push({ text, completed: false });
    input.value = "";
    saveAndRenderTasks();
  };
}


saveAndRenderTasks();
