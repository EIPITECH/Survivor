import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import '../../styles/global.css';
import { useState } from 'react';
import iconPng from 'leaflet/dist/images/marker-icon-2x.png';

export default function MarkerRed({ pos, onClick, description }: {
  pos: [number, number],
  onClick: () => void,
  description: string
})
 {    var redIcon = L.icon({
    iconUrl: iconPng.src,
    iconSize: [38, 45],
    iconAnchor: [22, 64],
    popupAnchor: [-3, -76]
  });
  console.log("MarkerRed pos:", pos, "description:", description);

  return (
    <Marker
      aria-label="Icone offre d'emploi"
      position={pos}
      icon={redIcon}
      eventHandlers={{
        mouseover: (e) => e.target.openPopup(),
        mouseout: (e) => e.target.closePopup(),
        click: onClick
      }}
    >
      <Popup>{description}</Popup>
    </Marker>
  );
}