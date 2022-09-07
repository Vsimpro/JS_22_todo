var list = [];
var maxAmount = 8

function addItemToJSon(element){
    list.push(element)
    localStorage.setItem("items", JSON.stringify(list));
}

function removeFromJSon(element){
    var items = JSON.parse(localStorage.items)
    for (let i = 0; i < items.length; i++) {
        if (element == items[i]) {
            delete items[i];
            delete list[i];
        }
    }
    localStorage.setItem("items", JSON.stringify(items));
}

function onLoad() {
    // get old items
    if (localStorage.items != undefined) {
        let oldItems = JSON.parse(localStorage.items)
	for (let i = 0; i < oldItems.length; i++) {
	    if (oldItems[i] == null) {
	       continue
	    }
	    addNewItem(oldItems[i])
	    list.push(oldItems[i])
        }
    }
    // pressing enter triggers the "+" button;
    let taskbox = document.getElementById("task")
    taskbox.addEventListener("keypress", function(event) {
       if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("main").click();
       } 
    });
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
    removeFromJSon(element.textContent.replace("doneremove", ""))
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

function getTask() {
    // get the input value
    var inputValue = document.getElementById("task").value;
    var errorLine = document.getElementById("task");

    if (inputValue.length >= 20) {
	document.getElementById("toolong").style.display = "";
	errorLine.style["border"] = "2px dashed red";
        return;
    }

    if (inputValue.length <= 3) {
        document.getElementById("error").style.display = ""
        errorLine.style["border"] = "2px dashed red";
	return;
    }

    if (list.length >= maxAmount) {
        document.getElementById("limit").style.display = ""
	errorLine.style["border"] = "2px dashed red"
    } else {
        addNewItem(inputValue)
        addItemToJSon(inputValue)
    }
    

    // clear the value & error
    document.getElementById("task").value = "";
    document.getElementById("error").style.display = "none"
    document.getElementById("toolong").style.display = "none";
    errorLine.style["border"] = "";
}
