import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axios from "axios";
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

export const StartModal = ({ gameId }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(true);

  const handleCancel = async () => {
    try {
      const response = await axios.post("/gambit/cancelgame", {
        gameId: gameId,
      });
      if (response.data.status) {
        toast.info(response.data.result);
      } else {
        toast.error(response.data.error);
      }
      navigate("/home");
    } catch (err) {
      toast.error("Some error occured!");
      navigate("/home");
    }
  };

  const copyGameId = () =>{
    navigator.clipboard.writeText(gameId).then(()=>{
        toast.info("GameId copied to Clipboard!")
    }).catch(err =>{
        toast.error("Unable to copy gameId");
    })
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
            Waiting for Opponent...
          </Typography>
          <Typography>
            <span className="font-bold">GameId : </span>
            <span className="hover:underline cursor-default" onClick={copyGameId}>{gameId}</span>
          </Typography>
          <div className="flex flex-col items-center">
            <button className="border-2 p-2 mt-6" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
