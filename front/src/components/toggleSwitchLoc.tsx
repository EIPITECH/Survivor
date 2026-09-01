import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function SwitchLocation() {
  return (
        <FormControlLabel control={<Switch defaultChecked />} label="Location" />  
    );
}
