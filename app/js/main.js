function getDom() {
  const taskboard = document.getElementById('taskboard');
  const addTaskInput = taskboard.querySelector('#add-task-input');
  const addTaskNotesInput = taskboard.querySelector('#add-task-notes-input');
  const addTaskBtn = taskboard.querySelector('#add-task-btn');
  const taskPanel = taskboard.querySelector('#task-panel');
  const clearTaskBtn = taskboard.querySelector('#clear-task-btn');

  return {taskboard, addTaskInput, addTaskNotesInput, addTaskBtn, taskPanel, clearTaskBtn};
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
        <a href="#" class="ui-button task-item__delete-task-button">done</a>
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
    newItem.innerHTML = taskHtml;
    dom.taskPanel.appendChild(newItem)
  }
}

let dom = getDom();
dom.addTaskBtn.addEventListener('click', addTask.appendTaskToPanel);
