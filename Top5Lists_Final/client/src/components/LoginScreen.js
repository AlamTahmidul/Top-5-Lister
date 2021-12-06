import { useContext, useState } from 'react';
import AuthContext from '../auth'

import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Container, Modal, Alert, AlertTitle, IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close'

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const closeIconStyle = {
    position: 'absolute',
    right: '0%',
    top: '0%',
}

export default function LoginScreen() {
    const { auth } = useContext(AuthContext);
    
    const [errText, setErrText] = useState("");
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        auth.loginUser(
            formData.get('email'),
            formData.get('password')
        ).catch((err) => {
            console.log(err.response.data); // Gets the Error
            setErrText(err.response.data.errorMessage);
            handleOpen();
        });

    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" >
                <div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={modalStyle}>
                            <IconButton style={closeIconStyle} onClick={handleClose}>
                                <Close />
                            </IconButton>
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                <strong>{errText}</strong>
                            </Alert>
                        </Box>
                    </Modal>
                </div>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address/Username"
                                name="email"
                                autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/register/" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
            </Container>
        </ThemeProvider>
    );
}