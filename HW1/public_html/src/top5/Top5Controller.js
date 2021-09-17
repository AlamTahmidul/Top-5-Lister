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
                let newList = this.model.addNewList("Untitled", ["?","?","?","?","?"]);            
                this.model.loadList(newList.id);
                this.model.saveLists();
            }
        }
        document.getElementById("undo-button").onmousedown = (event) => {
            this.model.undo();
        }

        // SETUP THE ITEM HANDLERS
        for (let i = 1; i <= 5; i++) {
            let item = document.getElementById("item-" + i);

            // AND FOR TEXT EDITING
            item.ondblclick = (ev) => {
                if (this.model.hasCurrentList()) {  
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
                            document.getElementById("add-list-button").classList.remove("disabled");
                            this.model.restoreList();
                        }
                    }
                    textInput.onblur = (event) => { // On mouseclick away
                        this.model.addChangeItemTransaction(i-1, event.target.value);
                        document.getElementById("undo-button").classList.remove("disabled");
                        document.getElementById("add-list-button").classList.remove("disabled");
                        this.model.restoreList();
                    }
                }
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

                // ENABLE CLOSE BUTTON WHILE THE LIST IS BEING EDITED
                document.getElementById("close-button").classList.remove("disabled");    
                document.getElementById("close-button").onmousedown = (e) => {
                    this.model.unselectAll(); // UNSELECT LISTS

                    // Clear INNER HTML for lists
                    for (let i = 1; i <= 5; i++) {
                        document.getElementById("item-" + i).innerText = "";
                    }
                    // Clear Status Bar
                    document.getElementById("top5-statusbar").innerText = "";
                    // CLOSE BUTTON DISABLED WHEN LIST IS NOT BEING EDITED
                    document.getElementById("close-button").classList.add("disabled");

                    // CLEAR TRANSACTION STACK
                    this.model.clearTransactions();
                }

                // TODO: EDIT THE NAME OF THE LIST
                list.ondblclick = (ev) => {
                    // if (this.model.hasCurrentList()) { // Check if there is a valid list being edited
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
                                this.model.addChangeListTransaction(id, event.target.value);
                                document.getElementById("add-list-button").classList.remove("disabled");
                                this.model.refreshList();
                                this.model.highlightListByName(textInput.value);
                            }
                        }
                        textInput.onblur = (event) => { // On mouseclick away
                            this.model.addChangeListTransaction(id, event.target.value);
                            document.getElementById("add-list-button").classList.remove("disabled");
                            this.model.refreshList();
                            this.model.highlightListByName(textInput.value);
                        }
                    // }
                }
            }
        }

        // FOR DELETING THE LIST (TODO)
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
        }

    }

    ignoreParentClick(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
    }
}