import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../styles/global.css';
import LocationMarker from "./location"
import MarkerRed from "./marker/markerRed"
import { useState } from 'react';
import JobModal from './modal/jobModal';

export default function ContainerSetterMap() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <JobModal
        isOpen={isOpen}
        setOpen={setOpen}
        title="Job Title"
        description="Job Description"
      />
      <SurvivorMap setOpen={setOpen} />
    </>
  );
}

export function SurvivorMap({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {MarkerRed([51.505, -0.09], setOpen, "un super job wallah")}
      <LocationMarker />
    </MapContainer>
  );
}