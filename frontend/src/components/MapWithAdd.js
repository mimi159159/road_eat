import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '90vh',
};

const center = {
  lat: 32.0853,
  lng: 34.7818,
};

function MapWithAdd() {
  const [places, setPlaces] = useState([]);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = () => {
    axios.get('http://127.0.0.1:8000/api/places/')
      .then(res => setPlaces(res.data))
      .catch(err => console.error(err));
  }

  const handleMapClick = (e) => {
    setClickedLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }

  const addPlace = () => {
    if (!name || !clickedLocation) {
      alert("Click on the map and enter a name");
      return;
    }

    axios.post('http://127.0.0.1:8000/api/places/add/', {
      name,
      lat: clickedLocation.lat,
      lng: clickedLocation.lng
    })
      .then(() => {
        fetchPlaces();
        setName(""); setClickedLocation(null);
      })
      .catch(err => console.error(err));
  }

  return (
    <div>
      <h2>RoadEat Map - Click to Add Restaurant</h2>

      {clickedLocation && (
        <div>
          <p>Lat: {clickedLocation.lat} | Lng: {clickedLocation.lng}</p>
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <button onClick={addPlace}>Add Place Here</button>
        </div>
      )}

      <LoadScript googleMapsApiKey="AIzaSyAgSKju-_3E-9JRqkaelFMFg4SI8IXH_jE">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onClick={handleMapClick}
        >
          {places.map((place, index) => (
            <Marker
              key={index}
              position={{ lat: parseFloat(place.lat), lng: parseFloat(place.lng) }}
              title={place.name}
            />
          ))}
          {clickedLocation && (
            <Marker
              position={clickedLocation}
              label="New"
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default MapWithAdd;
