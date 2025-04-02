let tasks = [];
let currentUser = null;

function login() {
    const username = document.getElementById('username').value;
    if (!username.trim()) {
        alert("¡Usuario requerido!");
        return;
    }
    currentUser = username;
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('task-section').style.display = 'block';
    alert(`Bienvenido, ${currentUser}!`);
}

function addTask() {
    const input = document.getElementById('newTask');
    if (!input.value.trim()) {
        alert("¡La tarea no puede estar vacía!");
        return;
    }
    tasks.push(input.value);
    input.value = '';
    updateTaskList();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    updateTaskList();
}

function updateTaskList() {
    const list = document.getElementById('tasks');
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${task} <button onclick="deleteTask(${index})">🗑️ Eliminar</button>`;
        list.appendChild(li);
    });
}

// Inicialización
document.getElementById('task-section').style.display = 'none';