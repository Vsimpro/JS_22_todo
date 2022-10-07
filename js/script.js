// Global Variables
var list = [];
var maxAmount = 8

// Prepare onload
window.onload = function(){ 
    // get old items
    if (localStorage.items != undefined) {
        let oldItems = JSON.parse(localStorage.items)

        for (let i = 0; i < oldItems.length; i++) {
            if (oldItems[i] == null) {
            continue
            }
            
            // Edge case where local storage has been fiddled with (idk why you would)
            if (inputValidation(oldItems[i])) {
                addNewItem(oldItems[i])
                list.push(oldItems[i])
            } else {
                alert("Problem with localstorage.")
                clearAll()
            }
        }
    }
    // add event listener to 
    document.getElementById("main").addEventListener("click", getTask);

    // pressing enter triggers the "+" button;
    let taskbox = document.getElementById("task")
    taskbox.addEventListener("keypress", function(event) {
       if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("main").click();
       }
    });

   // create "clear tasks" button
   var clearall = document.getElementById("clear");
   clearall.onclick = clearAll;
};


// Functions
function addToLocal(element){
    list.push(element)
    localStorage.setItem("items", JSON.stringify(list));
}

function removeFromLocal(element){
    var items = JSON.parse(localStorage.items)
    for (let i = 0; i < items.length; i++) {
        if (element == items[i]) {
            delete items.splice(i, 1);
            delete list.splice(i, 1);
        }
    }
    localStorage.setItem("items", JSON.stringify(items));
}

function clearAll() {
    if (list.length == 0) { return }
    // Are you sure? alert
    if (!confirm("Are you sure you want to delete all the tasks?")) {
        return
    }
    // clear the JSON
    for (var i = 0; i < list.length; i++) {
        removeFromLocal(list[i]);
    }
    // clear the <ul>
   document.getElementById("tasks").innerHTML = "";
}

function doTask() {
    let element = this.firstChild
    if (element.style["background-color"] == "rgb(231, 114, 0)") {
        element.style["background-color"] = "#4d6b78";
        return
    }
    element.style["background-color"] = "#e77200";
}

function removeTask() {
    let element = this.parentElement;
    removeFromLocal(element.textContent.replace("doneremove", ""))
    document.getElementById("limit").style.display = "none"
    element.remove();
}

function addNewItem(input) {
    document.getElementById("limit").style.display = "none"

    // create a new list item
    let listItem = document.createElement("li");
    listItem.onclick = doTask

    // add dot
    let dot = document.createElement("span")
    dot.id = "dot"
    dot.innerHTML = "done";
    listItem.appendChild(dot);

    // new remove button
    let removeButton = document.createElement("span")
    removeButton.id = "removeButton";
    removeButton.innerHTML = "remove";
    removeButton.onclick = removeTask
    removeButton.addEventListener("click", removeTask);
    listItem.appendChild(removeButton);

    // append text
    let newTask = document.createTextNode(input);
    listItem.appendChild(newTask);

    // add the new item to the list
    document.getElementById("tasks").appendChild(listItem)
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
        
    if (list.length >= maxAmount) {
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
        addNewItem(inputValue)
        addToLocal(inputValue)
    }
}