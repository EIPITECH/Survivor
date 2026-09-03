import * as React from 'react';

import { Box, Modal, Typography } from '@mui/material';
import Button from "../buttons/Button";
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function JobModal({ isOpen, setOpen, title, description }: { isOpen: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; title: string; description: string }) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Modal style={{ zIndex: '100' }}
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {description}
          </Typography>
            <Button text="Postuler" clickable={true} link="/candidate/"/>
        </Box>
      </Modal>
    </>
  );
}