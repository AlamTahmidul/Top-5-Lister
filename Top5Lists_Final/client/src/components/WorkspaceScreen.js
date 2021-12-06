import { useContext } from 'react'
import Top5Item2 from './Top5Item2.js'
import List from '@mui/material/List';
import { Button, ButtonGroup, Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/

const buttonPlacementStyle = {
    position: 'absolute',
    textAlign: 'center',
    bottom: "0%",
    right: "-100%",
    fontSize: '24pt',
    fontWeight: 'bold',
}

function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);

    function handleSave() {
        store.savePublish("save");
    }

    function handlePublish() {
        store.savePublish("publish");
    }

    let editItems = "";
    if (store.currentList) {
        editItems = 
            <List id="edit-items" sx={{ width: '100%', bgcolor: 'blue' }}>
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item2 
                            key={'top5-item-' + (index+1)}
                            text={item}
                            index={index} 
                        />
                    ))
                }
                <ButtonGroup color="primary" aria-label="medium secondary button group" style={buttonPlacementStyle}>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handlePublish}>Publish</Button>
                </ButtonGroup>
                
            </List>;
    }
    return (
        <div id="top5-workspace">
            <div id="workspace-edit">
                <div id="edit-numbering">
                    <div className="item-number"><Typography variant="h3">1.</Typography></div>
                    <div className="item-number"><Typography variant="h3">2.</Typography></div>
                    <div className="item-number"><Typography variant="h3">3.</Typography></div>
                    <div className="item-number"><Typography variant="h3">4.</Typography></div>
                    <div className="item-number"><Typography variant="h3">5.</Typography></div>
                </div>
                {editItems}
            </div>
        </div>
    )
}

export default WorkspaceScreen;