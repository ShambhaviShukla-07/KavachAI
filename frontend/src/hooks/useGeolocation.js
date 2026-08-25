import { useState, useEffect } from 'react'

export const useGeolocation = () => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) { setError('Geolocation not supported'); return }
    const watcher = navigator.geolocation.watchPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, coordinates: [pos.coords.longitude, pos.coords.latitude] }),
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    )
    return () => navigator.geolocation.clearWatch(watcher)
  }, [])

  return { location, error }
}
