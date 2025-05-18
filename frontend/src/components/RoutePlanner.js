import React, { useState } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '90vh' };


function RoutePlanner({ token }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  const [places, setPlaces] = useState([]);
  const [eta, setEta] = useState('');
  const [distance, setDistance] = useState('');

const calculateRoute = () => {
  const DirectionsServiceInstance = new window.google.maps.DirectionsService();
  DirectionsServiceInstance.route(
    { origin, destination, travelMode: window.google.maps.TravelMode.DRIVING },
    (result, status) => {
      if (status === 'OK') {
        setDirections(result);
        setPlaces([]);

        
        const leg = result.routes[0].legs[0];
        setEta(leg.duration.text);
        setDistance(leg.distance.text);

       
        const routePoints = result.routes[0].overview_path;
        for (let i = 0; i < routePoints.length; i += 20) {
          searchRestaurants(routePoints[i]);
        }

        
        axios.post('http://127.0.0.1:8000/api/routes/', 
          { origin, destination, eta: leg.duration.text, distance: leg.distance.text }, 
          { headers: { Authorization: `Bearer ${token}` } }
        ).then(() => console.log('Route and ETA saved to Django'));
      } else {
        console.error('Route failed');
      }
    }
  );
};


  const searchRestaurants = (location) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(
      { location, radius: 1000, type: 'restaurant' },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaces(prev => [...prev, ...results]);
        }
      }
    );
  };

  return (
    <div>
      <input placeholder="Origin" value={origin} onChange={e => setOrigin(e.target.value)} />
      <input placeholder="Destination" value={destination} onChange={e => setDestination(e.target.value)} />
      <button onClick={calculateRoute}>Calculate Route</button>
        {directions && eta && (
            <h3>Estimated Time of Arrival (ETA): {eta} - Distance: {distance}</h3>
         )}
      <LoadScript googleMapsApiKey="AIzaSyAgSKju-_3E-9JRqkaelFMFg4SI8IXH_jE" libraries={['places']}>
        <GoogleMap mapContainerStyle={mapContainerStyle} center={{ lat: 32.0853, lng: 34.7818 }} zoom={12}>
          {directions && <DirectionsRenderer directions={directions} />}
          {places.map((place, i) => (
            <Marker key={i} position={place.geometry.location} title={place.name} />
          ))}
        </GoogleMap>
      </LoadScript>

      <h3>Restaurants on route:</h3>
      <ul>
        {places.map((place, i) => <li key={i}>{place.name}</li>)}
      </ul>
    </div>
  );
}

export default RoutePlanner;
