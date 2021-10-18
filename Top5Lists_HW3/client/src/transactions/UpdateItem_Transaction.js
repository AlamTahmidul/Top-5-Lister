import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * UpdateItem_Transaction
 * 
 * This class represents a transaction that works with editing
 * list items. It will be managed by the transaction stack.
    
    @author McKilla Gorilla
 */
export default class UpdateItem_Transaction extends jsTPS_Transaction {
    constructor(initStore, initIndex, initOldText, initNewText) {
        super();
        this.store = initStore;
        this.index = initIndex;
        this.oldText = initOldText;
        this.newText = initNewText;
    }

    doTransaction() {
        this.store.updateItem(this.index, this.newText);
    }
    
    undoTransaction() {
        this.store.updateItem(this.index, this.oldText);
    }
}