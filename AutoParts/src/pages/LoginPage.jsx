import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext.jsx";

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
 );


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useContext(UserContext);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const { data } = await axios.post('/login', { email, password });
      setUser(data);
      setMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      setMessageType('success');
      setTimeout(() => setRedirect(true), 1000);
    } catch (e) {
      const errorMsg = e.response?.data?.message || 'Correo o contraseña incorrectos.';
      setMessage(errorMsg);
      setMessageType('error');
      setIsLoading(false);
    }
    // No poner setIsLoading(false) aquí si hay éxito, porque redirige
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className="fixed inset-0 bg-[#f1f1f1] flex items-center justify-center p-4 min-h-screen overflow-y-auto">
      <div className="relative bg-white border border-black p-4 w-full max-w-md rounded-2xl shadow-xl px-6 sm:px-8 py-8">
      <Link
         to="/"
         className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
         aria-label="Volver al inicio"
        >
          <XMarkIcon />
        </Link>

        <div className="space-y-5">
        
        <h1 className="text-3xl font-bold text-center text-black mb-1">Bienvenido</h1>
        <p className="text-center text-gray-500 text-sm mb-5">Ingresa tus credenciales</p>

        {message && (
          <div
            className={`text-sm text-center p-3 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-600 bg-opacity-80 text-white'
                : 'bg-red-600 bg-opacity-80 text-white'
            }`}
            aria-live="polite"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label htmlFor="emailInput" className="block text-sm font-medium text-black mb-1">
              Correo electrónico
            </label>
            <input
              id="emailInput"
              type="email"
              placeholder="ejemplo@email.com"
              value={email}
              onChange={ev => setEmail(ev.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white text-black placeholder-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              //required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label htmlFor="passwordInput" className="block text-sm font-medium text-black mb-1">
              Contraseña
            </label>
            <input
              id="passwordInput"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={ev => setPassword(ev.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white text-black placeholder-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              //required
              disabled={isLoading}
            />
             
          </div>

          <div className="text-right">
            <Link 
              to="/forgot" 
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className={`w-full py-3 mt-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
              !isLoading
                ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600 shadow-md hover:shadow-lg'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Iniciar sesión'
            )}
          </button>

          <div className="text-center text-sm text-gray-400 pt-2">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline">
              Regístrate
            </Link>
          </div>
        </form>

        <div className="bottom-4 left-0 right-0 flex justify-center">
          <img
            src="/carro.svg"
            alt="Logo Empresa"
            className="h-12 w-auto opacity-60"
          />
        </div>
      </div>

      </div>
    </div>
  );
}