import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "top5-button";
    function handleUndo(event) {
        if (!store.isListNameEditActive && !store.isItemEditActive && event.detail === 1)
        {
            store.undo();
        }
    }
    function handleRedo(event) {
        if (!store.isListNameEditActive && !store.isItemEditActive && event.detail === 1)
        {
            store.redo();
        }
    }
    function handleClose(event) {
        if (!store.isListNameEditActive && !store.isItemEditActive && event.detail === 1)
        {
            history.push("/");
            store.closeCurrentList();
        }
    }
    let editStatus = false;
    if (store.isListNameEditActive || store.isItemEditActive) {
        editStatus = true;
        console.log("EDITING ITEM!");
    }
    return (
        <div id="edit-toolbar">
            <div
                disabled={editStatus}
                id='undo-button'
                onClick={handleUndo}
                className={store.canUndo() && !editStatus ? enabledButtonClass : "top5-button-disabled"}>
                &#x21B6;
            </div>
            <div
                disabled={editStatus}
                id='redo-button'
                onClick={handleRedo}
                className={store.canRedo() && !editStatus ? enabledButtonClass : "top5-button-disabled"}>
                &#x21B7;
            </div>
            <div
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                className={store.currentList != null && !editStatus ? enabledButtonClass : "top5-button-disabled"}>
                &#x24E7;
            </div>
        </div>
    )
}

export default EditToolbar;