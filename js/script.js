// Global Variables
var maxAmount = 8

class Task {
    // Parameteres of a Task Object
    constructor(taskitem) {
        this.doneState = false;
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
        
        li_item.onclick = this.doTask;
        li_item.appendChild(done);
        li_item.appendChild(remove);
        li_item.appendChild(task);

        document.getElementById("tasks").appendChild(li_item)
    }
    removeTask() {
        // To Do: Make this make sense
        let element = this.parentElement;
        removeFromLocal(element.textContent.replace("doneremove", ""))
        element.remove();
    }
    doTask() {
        let state = this.doneState
        let opaque = "#4d6b78";
        let orange = "rgb(231, 114, 0)";
        let element = this.firstChild;

        if (state) {
            this.id = ""
            this.doneState = false;
            element.style["background-color"] = opaque;
        } else {    
            this.id = "done"
            this.doneState = true;
            element.style["background-color"] = orange;
        }
        // update task counter
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
        
        localStorage.setItem("items", JSON.stringify(empty))
        document.getElementById("tasks").innerHTML = "";
    };

    document.getElementById("main").addEventListener("click", function() {
        let inputValue = document.getElementById("task").value; // get the task from the input box
        addNewTask(inputValue)
        addToLocal(inputValue)  
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
            
        if (inputValidation(task)) { // Edge case where local storage has been fiddled with (idk why you would)
            addNewTask(task)
               
        } else {
            alert("Problem with localstorage.")
            clearAll()
        }
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


function calcTasks() {
    var tasksDone = document.querySelectorAll('[id=done]').length
    document.getElementById("tasksAmount").innerHTML = `tasks  ${tasksDone} / ${JSON.parse(localStorage.items).length}`
} 

function addNewTask(input) {
    if (inputValidation(input)) { // Create new task object
        let newTask = new Task(input);
        newTask.create()
    }
}

function inputValidation(inputValue) {
    let tooLong = "Task must be 20 characters at most";
    let tooMany = "Too many tasks.. please remove some";
    let tooShort = "New task can't be under 3 characters!";
    let selectedError = ""

    let errorLine = document.getElementById("task");
    let localList = localStorage.items || []

    if (localStorage.items != undefined){
        localList = JSON.parse(localStorage.items)
    }
    
    // input validation
    if (inputValue.length >= 20) {
        selectedError = tooLong;
    }
        
    if (inputValue.length <= 3) {
        selectedError = tooShort;
    }
        
    if (localList.length >= maxAmount) {
        selectedError = tooMany;
    }

    if (selectedError != "") {
        errorLine.style["border"] = "2px dashed red";
        document.getElementById("error").innerHTML = selectedError;
        return false;
    }

    // clear the value & error
    errorLine.style["border"] = "";
    return true;
}