import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';


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
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
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

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let cardElement =
    <Card>
        <CardContent>
            <Grid container spacing={12}>
                <Grid item xs={8}>
                    <Grid container spacing={3} direction="column">
                        <Grid item xs={2}>
                            <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
                        </Grid>
                        <Grid item xs={2}>
                            Author
                        </Grid>
                        <Grid item xs={2}>
                            Status
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={4}>
                    <IconButton>
                        <ThumbUpOffAltOutlinedIcon fontSize="large" />
                    </IconButton>
                    <IconButton>
                        <ThumbDownOffAltOutlinedIcon fontSize="large" />
                    </IconButton>
                </Grid>

            </Grid>
        </CardContent>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
                <ListItem
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
                </ListItem>
            </CardContent>
        </Collapse>
        
        <CardActions disableSpacing>
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