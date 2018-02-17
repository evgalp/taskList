function getDom() {
  const taskboard = document.getElementById('taskboard');
  const addTaskInput = taskboard.querySelector('#add-task-input');
  const addTaskNotesInput = taskboard.querySelector('#add-task-notes-input');
  const addTaskBtn = taskboard.querySelector('#add-task-btn');
  const switchThemeBtn = taskboard.querySelector('#switch-theme-btn');
  const taskPanel = taskboard.querySelector('#task-panel');
  const filterTasksInput = taskboard.querySelector('#filter-task-input');
  const clearTaskBtn = taskboard.querySelector('#clear-task-btn');

  return {taskboard, addTaskInput, addTaskNotesInput, addTaskBtn, switchThemeBtn, taskPanel, filterTasksInput, clearTaskBtn};
}

const switchTheme = {
  isDefault: true,
  switchCurrentTheme: function () {
    if (switchTheme.isDefault) {
      switchTheme.isDefault = !switchTheme.isDefault;
      document.body.style.setProperty('--body-bg', 'rgba(217, 217, 217, 1)');
      document.body.style.setProperty('--panel-bg', '#202931');
      document.body.style.setProperty('--panel-border', '#7c8389');
      document.body.style.setProperty('--text-base', '#7c8389');
      document.body.style.setProperty('--text-light', '#ececec');
      document.body.style.setProperty('--text-accent', '#36c77b');
      document.body.style.setProperty('--text-button', '#ffffff');
      document.body.style.setProperty('--ui-color-1', '#36c77b');
      document.body.style.setProperty('--ui-color-2', '#0080ff');
      document.body.style.setProperty('--ui-color-3', '#fb5240');
      document.body.style.setProperty('--ui-color-1-hover', '#36C738');
      document.body.style.setProperty('--ui-color-2-hover', '#2196f3');
      document.body.style.setProperty('--ui-color-3-hover', '#b71c1c');
    } else {
      switchTheme.isDefault = !switchTheme.isDefault;
      document.body.style.setProperty('--body-bg', '#ffffff');
      document.body.style.setProperty('--panel-bg', '#f7f7f7');
      document.body.style.setProperty('--panel-border', '#ededed');
      document.body.style.setProperty('--text-base', '#4b5157');
      document.body.style.setProperty('--text-light', '#4b5157');
      document.body.style.setProperty('--text-accent', '#36c77b');
      document.body.style.setProperty('--text-button', '#ffffff');
      document.body.style.setProperty('--ui-color-1', '#36c77b');
      document.body.style.setProperty('--ui-color-2', '#0080ff');
      document.body.style.setProperty('--ui-color-3', '#fb5240');
      document.body.style.setProperty('--ui-color-1-hover', '#36C738');
      document.body.style.setProperty('--ui-color-2-hover', '#2196f3');
      document.body.style.setProperty('--ui-color-3-hover', '#b71c1c');
    }
  }
}

const addTask = {
  _getCurrentDate: function(){
    let now = new Date();
    let date = now.toDateString();
    let time = now.toTimeString().split(' ')[0];
    return {
      dateString: `${date} at ${time}`,
      timeStamp: now.getTime()
    };
  },
  _getTaskData: function () {
    let timeAdded = addTask._getCurrentDate();
    let taskId = timeAdded.timeStamp;
    let taskTitle = dom.addTaskInput.value;
    let taskNote = dom.addTaskNotesInput.value;
    let taskDate = timeAdded.dateString;

    if (taskTitle === "") {
      return false;
    } else {
      return {taskId, taskTitle, taskDate, taskNote}
    }
  },
  _clearInputsData: function() {
    dom.addTaskInput.value = '';
    dom.addTaskNotesInput.value = '';
  },
  _generateTaskItemHtml: function () {
    let taskData = addTask._getTaskData();
    if (!taskData) {return false;}

    let taskItemHtml = `
      <div class="ui-row task-panel__task-item">
        <div class="task-item__task-content">
          <span class="task-content__task-title">${taskData.taskTitle}</span>
          <span class="task-content__task-date">${taskData.taskDate}</span>
          <span class="task-content__task-notes">${taskData.taskNote}</span>
        </div>
        <button class="ui-button task-item__delete-task-button">done</button>
      </div>`;

      return taskItemHtml;
  },
  appendTaskToPanel: function () {
    let taskHtml = addTask._generateTaskItemHtml();
    if (!taskHtml) {
      alert(`Task can't be added without a title`);
      return;
    }
    let newItem = document.createElement('li');
    newItem.classList.add('task-li');
    newItem.innerHTML = taskHtml;
    dom.taskPanel.appendChild(newItem);
    addTask.addTaskToLocalStorage();
    addTask._clearInputsData();
  },
  addTaskToLocalStorage: function() {
    let tasksBase;
    let taskData = addTask._getTaskData();

    if (localStorage.getItem("tasksBase") === null) {
      tasksBase = {};
    } else {
      tasksBase = JSON.parse(localStorage.getItem("tasksBase"));
    }

    tasksBase[taskData.taskId] = taskData;
    localStorage.setItem("tasksBase", JSON.stringify(tasksBase));
  },
  getStorageContent: function() {
    if (localStorage.getItem("tasksBase") !== null) {
      let tasksBase = JSON.parse(localStorage.getItem("tasksBase"));
      for (task in tasksBase) {
        taskData = tasksBase[task];
        let newItem = document.createElement('li');
        newItem.classList.add('task-li');
        let taskItemHtml = `
          <div class="ui-row task-panel__task-item">
            <div class="task-item__task-content">
              <span class="task-content__task-title">${taskData.taskTitle}</span>
              <span class="task-content__task-date">${taskData.taskDate}</span>
              <span class="task-content__task-notes">${taskData.taskNote}</span>
            </div>
            <button class="ui-button task-item__delete-task-button">done</button>
          </div>`;
        newItem.innerHTML = taskItemHtml;
        dom.taskPanel.appendChild(newItem);
      }
    } else {
      return false;
    }
  }
}

const removeTask = {
  removeTaskFromPanel: function(e){
    if (e.target.classList.contains('task-item__delete-task-button')) {
      if (window.confirm('Do you really want to delete this task ?')) {
        let listItem = e.target.parentNode.parentNode;
        listItem.remove();
      }
    }
  },
  removeAllTasks: function(){
    if (window.confirm('Do you really want to delete ALL tasks ?')) {
      while (dom.taskPanel.hasChildNodes && dom.taskPanel.firstChild !== null) {
        dom.taskPanel.removeChild(dom.taskPanel.firstChild)
      }
    }
  }
}

const filterTasks = {
  filterAll: function(){
    let allTasks = dom.taskPanel.querySelectorAll('.task-li');
    for (let i = 0; i < allTasks.length; i++) {
      let taskContent = allTasks[i].querySelector('.task-item__task-content');
      if (!taskContent.innerText.includes(dom.filterTasksInput.value)) {
        allTasks[i].style.display = 'none';
      } else {
        allTasks[i].style.display = 'block';
      }
    }
  }
}

function attachCallbacks(dom) {
  addTask.getStorageContent();
  dom.addTaskBtn.addEventListener('click', addTask.appendTaskToPanel);
  dom.taskPanel.addEventListener('click', removeTask.removeTaskFromPanel);
  dom.clearTaskBtn.addEventListener('click', removeTask.removeAllTasks);
  dom.filterTasksInput.addEventListener('keyup', filterTasks.filterAll);
  dom.switchThemeBtn.addEventListener('click', switchTheme.switchCurrentTheme);
}

let dom = getDom();
attachCallbacks(dom);
