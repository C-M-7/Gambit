import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: 200,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  export const EndModal = ({ gameId, gameRes, closeEndModal }) => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(true);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(true);

    const takeToHome = () =>{
        closeEndModal(true);
        navigate('/home');
    }
  
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <span className="font-bold text-xl">{gameRes}</span>
            </Typography>
            <Typography>
              <span className="font-bold">GameId : </span>
              <span>{gameId}</span>
            </Typography>
            <div className="flex flex-col items-center">
              <button className="border-2 p-2 mt-6" onClick={takeToHome}>
                Home
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    );
  };