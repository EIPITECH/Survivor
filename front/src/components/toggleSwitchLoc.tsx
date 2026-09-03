import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function SwitchLocation() {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = event.target.checked;
    setChecked(isEnabled);
    window.dispatchEvent(
      new CustomEvent('locationToggle', { detail: { enabled: isEnabled } })
    );
  };

  return (
    <FormControlLabel control={<Switch checked={checked} onChange={handleChange} />} label="Localisation"
    />
  );
}