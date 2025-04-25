import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export default function ResetPasswordPage() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email;
  const [email, setEmail] = useState(emailFromState || ''); // Obtener el email del estado o mantenerlo vacío

  async function handleSubmit(ev) {
    ev.preventDefault();
    setMessage(null);

    if (!otp) {
      setMessage('❌ Por favor ingresa el código de verificación');
      setMessageType('error');
      return;
    }

    if (!newPassword) {
      setMessage('❌ Por favor ingresa tu nueva contraseña');
      setMessageType('error');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage('❌ Las contraseñas no coinciden');
      setMessageType('error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/reset-password', { email, otp, newPassword });
      setMessage('✅ Tu contraseña ha sido restablecida exitosamente. Serás redirigido al inicio de sesión.');
      setMessageType('success');

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || '❌ Error al restablecer la contraseña. Por favor verifica el código o intenta más tarde.';
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
          <h1 className="text-3xl font-bold text-center text-black mb-1">Restablecer contraseña</h1>
          <p className="text-center text-gray-500 text-sm mb-5">
            Ingresa el código de verificación que enviamos a tu correo y tu nueva contraseña.
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
            {emailFromState && (
              <div>
                <label htmlFor="emailDisplay" className="block text-sm font-medium text-black mb-1">
                  Correo electrónico
                </label>
                <input
                  id="emailDisplay"
                  type="email"
                  value={email}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-100 text-black placeholder-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  readOnly
                />
              </div>
            )}
            <div>
              <label htmlFor="otpInput" className="block text-sm font-medium text-black mb-1">
                Código de verificación
              </label>
              <input
                id="otpInput"
                type="text"
                placeholder="Ej: 123456"
                value={otp}
                onChange={ev => setOtp(ev.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white text-black placeholder-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="newPasswordInput" className="block text-sm font-medium text-black mb-1">
                Nueva contraseña
              </label>
              <input
                id="newPasswordInput"
                type="password"
                placeholder="********"
                value={newPassword}
                onChange={ev => setNewPassword(ev.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white text-black placeholder-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirmNewPasswordInput" className="block text-sm font-medium text-black mb-1">
                Confirmar nueva contraseña
              </label>
              <input
                id="confirmNewPasswordInput"
                type="password"
                placeholder="********"
                value={confirmNewPassword}
                onChange={ev => setConfirmNewPassword(ev.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white text-black placeholder-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 mt-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                otp && newPassword && confirmNewPassword && newPassword === confirmNewPassword && !isLoading
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600 shadow-md hover:shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!otp || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword || isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Restablecer contraseña'
              )}
            </button>

            <div className="text-center text-sm text-gray-400 pt-2">
              ¿No recibiste el código?{" "}
              <Link to="/forgot-password" className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline">
                Reenviar código
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