import React, { useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '90vh',
};

const center = {
  lat: 32.0853,
  lng: 34.7818,
};

function MapWithGooglePlaces() {
  const [directions, setDirections] = useState(null);
  const [places, setPlaces] = useState([]);

  const handleDirectionsCallback = (response) => {
    if (response !== null && response.status === 'OK') {
      setDirections(response);

      // Get route points and search places along the route (optional simplification)
      const routePoints = response.routes[0].overview_path;
      // Pick every 20th point for nearby search
      for (let i = 0; i < routePoints.length; i += 20) {
        searchNearbyRestaurants(routePoints[i]);
      }
    } else {
      console.error('Directions request failed');
    }
  };

  const searchNearbyRestaurants = (location) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(
      {
        location,
        radius: 1000, // meters from point
        type: 'restaurant',
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaces(prev => [...prev, ...results]);
        }
      }
    );
  };

  return (
    <div>
      <h2>RoadEat - Live Restaurants from Google API</h2>
      <LoadScript googleMapsApiKey="AIzaSyAgSKju-_3E-9JRqkaelFMFg4SI8IXH_jE" libraries={['places']}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
        >
          <DirectionsService
            options={{
              destination: 'Petah Tikva, Israel',
              origin: 'Tel Aviv, Israel',
              travelMode: window.google.maps.TravelMode.DRIVING,
            }}
            callback={handleDirectionsCallback}
          />

          {directions && (
            <DirectionsRenderer directions={directions} />
          )}

          {places.map((place, index) => (
            <Marker
              key={index}
              position={place.geometry.location}
              title={place.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default MapWithGooglePlaces;
