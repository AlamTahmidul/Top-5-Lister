import { jsTPS_Transaction } from "../jsTPS";

/**
 * ChangeItem_Transaction: TODO
 * 
 * This class represents a transaction that updates the text
 * for a given item. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class ChangeItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, initId, initOldText, initNewText) {
        super();
        this.model = initModel;
        this.id = initId;
        this.oldText = initOldText;
        this.newText = initNewText;
    }

    doTransaction() {
        // this.model.changeItem(this.id, this.newText);
        console.log("DID TRANSACTION in CHANGE_ITEM");
    }
    
    undoTransaction() {
        // this.model.changeItem(this.id, this.oldText);
        console.log("UNDID TRANSACTION in CHANGE_ITEM");
    }
}