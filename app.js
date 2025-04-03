// app.js - Task Manager CRUD con LocalStorage

// Inicialización de variables
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Elementos del DOM
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');

// Función para guardar tareas en localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskCounter();
}

// Actualizar contador de tareas
function updateTaskCounter() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    taskCounter.textContent = `${completedTasks} de ${totalTasks} tareas completadas`;
}

// Añadir nueva tarea
function addTask(e) {
    e.preventDefault();
    const text = taskInput.value.trim();
    
    if (!text) {
        alert('¡La tarea no puede estar vacía!');
        return;
    }
    
    // Verificar duplicados
    if (tasks.some(task => task.text.toLowerCase() === text.toLowerCase())) {
        alert('¡Esta tarea ya existe!');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: null
    };
    
    tasks.unshift(newTask); // Añadir al principio del array
    taskInput.value = '';
    saveTasks();
    renderTasks();
}

// Cambiar estado de completado
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed,
                updatedAt: new Date().toISOString()
            };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Eliminar tarea
function deleteTask(id) {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Editar tarea
function editTask(id, newText) {
    newText = newText.trim();
    if (!newText) return;
    
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                text: newText,
                updatedAt: new Date().toISOString()
            };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Mostrar prompt para edición
function promptEdit(id, currentText) {
    const newText = prompt('Editar tarea:', currentText);
    if (newText !== null) {
        editTask(id, newText);
    }
}

// Renderizar lista de tareas
function renderTasks() {
    // Ordenar: no completadas primero, luego por fecha de modificación/creación
    tasks.sort((a, b) => {
        if (a.completed === b.completed) {
            return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        }
        return a.completed ? 1 : -1;
    });

    taskList.innerHTML = tasks.map(task => `
        <li class="${task.completed ? 'completed' : ''}">
            <span onclick="toggleTask(${task.id})">${task.text}</span>
            <div>
                <button onclick="promptEdit(${task.id}, '${escapeHtml(task.text)}')">✏️</button>
                <button onclick="deleteTask(${task.id})">🗑️</button>
            </div>
        </li>
    `).join('');
    
    updateTaskCounter();
}

// Escapar HTML para seguridad
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Event Listeners
taskForm.addEventListener('submit', addTask);

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});