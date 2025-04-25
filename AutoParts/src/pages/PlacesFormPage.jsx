import Perks from '../Perks';
import axios from 'axios';
import PhotosUploader from '../PhotosUploader';
import { useEffect, useState } from 'react';
import AccountNav from '../AccountNav';
import { Navigate, useParams } from 'react-router-dom';

export default function PlacesFormPage() {
  const {id} = useParams();

  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos,setAddedPhotos] = useState([]);
  const [description,setDescription] = useState('');
  const [perks,setPerks] = useState([]);
  const [extraInfo,setExtraInfo] = useState('');
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [maxGuests,setMaxGuests] = useState(1);
  const [price,setPrice] = useState(10000);
  const [redirect,setRedirect] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/places/'+id).then(response => {
      const {data} = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  function inputHeader(text) {
    return (
      <h2 className="text-2xl mt-4">{text}</h2>
    );
  }

  function inputDescription(text) {
    return (
      <p className="text-gray-500 text-sm">{text}</p>
    );
  }

  function preInput(header,description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title, address, addedPhotos,
      description, perks, extraInfo,
      checkIn, checkOut, maxGuests, price,
    };
    if (id) {
      // update
      await axios.put('/places', {
        id, ...placeData
      });
      setRedirect(true);

    } else {
      // new place
      await axios.post('/places', placeData);
      setRedirect(true);
    }
    
  }

  if (redirect) {
    return <Navigate to={'/account/places'} />
  }

  return (
    <div>
      <AccountNav/>
          <form className='mx-30 ' onSubmit={savePlace}>
            {preInput('Título', 'Ponle un nombre breve a tu producto')}
            <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder='Por ejemplo: Llantas' />
            {preInput('Dirección', '¿Dónde está ubicado?')}
            <input type="text" value={address} onChange={ev => setAddress(ev.target.value)} placeholder='Dirección' />
            {preInput('Fotos', 'Más es mejor')}
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
            {preInput('Descripción', 'Pinta con palabras')}
            <textarea value={description} onChange={ev => setDescription(ev.target.value)}/>
            {preInput('Beneficios', 'Selecciona los atributos del sitio')}
            <div className='mt-2 grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6'>
              <Perks selected={perks} onChange={setPerks}/>
            </div>
            {preInput('Información Extra', 'Reglas de juego, etc')}
            <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)} />
            {preInput('Check In & Check Out, Huéspedes Máximo', 'Añadir Check In y Check Out, recuerda que son humanos')}
            <div className='grid gap-2 grid-cols-2 md:grid-cols-4'>
              <div>
                <h3 className='mt-2 -mb-1'>Hora Check In</h3>
                <input type="text"
                   value={checkIn}
                   onChange={ev => setCheckIn(ev.target.value)}
                   placeholder="14"/>
              </div>
              <div>
                <h3 className='mt-2 -mb-1'>Hora Check Out</h3>
                <input type="text"
                   value={checkOut}
                   onChange={ev => setCheckOut(ev.target.value)}
                   placeholder="11" />
              </div>
              <div>
                <h3 className='mt-2 -mb-1'>Cantidad Huéspedes</h3>
                <input type="number" value={maxGuests}
                   onChange={ev => setMaxGuests(ev.target.value)}/>
              </div>
              <div>
                <h3 className='mt-2 -mb-1'>Precio por Noche</h3>
                <input type="number" value={price}
                   onChange={ev => setPrice(ev.target.value)}/>
              </div>
            </div>
            <button className='primary my-4'>Guardar</button>
          </form>
        </div>
  );
}