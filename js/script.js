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
        document.getElementById("limit").style.display = "none"
        element.remove();
    }
    doTask() {
        let element = this.firstChild;
        let orange = "rgb(231, 114, 0)";
        let opaque = "#4d6b78";

        if (this.doneState) {
            this.id = ""
            this.doneState = false;
            element.style["background-color"] = opaque;
        } else {    
            this.doneState = true;
            element.style["background-color"] = orange;
            this.id = "done"
        }
        calcTasks()
    }
}

// Prepare onload
window.onload = function(){ 
    // get old items
    if (localStorage.items != undefined) {
        let oldItems = JSON.parse(localStorage.items)
        
        for (let i = 0; i < oldItems.length; i++) {
            var task = oldItems[i].task
            if (task == null) {
            continue
            }
            
            // Edge case where local storage has been fiddled with (idk why you would)
            if (inputValidation(task)) {
                addNewTask(task)
                
            } else {
                alert("Problem with localstorage.")
                clearAll()
            }
        }
    }
    // add event listeners
    document.getElementById("main").addEventListener("click", getTask);
    document.getElementById("clear").onclick = clearAll;
    document.getElementById("task").addEventListener("keypress", function(event) {
       if (event.key === "Enter") {
        // pressing enter triggers the "+" button
            event.preventDefault();
            document.getElementById("main").click();
       }
    });
   calcTasks() 
};


// Functions
function addToLocal(element){
    var list = JSON.parse(localStorage.getItem("items")) || [];
    var obj = {task:element, done:0}
    list.push(obj)
    localStorage.setItem("items", JSON.stringify(list));
    calcTasks()
}

function removeFromLocal(element){
    var items = JSON.parse(localStorage.items)
    for (let i = 0; i < items.length; i++) {
        if (element == items[i].task) {
            delete items.splice(i, 1);
        }
    }
    localStorage.setItem("items", JSON.stringify(items));
}

function clearAll() {
    let empty = [];
    let confirmText = "Are you sure you want to delete all the tasks?";
    
    // If the list is empty, do nothing.
    if (JSON.parse(localStorage.items).length == 0) { 
        return; 
    } 
    
    if (!confirm(confirmText)) {
        return;
    }
      
    localStorage.setItem("items", JSON.stringify(empty))
    document.getElementById("tasks").innerHTML = "";
}

function calcTasks() {
    var tasksDone = document.querySelectorAll('[id=done]').length
    document.getElementById("tasksAmount").innerHTML = `tasks  ${tasksDone} / ${JSON.parse(localStorage.items).length}`
} 

function addNewTask(input) {
    let newTask = new Task(input);
    newTask.create()
}

function inputValidation(inputValue) {
    var errorLine = document.getElementById("task");
    errorLine.style["border"] = "2px dashed red";

    // input validation
    if (inputValue.length >= 20) {
        document.getElementById("toolong").style.display = "";
        return false;
    }
        
    if (inputValue.length <= 3) {
        document.getElementById("error").style.display = ""
        return false;
    }
        
    if (JSON.parse(localStorage.items).length >= maxAmount) {
        document.getElementById("limit").style.display = ""
        return false;
    }

    // clear the value & error
    document.getElementById("task").value = "";
    document.getElementById("error").style.display = "none"
    document.getElementById("toolong").style.display = "none";
    errorLine.style["border"] = "";

    return true;
}

function getTask() {
    // get the input value
    var inputValue = document.getElementById("task").value;
    
    if (inputValidation(inputValue)) {
        addNewTask(inputValue)
        addToLocal(inputValue)
    }
}