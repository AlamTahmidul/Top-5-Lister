import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import { TextField } from '@mui/material';
import AuthContext from '../auth';

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);

    const [newText, setnewText] = useState("");
    let text;
    let output;
    function handleKeyPress() {
        store.changeListName(store.currentList._id, newText);
        output=<Typography variant="h3">{store.currentList.name}</Typography>   
    }

    function handleUpdateText(event) {
        if (event.target.value == "")
            setnewText("default text");
        else
            setnewText(event.target.value);
    }

    if (store.currentList && (auth.loggedIn && auth.user.username !== "Guest"))
        text = store.currentList.name
    output = <div id="top5-statusbar" style={{background:"transparent"}} >
        {/* <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + 0}
                label="Top 5 List Name"
                name="name"
                autoComplete="Top 5 List Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={text}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            /> */}
            <TextField required id="outlined-basic" label="Search" variant="outlined" onChange={handleUpdateText} onKeyPress={handleKeyPress}/>
    </div>
    if (!store.currentList)
        output = "";
    return (
        output
    );
}

export default Statusbar;