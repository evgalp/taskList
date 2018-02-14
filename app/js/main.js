function getDom() {
  const taskboard = document.getElementById('taskboard');
  const addTaskInput = taskboard.querySelector('#add-task-input');
  const addTaskNotesInput = taskboard.querySelector('#add-task-notes-input');
  const addTaskBtn = taskboard.querySelector('#add-task-btn');
  const taskPanel = taskboard.querySelector('#task-panel');
  const filterTasksInput = taskboard.querySelector('#filter-task-input');
  const clearTaskBtn = taskboard.querySelector('#clear-task-btn');

  return {taskboard, addTaskInput, addTaskNotesInput, addTaskBtn, taskPanel, filterTasksInput, clearTaskBtn};
}

const addTask = {
  _getInputsData: function () {
    let taskTitle = dom.addTaskInput.value;
    let taskNote = dom.addTaskNotesInput.value;

    if (taskTitle === "") {
      return false;
    } else {
      return {taskTitle, taskNote};
    }
  },
  _generateTaskItemHtml: function () {
    let taskData = addTask._getInputsData();
    if (!taskData) {
      return false;
    }

    let taskItemHtml = `
      <div class="ui-row task-panel__task-item">
        <div class="task-item__task-content">
          <span class="task-content__task-title">${taskData.taskTitle}</span>
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
    dom.taskPanel.appendChild(newItem)
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
  filtetAll: function(){
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
  dom.addTaskBtn.addEventListener('click', addTask.appendTaskToPanel);
  dom.taskPanel.addEventListener('click', removeTask.removeTaskFromPanel);
  dom.clearTaskBtn.addEventListener('click', removeTask.removeAllTasks);
  dom.filterTasksInput.addEventListener('keyup', filterTasks.filtetAll);
}

let dom = getDom();
attachCallbacks(dom);
