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

import { Grid, IconButton, SvgIcon } from '@mui/material';

import { ReactComponent as Logo } from './../common/images/sum.svg'

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    const [buttonState, setButtonState] = useState(0); // 0-> Home, 1->all-published-lists, 2-> user-lists, 3-> community-lists

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }

    function handleHome(event) {
        console.log("CLICKING");
    }

    function changeButtonState(event) {
        setButtonState(event.currentTarget.value);
    }

    let listCard = "";

    switch (buttonState) {
        case 0: // HOME SO LOAD ID PAIRS NORMALLY
            
            break;
        case 1: // ALL-LISTS-> Only SHOW PUBLISHED LISTS
            
            break;
        case 2: // USER-LISTS -> ONLY SHOW USER's PUBLISHED LISTS
            
            break;
        case 3: // COMMUNITY-LISTS -> SHOW COMMUNITY LISTS
            
            break;
        default:
            break;
    }

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
                            <IconButton value={0} aria-label="home" onClick={changeButtonState}> <HomeOutlinedIcon fontSize="large" /> </IconButton>
                            <IconButton value={1} aria-label="all-lists" onClick={changeButtonState}> <GroupsOutlinedIcon fontSize="large" /></IconButton> 
                            <IconButton value={2} aria-label="user-lists" onClick={changeButtonState}><PersonOutlineOutlinedIcon fontSize="large" /></IconButton>
                            <IconButton value={3} aria-label="community-lists" onClick={changeButtonState}>
                                <SvgIcon>
                                    <Logo />
                                </SvgIcon>
                            </IconButton>
                            {/* TODO: Search Bar */}
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton>
                                <Typography disabled>SORT BY</Typography>
                                <FilterListOutlinedIcon fontSize="large"/>
                            </IconButton>
                        </Grid>
                    </Grid>

                <div id="list-selector-list">
                    {
                        listCard
                    }
                    <MUIDeleteModal />
                </div>
            </div>
            
            <div id="list-selector-heading">
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
                style={{pointerEvents: "all"}}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2">Your Lists</Typography>
            </div>

        </div>
        )
}

export default HomeScreen;