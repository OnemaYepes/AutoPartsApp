import { useState } from "react";
import Image from "./Image.jsx";

export default function PlaceGallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-black text-white z-50 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Fotos de {place.title}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="flex items-center gap-2 py-2 px-4 rounded-xl bg-white text-black hover:bg-blue-600 hover:text-white transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.361a1 1 0 011.415 1.414L13.414 10.586l4.361 4.361a1 1 0 01-1.415 1.415L12 12l-4.361 4.361a1 1 0 01-1.414-1.415l4.36-4.36-4.36-4.361a1 1 0 010-1.414z" />
              </svg>
              Cerrar
            </button>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {place?.photos?.map((photo, index) => (
              <Image key={index} src={photo} alt={`Foto ${index + 1}`} className="rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2">
        <div>
          {place.photos?.[0] && (
            <Image
              onClick={() => setShowAllPhotos(true)}
              className="w-full h-full aspect-square object-cover cursor-pointer"
              src={place.photos[0]}
              alt="Principal"
            />
          )}
        </div>
        <div className="grid grid-rows-2 gap-2">
          {place.photos?.[1] && (
            <Image
              onClick={() => setShowAllPhotos(true)}
              className="w-full h-full object-cover aspect-square cursor-pointer"
              src={place.photos[1]}
              alt="Secundaria 1"
            />
          )}
          {place.photos?.[2] && (
            <Image
              onClick={() => setShowAllPhotos(true)}
              className="w-full h-full object-cover aspect-square cursor-pointer"
              src={place.photos[2]}
              alt="Secundaria 2"
            />
          )}
        </div>
      </div>

      <button
        onClick={() => setShowAllPhotos(true)}
        className="absolute bottom-4 right-4 flex items-center gap-2 bg-white text-black py-2 px-4 rounded-xl shadow-md hover:bg-blue-600 hover:text-white transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm5.25 3A.75.75 0 018 8.25h8a.75.75 0 010 1.5H8A.75.75 0 018.25 9zm0 3a.75.75 0 010-1.5h8a.75.75 0 010 1.5H8.25zm0 3a.75.75 0 010-1.5h5.5a.75.75 0 010 1.5h-5.5z" clipRule="evenodd" />
        </svg>
        Mostrar más fotos
      </button>
    </div>
  );
}
