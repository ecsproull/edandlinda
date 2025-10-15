
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RouteMap from "./mapper";
import TripList from "./triplist";
import { api, apiHelpers  } from "../../api/api";

export default function Map() {
  const [tripPoints, setTripPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function fetchTripPoints() {
      try {
        setLoading(true);
        const response = await api.places.getAll();
        setTripPoints(response.data);
        setError(null);
      } catch (error) {
        apiHelpers.handleError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchTripPoints();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Render different components based on the path
  if (location.pathname === '/triplist') {
    return <TripList tripPoints={tripPoints} />;
  }

  // Default to showing the map
  return (
    <RouteMap places={tripPoints} />
  );
}