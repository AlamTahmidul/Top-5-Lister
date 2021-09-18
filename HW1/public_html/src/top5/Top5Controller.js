/**
 * Top5ListController.js
 * 
 * This file provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class Top5Controller {
    constructor() {
        this.dup = 0;
    }

    setModel(initModel) {
        this.model = initModel;
        this.initHandlers();
    }

    initHandlers() {
        // SETUP THE TOOLBAR BUTTON HANDLERS
        document.getElementById("add-list-button").onmousedown = (event) => {
            if (!document.getElementById("add-list-button").classList.contains("disabled"))
            {
                let newList = this.model.addNewList("Untitled" + this.dup++, ["?","?","?","?","?"]);            
                this.model.loadList(newList.id);
                this.model.saveLists();
                document.getElementById("add-list-button").classList.add("disabled");
                document.getElementById("close-button").classList.remove("disabled");
            }
        }
        document.getElementById("undo-button").onmousedown = (event) => {
            this.model.undo();
            this.model.restoreList();
        }
        document.getElementById("redo-button").onmousedown = (event) => {
            this.model.redo();
            this.model.restoreList();
        }
        // SETUP THE ITEM HANDLERS
        for (let i = 1; i <= 5; i++) {
            let item = document.getElementById("item-" + i);

            // AND FOR TEXT EDITING
            item.ondblclick = (ev) => {
                if (this.model.hasCurrentList()) {
                    item.setAttribute("draggable", "false");
                    // CLEAR THE TEXT
                    item.innerHTML = "";

                    // Disable Add-List while Editing
                    document.getElementById("add-list-button").classList.add("disabled");

                    // ADD A TEXT FIELD
                    let textInput = document.createElement("input");
                    textInput.setAttribute("type", "text");
                    textInput.setAttribute("id", "item-text-input-" + i);
                    textInput.setAttribute("value", this.model.currentList.getItemAt(i-1));

                    item.appendChild(textInput); // TEXT ADDED

                    textInput.ondblclick = (event) => {
                        this.ignoreParentClick(event);
                    }
                    textInput.onkeydown = (event) => { // On enter
                        if (event.key === 'Enter') {
                            this.model.addChangeItemTransaction(i-1, event.target.value);
                            document.getElementById("undo-button").classList.remove("disabled");
                            document.getElementById("redo-button").classList.add("disabled");
                            document.getElementById("add-list-button").classList.remove("disabled");
                            this.model.restoreList();

                            // DISABLE ADD-LIST while list is open
                            document.getElementById("add-list-button").classList.add("disabled");
                        }
                    }
                    textInput.onblur = (event) => { // On mouseclick away
                        this.model.addChangeItemTransaction(i-1, event.target.value);
                        document.getElementById("undo-button").classList.remove("disabled");
                        document.getElementById("add-list-button").classList.remove("disabled");
                        document.getElementById("redo-button").classList.add("disabled");
                        this.model.restoreList();

                        // DISABLE ADD-LIST while list is open
                        document.getElementById("add-list-button").classList.add("disabled");
                    }
                }
            }
            
            // DRAG AND DROP FUNCTIONALITY
              item.ondragstart = (event) => {
                    // event.ignoreParentClick(event);
                    event.dataTransfer.setData("text", i - 1);
                    // console.log("Starting Drag!");
                }
                item.ondragover = (event) => {
                    event.preventDefault();
                }
                item.ondrop = (event) => {
                    event.preventDefault();
                    // console.log("Dropped!");

                    let data = event.dataTransfer.getData("text"); // Data holds start index
                    let newIndex = event.target.id.substring(event.target.id.indexOf("-") + 1); // New Index; where to drop
                    // console.log("Old Index: " + data + ", New Index: " + (newIndex - 1));

                    // Add to Transaction Stack
                    this.model.addMoveItemTransaction(data, newIndex - 1);
                    document.getElementById("undo-button").classList.remove("disabled");
                    document.getElementById("redo-button").classList.add("disabled");

                    this.model.saveLists();
                    this.model.restoreList();
                }
            
        }
        
    }

    registerListSelectHandlers(id) {
        let list = document.getElementById("top5-list-" + id);
        // FOR SELECTING THE LIST
        list.onmousedown = (event) => {
            if (document.getElementById("close-button").classList.contains("disabled")
                || document.getElementsByClassName("selected-list-card")[0].id == "top5-list-" + id)
            {         
                this.model.unselectAll();

                // GET THE SELECTED LIST
                this.model.loadList(id);

                // DISABLE ADD-LIST while list is open
                document.getElementById("add-list-button").classList.add("disabled");

                // ENABLE CLOSE BUTTON WHILE THE LIST IS BEING EDITED
                document.getElementById("close-button").classList.remove("disabled");
                document.getElementById("close-button").onmousedown = (e) => {
                    this.model.closeList();
                }

                // EDIT THE NAME OF THE LIST
                list.ondblclick = (ev) => {
                    if (this.model.hasCurrentList()) { // Check if there is a valid list being edited
                        document.getElementById("list-card-text-" + id).innerHTML = "";
                        
                        // Disable Add-List while Editing
                        document.getElementById("add-list-button").classList.add("disabled");

                        // console.log(list.innerHTML);
                        // ADD A TEXT FIELD
                        let textInput = document.createElement("input");
                        textInput.setAttribute("type", "text");
                        textInput.setAttribute("id", "list-text-input-" + id);
                        textInput.setAttribute("value", this.model.currentList.getName());

                        list.appendChild(textInput); // TEXT ADDED
                                                
                        list.ondblclick = (e) => {
                            this.ignoreParentClick(e);
                        }

                        textInput.onkeydown = (event) => { // On enter
                            if (event.key === 'Enter') {
                                // this.model.addChangeListTransaction(id, event.target.value);
                                this.model.changeList(id, event.target.value);
                                this.model.refreshList();
                                this.model.highlightListByName(textInput.value);
                            }
                        }
                        textInput.onblur = (event) => { // On mouseclick away
                            this.model.changeList(id, event.target.value);
                            this.model.refreshList();
                            this.model.highlightListByName(textInput.value);
                        }
                    }
                }
            }
        }

        // FOR DELETING THE LIST
        document.getElementById("delete-list-" + id).onmousedown = (event) => {
            this.ignoreParentClick(event);
            // VERIFY THAT THE USER REALLY WANTS TO DELETE THE LIST
            let modal = document.getElementById("delete-modal");
            this.listToDeleteIndex = id;
            let listName = this.model.getList(id).getName();
            let deleteSpan = document.getElementById("delete-list-span");
            deleteSpan.innerHTML = "";
            deleteSpan.appendChild(document.createTextNode(listName));
            modal.classList.add("is-visible");
            // On CANCEL, DO NOTHING
            document.getElementById("dialog-cancel-button").onmousedown = (e) => {
                modal.classList.remove("is-visible");
            }
            // On Confirm, Delete From Local Storage (permanent)
            document.getElementById("dialog-confirm-button").onmousedown = (e) => {
                // DELETE PERMANENTLY
                this.model.deleteList(this.model.getList(id).getName());
                // Remove modal
                modal.classList.remove("is-visible");
            }
        }

    }

    ignoreParentClick(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
    }
}