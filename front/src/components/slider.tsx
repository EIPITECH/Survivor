import { colors } from '@mui/material';
import Slider from '@mui/material/Slider';

export default function SliderLocalisation() {
    return (
        <Slider
          sx={{ color: '#FFA500' }}
          size="small"
          defaultValue={70}
          aria-label="Small"
          valueLabelDisplay="auto"
        />
    );
}