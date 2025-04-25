import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = 'http://localhost:4000'; // Ajusta para producción

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    axios.get('/places')
      .then(response => {
        setPlaces(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching places:", err);
        setError("No se pudieron cargar los productos. Intenta de nuevo.");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="text-center mt-10 text-gray-500">Cargando lugares...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (places.length === 0) {
    return <div className="text-center mt-10 text-gray-500">No hay productos disponibles por el momento.</div>;
  }

  return (
    <div className="mt-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
      {places.map(place => (
        <Link
          to={'/places/' + place._id}
          key={place._id}
          className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden group"
        >
          <div className="relative aspect-square w-full overflow-hidden">
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              {place.photos?.[0] ? (
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                  src={`${backendUrl}/uploads/${place.photos[0]}`}
                  alt={`Foto de ${place.title || 'alojamiento'}`}
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <span className="text-gray-400 text-sm">Sin imagen</span>
              )}
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold truncate mb-1 text-gray-800">
              {place.title}
            </h3>
            <h4 className="text-sm text-gray-600 truncate mb-2">
              {place.address}
            </h4>
            <div className="mt-1 text-lg">
              <span className="font-bold text-gray-900">${place.price}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}