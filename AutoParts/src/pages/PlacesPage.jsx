import { Link, useParams } from 'react-router-dom';
import AccountNav from '../AccountNav';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const { data } = await axios.get('/user-places');
        setPlaces(data);
      } catch (err) {
        console.error('Error fetching places:', err);
        setError('Error al cargar los productos.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div className="px-4 sm:px-8">
      <AccountNav />

      <div className="text-center my-6">
        <Link
          to="/account/places/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
          Añadir un producto
        </Link>
      </div>

      <div className="mt-6">
        {loading && <p className="text-center text-gray-500">Cargando productos...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && places.length === 0 && (
          <p className="text-center text-gray-600">No has añadido ningún producto todavía.</p>
        )}
        {places.map((place) => (
          <Link
            to={`/account/places/${place._id}`}
            key={place._id}
            className="flex flex-col sm:flex-row items-center gap-4 bg-gray-100 hover:bg-gray-200 p-4 rounded-2xl mb-4 transition"
          >
            <div className="w-full sm:w-32 h-32 bg-gray-300 flex items-center justify-center overflow-hidden rounded-lg">
              <img
                className="object-cover w-full h-full"
                src={`http://localhost:4000/uploads/${place.photos?.[0]}`}
                alt={`Imagen de ${place.title}`}
              />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-semibold">{place.title}</h2>
              <p className="text-sm text-gray-700 mt-1">{place.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
