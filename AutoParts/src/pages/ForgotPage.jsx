import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export default function ForgotPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(ev) {
    ev.preventDefault();
    setMessage(null);

    if (!email) {
      setMessage('❌ Por favor ingresa tu correo electrónico');
      setMessageType('error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/forgot-password', { email });
      setMessage('✅ Se ha enviado un código de verificación a tu correo electrónico. Por favor, introduce el código para restablecer tu contraseña.');
      setMessageType('success');

      // Redirigir a la página de ResetPasswordPage después de un tiempo
      setTimeout(() => {
        navigate('/reset-password', { state: { email } }); // Pasar el correo al siguiente componente
      }, 3000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || '❌ Error al procesar tu solicitud. Por favor intenta más tarde.';
      setMessage(errorMsg);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#f1f1f1] flex items-center justify-center p-4 min-h-screen overflow-y-auto">
      <div className="relative bg-white border border-black p-4 w-full max-w-md rounded-2xl shadow-xl px-6 sm:px-8 py-8">
        <Link
          to="/login"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Volver al inicio de sesión"
        >
          <XMarkIcon />
        </Link>

        <div className="space-y-5">
          <h1 className="text-3xl font-bold text-center text-black mb-1">Recuperar contraseña</h1>
          <p className="text-center text-gray-500 text-sm mb-5">
            Ingresa tu correo electrónico y te enviaremos un código de verificación.
          </p>

          {message && (
            <div
              className={`text-sm text-center p-3 rounded-lg ${
                messageType === 'success'
                  ? 'bg-green-600 bg-opacity-80 text-white'
                  : 'bg-red-600 bg-opacity-80 text-white'
              }`}
            >
              {message}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="emailInput" className="block text-sm font-medium text-black mb-1">
                Correo electrónico
              </label>
              <input
                id="emailInput"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={ev => setEmail(ev.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white text-black placeholder-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 mt-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                email && !isLoading
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600 shadow-md hover:shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!email || isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Enviar código'
              )}
            </button>

            <div className="text-center text-sm text-gray-400 pt-2">
              ¿Recordaste tu contraseña?{" "}
              <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline">
                Inicia sesión
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