import { useEffect, useState } from 'react'
import { LatLng } from 'leaflet'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import '../styles/global.css'

export default function LocationMarker() {
  const [position, setPosition] = useState<LatLng | null>(null)
  const [locationEnabled, setLocationEnabled] = useState(false)

  const map = useMapEvents({
    click() {
      if (!locationEnabled) return
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const { enabled } = (e as CustomEvent<{ enabled: boolean }>).detail
      setLocationEnabled(enabled)
      if (enabled) {
        map.locate()
      }
    }
    window.addEventListener('locationToggle', handleToggle)
    return () => window.removeEventListener('locationToggle', handleToggle)
  }, [map])

  return locationEnabled && position !== null ? (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null
}