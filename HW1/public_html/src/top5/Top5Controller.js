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
                    textInput.onkeydown = (event) => {
                        if (event.key === 'Enter') {
                            this.model.addChangeItemTransaction(i-1, event.target.value);
                            document.getElementById("undo-button").classList.remove("disabled");
                            document.getElementById("add-list-button").classList.remove("disabled");
                        }
                    }
                    textInput.onblur = (event) => {
                        this.model.addChangeItemTransaction(i-1, event.target.value);
                        document.getElementById("undo-button").classList.remove("disabled");
                        document.getElementById("add-list-button").classList.remove("disabled");
                        this.model.restoreList();
                    }
                }
            }
        }
    }
    // TODO: 
    registerListSelectHandlers(id) {
        let list = document.getElementById("top5-list-" + id);
        // FOR SELECTING THE LIST
        list.onmousedown = (event) => {
            this.model.unselectAll();

            // GET THE SELECTED LIST
            this.model.loadList(id);

            // ALSO, UPDATE THE BOTTOM STATUS BAR
            let cardText = document.getElementById("list-card-text-" + id);
            let statusBar = document.getElementById("top5-statusbar");
            statusBar.innerHTML = "Top 5 " + cardText.innerHTML;

            // TODO: EDIT THE NAME OF THE LIST
            list.ondblclick = (ev) => {
                console.log("Double Clicked List!");
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
        }

    }

    ignoreParentClick(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
    }
}