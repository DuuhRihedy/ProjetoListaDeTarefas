// Dados simulados no Local Storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Seleciona elementos do DOM
const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-btn');
const taskModal = document.getElementById('task-modal');
const closeModal = document.querySelector('.close');
const taskForm = document.getElementById('task-form');
const taskNameInput = document.getElementById('task-name');
const taskCostInput = document.getElementById('task-cost');
const taskDeadlineInput = document.getElementById('task-deadline');

// Função para gerar um ID único
function generateId() {
    return Math.floor(Math.random() * Date.now());
}

// Função para verificar nomes duplicados
function isDuplicateName(name) {
    return tasks.some(task => task.name === name);
}

// Abre o modal de inclusão
addTaskBtn.onclick = () => {
    taskForm.reset();
    taskModal.style.display = 'block';
};

// Fecha o modal
closeModal.onclick = () => {
    taskModal.style.display = 'none';
};

// Renderiza a lista de tarefas
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const taskRow = document.createElement('div');
        taskRow.classList.add('task-row');
        if (task.cost >= 1000) taskRow.classList.add('highlight');

        taskRow.innerHTML = `
            <span>ID: ${task.id} | ${task.name} - R$${task.cost.toFixed(2)} - ${task.deadline}</span>
            <div>
                <button onclick="moveTask(${index}, 'up')">⬆️</button>
                <button onclick="moveTask(${index}, 'down')">⬇️</button>
                <button onclick="editTask(${index})">✏️</button>
                <button onclick="deleteTask(${index})">🗑️</button>
            </div>
        `;
        taskList.appendChild(taskRow);
    });
}

// Adiciona nova tarefa
taskForm.onsubmit = (e) => {
    e.preventDefault();
    const name = taskNameInput.value;
    if (isDuplicateName(name)) {
        alert("Este nome de tarefa já existe. Escolha um nome único.");
        return;
    }

    const newTask = {
        id: generateId(),
        name: name,
        cost: parseFloat(taskCostInput.value),
        deadline: taskDeadlineInput.value
    };

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    taskModal.style.display = 'none';
};

// Edita tarefa
function editTask(index) {
    const task = tasks[index];
    taskNameInput.value = task.name;
    taskCostInput.value = task.cost;
    taskDeadlineInput.value = task.deadline;

    taskModal.style.display = 'block';

    taskForm.onsubmit = (e) => {
        e.preventDefault();
        const newName = taskNameInput.value;
        if (newName !== task.name && isDuplicateName(newName)) {
            alert("Este nome de tarefa já existe. Escolha um nome único.");
            return;
        }
        task.name = newName;
        task.cost = parseFloat(taskCostInput.value);
        task.deadline = taskDeadlineInput.value;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        taskModal.style.display = 'none';
    };
}

// Exclui tarefa
function deleteTask(index) {
    if (confirm("Tem certeza que deseja excluir essa tarefa?")) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
}

// Função para mover tarefa para cima ou para baixo
function moveTask(index, direction) {
    if (direction === 'up' && index > 0) {
        [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
    } else if (direction === 'down' && index < tasks.length - 1) {
        [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Inicializa a página carregando tarefas
renderTasks();
