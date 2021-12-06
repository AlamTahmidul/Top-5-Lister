import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/HighlightOff';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);

    let enabledButtonClass = "top5-button";
    function handleClose() {
        store.closeCurrentList();
    }
    function handleUser() {

    }
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    return (
        <div id="edit-toolbar">
            <Button 
                disabled={editStatus}
                id='close-button'
                onClick={handleClose}
                variant="contained">
                    <CloseIcon />
            </Button>
        </div>
    )
}

export default EditToolbar;