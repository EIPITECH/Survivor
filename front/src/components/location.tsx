import { useEffect, useRef, useState } from 'react'
import { LatLng } from 'leaflet'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import '../styles/global.css'
import iconPng from '/public/LocationIcon.png'
import L from 'leaflet'

const LOCATE_INTERVAL_MS = 10000

export default function LocationMarker() {
  var redIcon = L.icon({
    iconUrl: iconPng.src,
    iconSize: [38, 45],
    iconAnchor: [22, 64],
    popupAnchor: [-3, -76]
  });

  const [position, setPosition] = useState<LatLng | null>(null)
  const [locationEnabled, setLocationEnabled] = useState(false)
  const intervalRef = useRef<number | null>(null)

  

  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng)
    },
  })

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const { enabled } = (e as CustomEvent<{ enabled: boolean }>).detail
      setLocationEnabled(enabled)
    }
    window.addEventListener('locationToggle', handleToggle)
    return () => window.removeEventListener('locationToggle', handleToggle)
  }, [])

  useEffect(() => {
    if (!locationEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    map.locate()

    intervalRef.current = window.setInterval(() => {
      map.locate()
    }, LOCATE_INTERVAL_MS)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [locationEnabled, map])
  

  return locationEnabled && position !== null ? (
    <Marker position={position} icon={redIcon}>
      <Popup >Vous êtes ici </Popup>
    </Marker>
  ) : null
}