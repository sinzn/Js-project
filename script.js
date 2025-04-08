document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Task array to store all tasks
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Initialize the app
    init();
    
    // Event Listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTasks();
        });
    });
    
    // Functions
    function init() {
        renderTasks();
        updateTaskCount();
    }
    
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            priority: prioritySelect.value,
            completed: false,
            createdAt: new Date()
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        updateTaskCount();
        
        taskInput.value = '';
        taskInput.focus();
    }
    
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
    
    function toggleTaskStatus(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
    
    function renderTasks() {
        // Clear the task list
        taskList.innerHTML = '';
        
        // Filter tasks based on current filter
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        // Sort tasks by priority (high > medium > low)
        filteredTasks.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        // Render each task
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item', `${task.priority}-priority`);
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <span class="task-priority">${capitalizeFirstLetter(task.priority)}</span>
                <button class="task-delete"><i class="fas fa-trash"></i></button>
            `;
            
            // Add event listeners to the task item
            const checkbox = taskItem.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => toggleTaskStatus(task.id));
            
            const deleteBtn = taskItem.querySelector('.task-delete');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            taskList.appendChild(taskItem);
        });
    }
    
    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} remaining`;
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});