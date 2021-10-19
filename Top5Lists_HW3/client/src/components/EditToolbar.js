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
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    return (
        <div id="edit-toolbar">
            <div
                disabled={editStatus || store.canUndo()}
                id='undo-button'
                onClick={handleUndo}
                className={store.canUndo() ? enabledButtonClass : "top5-button-disabled"}>
                &#x21B6;
            </div>
            <div
                disabled={editStatus || store.canRedo()}
                id='redo-button'
                onClick={handleRedo}
                className={store.canRedo() ? enabledButtonClass : "top5-button-disabled"}>
                &#x21B7;
            </div>
            <div
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                className={store.currentList != null ? enabledButtonClass : "top5-button-disabled"}>
                &#x24E7;
            </div>
        </div>
    )
}

export default EditToolbar;