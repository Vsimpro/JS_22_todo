// Global Variables
var opaque = "#4d6b78";
var orange = "rgb(231, 114, 0)";
var maxAmount = 8

class Errors {
    constructor() {
        this.duplicate = "Task is already in the list..";
        this.tooLong   = "Task must be 20 characters at most";
        this.tooMany   = "Too many tasks.. please remove some";
        this.tooShort  = "New task can't be under 4 characters!";
    }
}

class Task {
    // Parameteres of a Task Object
    constructor(taskitem, state) {
        this.doneState = state;
        this.taskitem = taskitem;
        this.listItem = document.createElement("li");
        this.doneButton = document.createElement("span");
        this.taskText = document.createTextNode(taskitem);
        this.removeButton = document.createElement("span");        
    }
    create() {
        // Create a new Task Object
        let done = this.doneButton;
        let task = this.taskText;
        let li_item = this.listItem;
        let remove = this.removeButton;

        done.id = "dot"
        done.innerHTML = "done";

        remove.id = "removeButton";
        remove.innerHTML = "remove";
        remove.onclick = this.removeTask
        
        li_item.onclick = doTask;
        li_item.appendChild(done);
        li_item.appendChild(remove);
        li_item.appendChild(task);

        if (this.doneState) {
            li_item.id = "done";
            done.style["background-color"] = orange;
        }
        
        document.getElementById("tasks").appendChild(li_item);
    }
    removeTask() {
        // To Do: Make this make sense
        let element = this.parentElement;
        removeFromLocal(element.textContent.replace("doneremove", ""))
        element.remove();
        calcTasks()
    }
}

window.onload = function(){ 
    document.getElementById("clear").onclick = function () { // Prepare "clear all" button
        let empty = [];
        let confirmText = "Are you sure you want to delete all the tasks?";
        
        // If the list is empty, do nothing.
        if (JSON.parse(localStorage.items).length == 0) { 
            return; 
        } 
        
        if (!confirm(confirmText)) { // If you press cancel, exit
            return;
        }
        
        document.getElementById("task").value = "";
        localStorage.setItem("items", JSON.stringify(empty))
        document.getElementById("tasks").innerHTML = "";
        calcTasks();
    };

    document.getElementById("main").addEventListener("click", function() {
        let inputValue = document.getElementById("task").value; // get the task from the input box
        if (inputValidation(inputValue)) {
            addNewTask(inputValue)
            addToLocal(inputValue)  
        }
    });
    document.getElementById("task").addEventListener("keypress", function(event) {
       if (event.key === "Enter") { // pressing enter triggers the "+" button
            event.preventDefault();
            document.getElementById("main").click();
       }
    });

    // get old items
    if (localStorage.items == undefined) { // If no prior tasks, exit
        return;
    }

    let oldItems = JSON.parse(localStorage.items)
        
    for (let item = 0; item < oldItems.length; item++) {
        let task = oldItems[item].task
        if (task == null) {
            continue
        }

        let doneState = false;
         
        if (oldItems[item].done == 1) {
             doneState = true;
        }
        addNewTask(task, doneState)                       
    }
    calcTasks()
};

// Functions
function addToLocal(element){
    let list = JSON.parse(localStorage.getItem("items")) || [];
    let obj = {task:element, done:0}
    list.push(obj)
    localStorage.setItem("items", JSON.stringify(list));
    calcTasks()
}

function removeFromLocal(element){
    let items = JSON.parse(localStorage.items)
    for (let i = 0; i < items.length; i++) {
        if (element == items[i].task) {
            delete items.splice(i, 1);
        }
    }
    localStorage.setItem("items", JSON.stringify(items));
}

function doTask() {
    let state = this.doneState;
    let element = this.firstChild;
    
    let items = JSON.parse(localStorage.items)
    let thisTask = this.innerText.replace("doneremove","")
    
    for (var index = 0; index < items.length; index++) {
        if (items[index].task == thisTask) {
            stateInStore = items[index].done; break;
        }
    }

    if (items[index] == undefined) {
        return; //Edge case where clicking remove checks done state.
    }

    state = true;
    if (items[index].done == 0) {
        state = false;
    }

    if (state) {
        this.id = ""
        this.doneState = false;
        items[index].done = 0;
        element.style["background-color"] = opaque;
    } else {    
        this.id = "done"
        this.doneState = true;
        items[index].done = 1;
        element.style["background-color"] = orange;
    }

    localStorage.setItem("items", JSON.stringify(items))
    calcTasks()// update task counter
}

function calcTasks() {
    var tasksDone = document.querySelectorAll('[id=done]').length
    document.getElementById("tasksAmount").innerHTML = `tasks  ${tasksDone} / ${JSON.parse(localStorage.items).length}`
} 

function addNewTask(input, state) {
        let newTask = new Task(input, state);
        newTask.create()
}

function inputValidation(input) {
    let selectedError = "";
    let localItems = localStorage.items || [];
    let errorLine = document.getElementById("task");
    
    if (localStorage.items != undefined){
        localItems = JSON.parse(localStorage.items)
    }

    if (localItems.length >= maxAmount) {
        // Too many tasks.
        selectedError = Errors.tooMany;
    }

    if (input.length >= 20) {
        // Task is too long.
        selectedError = Errors.tooLong;
    }
        
    if (input.length <= 3) {
        // Task is too short.
        selectedError = Errors.tooShort;
    }

    for (let i = 0; i < localItems.length; i++) {
        if (localItems[i].task == input) {
            selectedError = duplicate;
        }
    }

    document.getElementById("error").innerHTML = selectedError;

    if (selectedError != "") {
        errorLine.style["border"] = "2px dashed red";
        return false;
    }

    // clear the value & error
    errorLine.style["border"] = "";
    return true;
}