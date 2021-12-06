import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { Typography } from "@mui/material";
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item2(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(true);
    const [text, setText] = useState("");

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let index = event.target.id.substring("list-".length);
            let text = event.target.value;
            store.addUpdateItemTransaction(index-1, text);
            toggleEdit();
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function handleUpdateText(event) {
        setText(event.target.value);
        console.log(text);
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsItemEditActive();
        }
        setEditActive(newActive);
    }

    let editStatus = false;
    if (store.isItemEditActive) {
        editStatus = true;
    }
    let { index } = props;

    let cardElement =
            <ListItem
                id={'item-' + (index+1)}
                className={"top5-item"}
                sx={{ display: 'flex', p: 1 }}
                style={{background: "#d4af37", color: "#2c2f70", width: "100%"}}
            >
            {/* <Box sx={{ p: 1 }}>
                <IconButton onClick={handleToggleEdit} aria-label='edit'>
                    <EditIcon style={{fontSize:'48pt'}}  />
                </IconButton>
            </Box> */}
                <Typography variant="h3">{props.text}</Typography>
            </ListItem>

    // let cardElement =  
    //     <TextField
    //         margin="normal"
    //         required
    //         fullWidth
    //         id={"item-" + (index+1)}
    //         label={"Item #" + (index+1)}
    //         name="item"
    //         autoComplete="Top 5 List Item"
    //         className='top5-item'
    //         onKeyPress={handleKeyPress}
    //         onChange={handleUpdateText}
    //         defaultValue={props.text}
    //         inputProps={{style: {fontSize: 48}}}
    //         InputLabelProps={{style: {fontSize: 24}}}
    //         autoFocus
    //     />

    if (editActive) {
        cardElement =    
            <TextField
                margin="normal"
                required
                fullWidth
                id={"item-" + (index+1)}
                label={"Item #" + (index+1)}
                name="item"
                autoComplete="Top 5 List Item"
                className='top5-item'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={props.text}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default Top5Item2;