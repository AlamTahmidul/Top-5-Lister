import { Grid, Button, Typography } from '@mui/material';


const defSize = 95;



export default function SplashScreen() {
    return (
        <div id="splash-screen">
            <Typography variant="h3" color="#2c2f70" paddingTop="1%"> <b>Welcome to the Top 5 Lister</b> </Typography>
            
            <Typography variant="h4" color="#d4d4f5" paddingTop="1%" paddingBottom="2%"> Find Your New Top 5 Favorites </Typography>

            <div> <Button sx={{border: 1}} style={{maxWidth: defSize + 'px', maxHeight: 95 + 'px', minWidth: defSize + 'px', minHeight: 95 + 'px', backgroundColor: "#d4af37", color: "black"}} variant="text" size="large"><b>Login</b></Button> </div>
            <div> <Button sx={{border: 1}} style={{maxWidth: defSize + 'px', maxHeight: defSize + 'px', minWidth: defSize + 'px', minHeight: defSize + 'px', backgroundColor: "#d4af37", color: "black"}} variant="text" size="large"><b>Create Account</b></Button> </div>
            <div> <Button sx={{border: 1}} style={{maxWidth: defSize + 'px', maxHeight: defSize + 'px', minWidth: defSize + 'px', minHeight: defSize + 'px', backgroundColor: "#d4af37", color: "black"}} variant="text" size="large"><b>Continue as Guest</b></Button> </div>
            <div> <Typography variant="h5" color="#d4af37" paddingTop="3%"><b>Developed by: Tahmidul Alam</b></Typography></div>
        </div>
    )
}