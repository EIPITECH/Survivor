import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '../styles/global.css';
import LocationMarker from "./location"
import MarkerRed from "./marker/markerRed"
import { useState } from 'react';
import JobModal from './modal/jobModal';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import BurgerMenu from './BurgerMenu';

export default function ContainerSetterMap() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <JobModal
        isOpen={isOpen}
        setOpen={setOpen}
        title="Titre job"
        description="toujours un super job"
      />
      <SurvivorMap setOpen={setOpen} />
    </>
  );
}

export function SurvivorMap({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [map, setMap] = useState();
  
  const planIgnUrl = "https://data.geopf.fr/wmts?" + "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&TILEMATRIXSET=PM" + "&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal" + "&FORMAT=image/png&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}";
  return (
    <MapContainer
      center={[48.8566, 2.3522]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ zIndex: '0', height: '600px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.ign.fr/">IGN France</a>'
        url={planIgnUrl}
        />
        <BurgerMenu />
      {MarkerRed([48.8566, 2.3522], setOpen, "Job description")}
      <LocationMarker />
    </MapContainer>
  );
}