import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';

import { Grid, IconButton, MenuItem, SvgIcon, TextField, Menu } from '@mui/material';

import { ReactComponent as Logo } from './../common/images/sum.svg'
import AuthContext from '../auth';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    useEffect(() => {
        store.loadIdNamePairsBySearch("");
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }

    async function handleChange(event) {
        // console.log(event.currentTarget.value + ": " + store.buttonState);
        store.loadIdNamePairsBySearch(event.currentTarget.value);
    }

    function changeButtonState(event) {
        store.setButtonStateFrom(event.currentTarget.value);
    }

    function handleNewDate() {
        store.sortByDateNewest();
    }
    function handleOldDate() {
        store.sortByDateOldest();
    }
    function handleViews() {
        store.sortByViews();
    }
    function handleLikes() {
        store.sortByLikes();
    }
    function handleDislikes  () {
        store.sortByDislikes();
    }


    let listCard = "";

    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
    }

    return (
        <div>
            <div id="top5-list-selector">
                    <Grid container spacing={6} paddingLeft={10}>
                        <Grid item xs={10}>
                            <IconButton value={0} aria-label="home" onClick={changeButtonState} disabled={auth.user.username === "Guest"}> <HomeOutlinedIcon fontSize="large" /> </IconButton>
                            <IconButton value={1} aria-label="all-lists" onClick={changeButtonState}> <GroupsOutlinedIcon fontSize="large" /></IconButton> 
                            <IconButton value={2} aria-label="user-lists" onClick={changeButtonState}><PersonOutlineOutlinedIcon fontSize="large" /></IconButton>
                            <IconButton value={3} aria-label="community-lists" onClick={changeButtonState}>
                                <SvgIcon>
                                    <Logo />
                                </SvgIcon>
                            </IconButton>
                            <TextField id="outlined-basic" label="Search" variant="outlined" onChange={handleChange}/>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton 
                                id="demo-positioned-button"
                                aria-controls="demo-positioned-menu"
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                <Typography disabled>SORT BY</Typography>
                                <FilterListOutlinedIcon fontSize="large"/>
                            </IconButton>
                            <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                                }}
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                                }}
                            >
                                <MenuItem onClick={handleNewDate}>Publish Date (Newest)</MenuItem>
                                <MenuItem onClick={handleOldDate}>Publish Date (Oldest)</MenuItem>
                                <MenuItem onClick={handleViews}>Views</MenuItem>
                                <MenuItem onClick={handleLikes}>Likes</MenuItem>
                                <MenuItem onClick={handleDislikes}>Dislikes</MenuItem>
                            </Menu>
                        </Grid>
                    </Grid>

                <div id="list-selector-list">
                    {
                        listCard
                    }
                    <MUIDeleteModal />
                </div>
            </div>
            
            <div id="list-selector-heading" >
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
                style={{pointerEvents: "all"}}
                disabled={auth.user.username === "Guest"}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2" >Your Lists</Typography>
            </div>

        </div>
        )
}

export default HomeScreen;