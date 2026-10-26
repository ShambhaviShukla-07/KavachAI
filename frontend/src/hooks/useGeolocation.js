
import { useState, useEffect, useCallback } from 'react'

export const useGeolocation = () => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        setLocation({
          lat: latitude,
          lng: longitude,
          coordinates: [longitude, latitude],
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`
        })

        setLoading(false)
      },
      (geoError) => {
        setError(geoError.message || 'Unable to get location')
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    )
  }, [])

  useEffect(() => {
    refreshLocation()
  }, [refreshLocation])

  return {
    location,
    error,
    loading,
    refreshLocation
  }
}

