import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';
import jsTPS from './transaction/jsTPS';
import ChangeItem_Transaction from './transaction/transactions/ChangeItem_Transaction';
import MoveItem_Transaction from './transaction/transactions/MoveItem_Transaction';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js'
import Sidebar from './components/Sidebar.js'
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js'

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // CREATE A TRANSACTION PROCESSING SYSTEM
        this.tps = new jsTPS();

        this.removeList = null;

        // SETUP THE INITIAL STATE
        this.state = {
            currentList : null,
            sessionData : loadedSessionData
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = String(this.state.sessionData.nextKey);
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            items: ["?", "?", "?", "?", "?"]
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);
            this.db.mutationUpdateSessionData(this.state["sessionData"]);
            
            document.getElementById("close-button").classList.remove("top5-button-disabled");
            document.getElementById("close-button").classList.add("top5-button");
            document.getElementById("close-button").removeAttribute("disabled");
        });
    }
    renameList = (key, newName) => { // TODO: CLEAR TRANSACTION STACK
        if (this.state.currentList != null && this.state.currentList.key === key)
        {
            // console.log(this.state.currentList);
            let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
            // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
            for (let i = 0; i < newKeyNamePairs.length; i++) {
                let pair = newKeyNamePairs[i];
                if (pair.key === key) {
                    pair.name = newName;
                }
            }
            this.sortKeyNamePairsByName(newKeyNamePairs);

            // WE MAY HAVE TO RENAME THE currentList
            let currentList = this.state.currentList;
            if (currentList.key === key) {
                currentList.name = newName;
            }

            this.setState(prevState => ({
                currentList: prevState.currentList,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey,
                    counter: prevState.sessionData.counter,
                    keyNamePairs: newKeyNamePairs
                }
            }), () => {
                // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
                // THE TRANSACTION STACK IS CLEARED
                let list = this.db.queryGetList(key);
                list.name = newName;
                this.db.mutationUpdateList(list);
                this.db.mutationUpdateSessionData(this.state.sessionData);
                // TODO: Clear Transaction Stack
            });
        }
    }
    // // IMPLEMENTATION 2
    // renameItem = (itemList) => {
    //     console.log(this.db.queryGetSessionData());
    //     this.setState(prevState => ({
    //         currentList: prevState.currentList,
    //         sessionData: {
    //             nextKey: prevState.sessionData.nextKey,
    //             counter: prevState.sessionData.counter,
    //             keyNamePairs: prevState.sessionData.keyNamePairs,
    //         }
    //     }), () => {
    //         // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
    //         // THE LIST GETS UPDATED AND SAVED
    //         this.db.mutationUpdateList(itemList);

    //         // TODO: UNDO/REDO
            
    //     });
    // }
    // Implementation 3
    renameItem = (id, newText) => {
        this.state.currentList.items.splice(id, 1, newText);
        this.setState(prevState => ({
            currentList: this.state.currentList,
        }), () => {
            // AFTER EFFECTS?
            this.db.mutationUpdateList(this.state.currentList);
            // console.log(this.state.currentList.items);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        if (this.state.currentList == null)
        {       
        let newCurrentList = this.db.queryGetList(key);
            this.setState(prevState => ({
                currentList: newCurrentList,
                sessionData: prevState.sessionData
            }), () => {
                // ANY AFTER EFFECTS?
                document.getElementById("close-button").classList.remove("top5-button-disabled");
                document.getElementById("close-button").classList.add("top5-button");
                document.getElementById("close-button").removeAttribute("disabled");

                document.getElementById("add-list-button").classList.remove("top5-button");
                document.getElementById("add-list-button").classList.add("top5-button-disabled");
                document.getElementById("add-list-button").setAttribute("disabled", "true");

                // console.log(document.getElementsByClassName("unselected-list-card"));
                // console.log(this.state.currentList.items[0])
            });
        }
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.setState(prevState => ({
            currentList: null,
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state["sessionData"]
        }), () => {
            // ANY AFTER EFFECTS?
            // TODO: Clear Transaction Stack, Make ADD LIST functional, Grey-out Undo/Redo and Close
            console.log("CLOSED LIST?!");
            document.getElementById("close-button").classList.remove("top5-button");
            document.getElementById("close-button").classList.add("top5-button-disabled");
            document.getElementById("close-button").setAttribute("disabled", "true");

            document.getElementById("add-list-button").classList.remove("top5-button-disabled");
            document.getElementById("add-list-button").classList.add("top5-button");
            document.getElementById("add-list-button").removeAttribute("disabled");

            this.clearTransactions();
        });
    }
    deleteList = (keyNamePair) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
    
        this.showDeleteListModal(keyNamePair);
        // keyNamePair holds the proper id and name of list to delete
    }
    confirmDeleteList = () => {
        // TODO: DELETE FROM LOCAL STORAGE
        // console.log(this.state["sessionData"]);

        let keyNamePair = this.removeList;
        console.log("REMOVING " + keyNamePair.name + " with id: " + keyNamePair.id);
        
        this.db.mutationDeleteList(this.state["sessionData"], keyNamePair);
        let newSession = this.db.queryGetSessionData();

        this.setState(() => ({
            currentList: null,
            sessionData: {
                nextKey: newSession.nextKey,
                counter: newSession.counter,
                keyNamePairs: newSession.keyNamePairs
            }
        }), () => {
            // UPDATING LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            // TODO: CLEAR TRANSACTION STACK
            console.log("Confirm DeleteList? " + this.state["sessionData"]);
            
            this.hideDeleteListModal(); // CLOSE THE MODAL
        });
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal(keyNamePair) {
        let modal = document.getElementById("delete-modal");
        document.getElementsByClassName("dialog-header")[0].innerHTML = "Delete the Top 5 " + keyNamePair.name + " List?";
        modal.classList.add("is-visible");
        // document.getElementById("dialog-yes").onclick = this.confirmDeleteList(keyNamePair);
    }
    updateToolbarButtons = () => { // UPDATE UNDO/REDO UI
        if (this.tps.hasTransactionToUndo()) {
            document.getElementById("undo-button").classList.remove("top5-button-disabled");
            document.getElementById("undo-button").classList.add("top5-button");
            document.getElementById("undo-button").removeAttribute("disabled");
        } else {
            document.getElementById("undo-button").classList.remove("top5-button");
            document.getElementById("undo-button").classList.add("top5-button-disabled");
            document.getElementById("undo-button").setAttribute("disabled", "true");
            
        }
        if (this.tps.hasTransactionToRedo()) {
            document.getElementById("redo-button").classList.remove("top5-button-disabled");
            document.getElementById("redo-button").classList.add("top5-button");
            document.getElementById("redo-button").removeAttribute("disabled");

        } else {
            document.getElementById("redo-button").classList.remove("top5-button");
            document.getElementById("redo-button").classList.add("top5-button-disabled");
            document.getElementById("redo-button").setAttribute("disabled", "true");
        }
    }
    clearTransactions = () => {
        this.tps.clearAllTransactions();
        this.updateToolbarButtons();
    }
    addChangeItemTransaction = (id, newText) => {
        // GET CURRENT TEXT
        let oldText = this.state.currentList.items[id];
        let transaction = new ChangeItem_Transaction(this, id, oldText, newText);
        this.tps.addTransaction(transaction);
        this.updateToolbarButtons();
    }
    addMoveItemTransaction = (oldIndex, newIndex) => {
        let transaction = new MoveItem_Transaction(this, oldIndex, newIndex);
        this.tps.addTransaction(transaction);
        console.log(this.tps.toString());
        this.updateToolbarButtons();
    }
    moveItem = (oldIndex, newIndex) => { // FOR DRAG AND DROP
        // console.log(this.state);
        let prevData = this.state.currentList.items.splice(oldIndex, 1);
        this.state.currentList.items.splice(newIndex, 0, prevData[0]);

        this.setState(prevState => ({
            currentList: this.state.currentList,
        }), () => {
            // AFTER EFFECTS? UPDATE DB
            this.db.mutationUpdateList(this.state.currentList);
            // console.log(this.state.currentList.items);
        });
        // this.db.mutationUpdateSessionData(this.state.sessionData);
    }
    undo = () => {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
            this.updateToolbarButtons();
            // UPDATE DB
            this.db.mutationUpdateList(this.state.currentList);
        }
    }
    redo = () => {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
            this.updateToolbarButtons();
            // UPDATE DB
            this.db.mutationUpdateList(this.state.currentList);
        }
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }
    setListDeletion = (keyNamePair) => {
        // this.removeList.key = keyNamePair["key"];
        // this.removeList["name"] = keyNamePair["name"];
        this.removeList = keyNamePair;
        console.log("setListDeleteion: " + this.removeList);
    }
    handleKeyDown = (event) => {
        if (event.ctrlKey) {
            if (event.key === "z") {
                this.undo();
                // CHANGE STATE
            } else if (event.key === "y") {
                this.redo();
                // CHANGE STATE
            }
        }
    }
    render() {
        return (
            <div id="app-root">
                <Banner 
                    title='Top 5 Lister'
                    closeCallback={this.closeCurrentList}
                    undoCallback={this.undo}
                    redoCallback={this.redo}
                    />
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                    setListDeletionCallback={this.setListDeletion}
                />
                <Workspace
                    currentList={this.state.currentList} 
                    renameItemCallback={this.renameItem}
                    moveItemCallback={this.moveItem}
                    addMoveItemTransactionCallback={this.addMoveItemTransaction}
                    addChangeItemTransactionCallback={this.addChangeItemTransaction}
                    />
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteModal
                    listKeyPair={this.removeList}
                    confirmDeleteListCallback={this.confirmDeleteList}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                />
            </div>
        );
    }
}

export default App;
