import { useState, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { lightGrayGradient } from '../../consts/consts';
import './mapperModule.css';

const MAP_API_KEY = import.meta.env.VITE_MAP_API_KEY;

export default function RouteMap(places) {
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const markerRef = useRef([]);

  if (!MAP_API_KEY) {
    console.error('MAP_API_KEY is not defined in environment variables');
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">
          Map API key is not configured. Please check your environment variables.
        </Typography>
      </Box>
    );
  }

  const getIcon = (iconType) => {
    switch (iconType) {
      case 1:
        return "/DarkGreenLG.png";
      case 2:
        return "/House.png";
      case 3:
        return "/OrangeLG.png";
    }
  }

  // Function to check if today is between arrive and depart dates
  const isCurrentLocation = (arriveDate, departDate) => {
    const today = new Date();
    const arrive = new Date(arriveDate);
    const depart = new Date(departDate);

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    arrive.setHours(0, 0, 0, 0);
    depart.setHours(0, 0, 0, 0);

    return today >= arrive && today <= depart;
  };

  const handleMapClick = () => {
    if (infoWindowOpen) {
      setInfoWindowOpen(false);
      return;
    }
  }

  const handleMarkerClick = (marker, index) => {
    if (infoWindowOpen) {
      setInfoWindowOpen(false);
      return;
    }
    setActiveMarker(marker);
    setInfoWindowOpen(true);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 64px)',
        position: 'relative',
        minHeight: '400px',
        margin: 0,
        padding: -24,
        left: 0,
        top: 0
      }}
    >
      <APIProvider apiKey={MAP_API_KEY} onLoad={() => console.log('Maps API has loaded. Places:', places.places)}>
        <Map
          onClick={handleMapClick}
          style={{ width: '100%', height: '100%' }}
          defaultZoom={5.9}
          defaultCenter={{ lat: 41.5299, lng: -112.8143 }}
          mapId='159429afc70f3824'
        >
          {
            places.places.map((place, i) => {
              const isCurrent = isCurrentLocation(place.place_arrive, place.place_depart);

              return (
                <AdvancedMarker
                  key={i}
                  position={{ lat: place.place_lat, lng: place.place_lng }}
                  onClick={() => handleMarkerClick(markerRef.current[i], i)}
                  ref={(el) => (markerRef.current[i] = el)}
                  className={isCurrent ? 'current-location-pin' : ''}
                >
                  {infoWindowOpen && activeMarker === markerRef.current[i] && (
                    <InfoWindow
                      anchor={activeMarker}
                      onCloseClick={() => setInfoWindowOpen(false)}
                    >
                      <Box
                        sx={{
                          border: 1,
                          borderColor: 'grey.400',
                          p: 2,
                          borderRadius: 3,
                          background: { lightGrayGradient },
                          minWidth: 200,
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {place.place_name}
                          {isCurrent && (
                            <Typography
                              component="span"
                              sx={{
                                color: 'success.main',
                                fontWeight: 'bold',
                                ml: 1,
                                fontSize: '0.8rem'
                              }}
                            >
                              (CURRENT)
                            </Typography>
                          )}
                        </Typography>
                        <Typography variant="body2">
                          {place.place_hide_info ? "" : place.place_address}
                        </Typography>
                        <Typography variant="body2">
                          {place.place_hide_info ? "" : place.place_phone}
                        </Typography>
                        <Typography variant="body2">
                          {place.place_arrive.substr(0, 10)} to {place.place_depart.substr(0, 10)}
                        </Typography>
                      </Box>
                    </InfoWindow>
                  )}

                  <Pin
                    glyph={new URL(window.location.origin + getIcon(place.place_icon_type))}
                  />
                </AdvancedMarker>
              )
            })
          }
        </Map>
      </APIProvider>
    </Box>
  )
};