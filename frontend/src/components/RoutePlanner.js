import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  GoogleMap, LoadScript, DirectionsRenderer, Marker, Autocomplete, InfoWindow
} from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '90vh' };

function RoutePlanner({ token }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  const [places, setPlaces] = useState([]);
  const [eta, setEta] = useState('');
  const [distance, setDistance] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [maxDistanceKm, setMaxDistanceKm] = useState(8);
  const [maxEtaMinutes, setMaxEtaMinutes] = useState(20);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalPlace, setModalPlace] = useState(null);
  const [waypoint, setWaypoint] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const locationWatcher = useRef(null);
  const lastUpdateTime = useRef(0);

  const [originAutocomplete, setOriginAutocomplete] = useState(null);
  const [destinationAutocomplete, setDestinationAutocomplete] = useState(null);

  const handleOriginLoad = (autocomplete) => setOriginAutocomplete(autocomplete);
  const handleDestinationLoad = (autocomplete) => setDestinationAutocomplete(autocomplete);

  const handleOriginSelect = () => {
    const place = originAutocomplete?.getPlace();
    if (place?.formatted_address) {
      setOrigin(place.formatted_address);
    }
  };

  const handleDestinationSelect = () => {
    const place = destinationAutocomplete?.getPlace();
    if (place?.formatted_address) {
      setDestination(place.formatted_address);
    }
  };

  const calculateRoute = (overrideOrigin = null, overrideWaypoint = null) => {
  const DirectionsServiceInstance = new window.google.maps.DirectionsService();

  const originToUse = overrideOrigin ? overrideOrigin : origin;
  const finalWaypoint = overrideWaypoint || waypoint;

  const routeConfig = {
    origin: originToUse,
    destination,
    travelMode: window.google.maps.TravelMode.DRIVING
  };

  if (finalWaypoint) {
    routeConfig.waypoints = [{ location: finalWaypoint, stopover: true }];
  }

  DirectionsServiceInstance.route(routeConfig, (result, status) => {
    if (status === 'OK') {
      setDirections(result);
      setPlaces([]);

      const allLegs = result.routes[0].legs;
      const totalDuration = allLegs.reduce((sum, leg) => sum + leg.duration.value, 0);
      const totalDistance = allLegs.reduce((sum, leg) => sum + leg.distance.value, 0);
      const etaStr = Math.round(totalDuration / 60) + ' min';
      const distanceStr = (totalDistance / 1000).toFixed(1) + ' km';

      setEta(etaStr);
      setDistance(distanceStr);

      if (!finalWaypoint) {
        const routePoints = result.routes[0].overview_path;
        for (let i = 0; i < routePoints.length; i += 20) {
          searchRestaurants(routePoints[i]);
        }
      }

      const originStr = typeof originToUse === 'string'
        ? originToUse
        : `${originToUse.lat},${originToUse.lng}`;

      axios.post('http://127.0.0.1:8000/api/routes/',
        { origin: originStr, destination, eta: etaStr, distance: distanceStr },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      console.error('Directions request failed due to', status);
    }
  });
};


  const handleLetsGo = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(current);
        setPlaces([]);
        calculateRoute(current);

        // Start tracking location
        if (locationWatcher.current) {
          navigator.geolocation.clearWatch(locationWatcher.current);
        }

        locationWatcher.current = navigator.geolocation.watchPosition(
          (pos) => {
            const now = Date.now();
            if (now - lastUpdateTime.current > 5000) { // 5 second throttle
              lastUpdateTime.current = now;
              const updated = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
              };
              setUserLocation(updated);
              calculateRoute(updated);
            }
          },
          console.error,
          { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
        );
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const searchRestaurants = (location) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(
      {
        location,
        radius: 1000 * (showFilters ? maxDistanceKm : 8),
        type: 'restaurant'
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const filtered = showFilters ? results.filter(r => {
            const drivingTime = r.duration?.value || 0;
            return drivingTime / 60 <= maxEtaMinutes;
          }) : results;

          if (filtered.length === 0) {
            alert('No restaurants found for the given filters.');
          }

          setPlaces(prev => [...prev, ...filtered]);
        }
      }
    );
  };

  const renderPlaceInfo = (place) => (
    <div>
      <h4>{place.name}</h4>
      <p>⭐ {place.rating || 'N/A'} — {place.types?.find(t => t !== 'restaurant') || 'restaurant'}</p>
      <button onClick={() => {
        setWaypoint(place.geometry.location);
        setPlaces([]);
        setModalPlace(null);
        setSelectedPlace(null);
        calculateRoute(null, place.geometry.location);
      }}>Add to Route</button>
    </div>
  );

  return (
    <div>
      <h2>Route Planner</h2>

      <LoadScript googleMapsApiKey="AIzaSyAgSKju-_3E-9JRqkaelFMFg4SI8IXH_jE" libraries={['places']}>
        <Autocomplete onLoad={setOriginAutocomplete} onPlaceChanged={handleOriginSelect}>
          <input placeholder="Origin" value={origin} onChange={e => setOrigin(e.target.value)} />
        </Autocomplete>

        <Autocomplete onLoad={setDestinationAutocomplete} onPlaceChanged={handleDestinationSelect}>
          <input placeholder="Destination" value={destination} onChange={e => setDestination(e.target.value)} />
        </Autocomplete>

        <button onClick={() => setShowFilters(prev => !prev)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {showFilters && (
          <div>
            <label>Max Distance (km): </label>
            <input type="number" value={maxDistanceKm} onChange={e => setMaxDistanceKm(e.target.value)} />
            <label>Max Time (min): </label>
            <input type="number" value={maxEtaMinutes} onChange={e => setMaxEtaMinutes(e.target.value)} />
          </div>
        )}

        <button onClick={() => calculateRoute()}>Calculate Route</button>
        <button onClick={handleLetsGo}>Let's Go</button>

        {directions && eta && (
          <h3>Estimated Time of Arrival (ETA): {eta} - Distance: {distance}</h3>
        )}

        <GoogleMap mapContainerStyle={mapContainerStyle} center={userLocation || { lat: 32.0853, lng: 34.7818 }} zoom={12}>
          {directions && <DirectionsRenderer directions={directions} />}

          {places.map((place, i) => (
            <Marker
              key={i}
              position={place.geometry.location}
              onClick={() => setSelectedPlace(place)}
              title={place.name}
            />
          ))}

          {waypoint && (
            <Marker
              position={waypoint}
              icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
              title="Stop"
            />
          )}

          {destination && directions?.routes[0]?.legs?.slice(-1)[0] && (
            <Marker
              position={directions.routes[0].legs.slice(-1)[0].end_location}
              icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
              title="Final Destination"
            />
          )}

          {userLocation && (
            <Marker
              position={userLocation}
              icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
              title="Your Location"
            />
          )}

          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.geometry.location}
              onCloseClick={() => setSelectedPlace(null)}
            >
              {renderPlaceInfo(selectedPlace)}
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      <h3>Restaurants on route:</h3>
      <ul>
        {places.map((place, i) => (
          <li key={i} style={{ cursor: 'pointer' }} onClick={() => setModalPlace(place)}>{place.name}</li>
        ))}
      </ul>

      {modalPlace && (
        <div style={{ position: 'fixed', top: '20%', left: '35%', padding: '1rem', backgroundColor: 'white', border: '1px solid #ccc', zIndex: 1000 }}>
          <button onClick={() => setModalPlace(null)} style={{ float: 'right' }}>✖</button>
          {renderPlaceInfo(modalPlace)}
        </div>
      )}
    </div>
  );
}

export default RoutePlanner;
