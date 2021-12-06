import React, { useContext, useEffect } from 'react'
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

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }

    function handleHome(event) {
        console.log("CLICKING");
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
                            <IconButton aria-label="home" onClick={handleHome}> <HomeOutlinedIcon fontSize="large" /> </IconButton>
                            <IconButton aria-label="all-lists"> <GroupsOutlinedIcon fontSize="large" /></IconButton> 
                            <IconButton aria-label="user-lists"><PersonOutlineOutlinedIcon fontSize="large" /></IconButton>
                            <IconButton aria-label="community-lists">
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
                    aria-label="add"
                    id="add-list-button"
                    style={{background: 'transparent'}}
                    onClick={handleCreateNewList}
                >
                    <AddIcon fontSize='large' />
                </Fab>
                    <Typography variant="h2">Your Lists</Typography>
            </div>
        </div>
        )
}

export default HomeScreen;