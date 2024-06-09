import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { button } from "../../types/types";

export default function ConfirmationDialogYesNo(props) {
    const { onClose, open, title, content } = props;

    const handleResponse = (value) => {
        onClose(value);
    }

    return(
        <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }} maxWidth="xs" open={open}>
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
            <DialogActions sx={{backgroundColor:'lightgray'}}>
                <Button variant="outlined" size="small" autoFocus onClick={()=>handleResponse(button.NO)}>NO</Button>
                <Button variant="outlined" size="small" onClick={()=>handleResponse(button.SI)}>SI</Button>
            </DialogActions>

        </Dialog>
    );
}