import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
      window.scrollTo(0, 0); // opcional: mejora la UX al navegar
    });
  }, [id]);

  if (!place) return <div className="p-8 text-center text-gray-500">Cargando lugar...</div>;

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-800 mb-1">{place.title}</h1>

      {/* Dirección */}
      <AddressLink>{place.address}</AddressLink>

      {/* Galería de imágenes */}
      <PlaceGallery place={place} />

      {/* Descripción y reserva */}
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="font-semibold text-2xl text-gray-800 mb-2">Descripción</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {place.description}
          </p>
        </div>

        <div>
          <BookingWidget place={place} />
        </div>
      </div>

      {/* Información Extra */}
      {place.extraInfo && (
        <div className="bg-white -mx-8 px-8 py-8 border-t">
          <h2 className="font-semibold text-2xl text-gray-800 mb-2">Información Extra</h2>
          <p className="text-sm text-gray-700 leading-5 whitespace-pre-line">{place.extraInfo}</p>
        </div>
      )}
    </div>
  );
}
