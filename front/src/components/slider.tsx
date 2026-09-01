import Slider from '@mui/material/Slider';

export default function SliderLocalisation() {
    return (
        <Slider
          color="primary"
          size="small"
          defaultValue={70}
          aria-label="Small"
          valueLabelDisplay="auto"
        />
    );
}