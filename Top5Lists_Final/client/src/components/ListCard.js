import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { Grid, Typography, List } from '@mui/material';
import Top5Item from './Top5Item';

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AuthContext from '../auth';



/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(AuthContext);

    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
        if (!expanded)
        {
            store.addOpenedList(idNamePair._id);
        }
        else
        {
            store.unAddOpenedList(idNamePair._id);
        }

    }; 

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
        setText(idNamePair.name);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleLike() {
        console.log(idNamePair);
        store.clickedLike(idNamePair._id, idNamePair.username);
    }

    function handleDislike() {
        store.clickedDislike(idNamePair._id, idNamePair.username);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let status =
        <IconButton type="text" aria-label="list-status" onClick={(event) => {
            handleLoadList(event, idNamePair._id)
        }}>
            <Box sx={{ p: 1, flexGrow: 1 }}>
                    <Typography variant="h6" style={{color: "red"}}>Edit</Typography>
            </Box>
        </IconButton>
    let cardClass = "original-view"
    if (idNamePair.isPublished) {
        let format = idNamePair.createdAt.substring(0, "2021-05-06".length);
        status =
        <Box sx={{ p: 1, flexGrow: 1 }}>
            <Typography variant="h6" style={{color: "green"}}>Published: {format}</Typography>
        </Box>
        cardClass = "published-view"
    }

    let editItems = "";
    if (store.currentlyOpenedLists.length > 0) {
        for (let i in store.currentlyOpenedLists)  {
            if (store.currentlyOpenedLists[i]._id === idNamePair._id) {
                let items = store.currentlyOpenedLists[i].items;
                editItems = 
                <Grid container id="top5-list-view">
                    <Grid item>
                    {
                        items.map((item, index) => (
                            <Top5Item 
                                key={'top5-item-' + (index+1)}
                                text={item}
                                index={index} 
                            />
                        ))
                    }
                    </Grid>
                </Grid>
            }
        }
    }

    let cardElement =
        <Card className={cardClass}>
            <CardContent>
                <Grid container spacing={12}>
                    <Grid item xs={8}>
                        <Grid container direction="column">
                            <Grid item xs={2}>
                                <Box sx={{ p: 1, flexGrow: 1 }} style={{fontSize: 36}} aria-label="list-name">{idNamePair.name}</Box>
                            </Grid>
                            <Grid item xs={2} aria-label="list-author">
                                <Box sx={{ p: 1, flexGrow: 1 }}>By: {idNamePair.username}</Box>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={4}>
                        <Grid container spacing={4} direction="column">
                            <Grid item xs={2} hidden={auth.user.username === "Guest"}>
                                <IconButton aria-label='like' onClick={handleLike}>
                                    <ThumbUpOffAltOutlinedIcon fontSize="large" />
                                    <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.likes.length}</Box>
                                </IconButton>
                                <IconButton aria-label='dislike' onClick={handleDislike}>
                                    <ThumbDownOffAltOutlinedIcon fontSize="large" />
                                    <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.dislikes.length}</Box>
                                </IconButton>
                                <IconButton onClick={(event) => {
                                    handleDeleteList(event, idNamePair._id)
                                }} aria-label='delete' hidden={auth.user.username !== idNamePair.username}>
                                    <DeleteOutlinedIcon fontSize="large" />
                                </IconButton>
                            </Grid>

                        </Grid>
                    </Grid>

                </Grid>
            </CardContent>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Grid container spacing={6}>
                        <Grid item xs={6}>
                            <Grid container style={{background:"#2c2f70"}}>
                                <Grid item>
                                        <Box sx={{ p: 1, flexGrow: 1 }} id="top5-list-view">
                                            <ListItem className="item-number-view"><Typography variant="h3">1.</Typography></ListItem>
                                            <ListItem className="item-number-view"><Typography variant="h3">2.</Typography></ListItem>
                                            <ListItem className="item-number-view"><Typography variant="h3">3.</Typography></ListItem>
                                            <ListItem className="item-number-view"><Typography variant="h3">4.</Typography></ListItem>
                                            <ListItem className="item-number-view"><Typography variant="h3">5.</Typography></ListItem>
                                        </Box>
                                </Grid>
                                <Grid item>
                                        {editItems}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ p: 1, flexGrow: 1 }} id="comments">COMMENTS<br/>COMMENTS<br/>COMMENTS<br/></Box>
                        </Grid>
                    </Grid>

                    {/* <ListItem
                        id={idNamePair._id}
                        key={idNamePair._id}
                        sx={{ marginTop: '15px', display: 'flex', p: 1 }}
                        style={{ width: '100%' }}
                        button
                        onClick={(event) => {
                            handleLoadList(event, idNamePair._id)
                        }
                        }
                        style={{
                            fontSize: '48pt'
                        }}
                    >
                            <Box sx={{ p: 1 }}>
                                <IconButton onClick={handleToggleEdit} aria-label='edit'>
                                    <EditIcon style={{fontSize:'48pt'}} />
                                </IconButton>
                            </Box>
                            <Box sx={{ p: 1 }}>
                                <IconButton onClick={(event) => {
                                    handleDeleteList(event, idNamePair._id)
                                }} aria-label='delete'>
                                    <DeleteIcon style={{fontSize:'48pt'}} />
                                </IconButton>
                            </Box>
                    </ListItem> */}
                </CardContent>
            </Collapse>

            <CardActions disableSpacing>
                <Grid container spacing={12}>
                    <Grid item xs={8}>
                        <Box sx={{ p: 1, flexGrow: 1 }} aria-label='views'>{status}</Box>
                    </Grid>
                    <Grid item xs={4}>
                        <IconButton type="text" aria-label="list-views" disabled>
                            <Box sx={{ p: 1, flexGrow: 1 }}>
                                    <Typography variant="h6" style={{color: "red"}}>Views: {idNamePair.views}</Typography>
                            </Box>
                        </IconButton>
                    </Grid>
                </Grid>
                <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                        >
                        
                        <KeyboardDoubleArrowDownRoundedIcon />
                </ExpandMore>
            </CardActions>
        </Card>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Top 5 List Name"
                name="name"
                autoComplete="Top 5 List Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;