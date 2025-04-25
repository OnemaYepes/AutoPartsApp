import { useState, useMemo } from "react"; // Import useMemo
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
 );

// Componente para los Requisitos de Contraseña
function PasswordRequirements({ checks }) {
  const requirementClass = (isValid) =>
    isValid ? 'text-green-600' : 'text-red-400';

  const Requirement = ({ text, isValid }) => (
    <p className={`flex items-center gap-1.5 ${requirementClass(isValid)}`}>
      <span>{isValid ? '✓' : '✗'}</span>
      {text}
    </p>
  );

  return (
    <div className="mt-2 text-xs text-gray-400 space-y-1">
      <Requirement text="Mínimo 8 caracteres" isValid={checks.minLength} />
      <Requirement text="Una letra mayúscula" isValid={checks.hasUppercase} />
      <Requirement text="Un número" isValid={checks.hasNumber} />
      <Requirement text="Un símbolo especial (!@#...)" isValid={checks.hasSymbol} />
    </div>
  );
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const navigate = useNavigate(); // Hook para redirigir

  // Optimizar cálculos de validación con useMemo
  const passwordChecks = useMemo(() => ({
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[-_!@#$%^&*(),.?":{}|<>]/.test(password),
  }), [password]);

  const allValid = useMemo(() =>
    Object.values(passwordChecks).every(Boolean),
  [passwordChecks]);

  const passwordsMatch = useMemo(() =>
    password && confirmPassword && password === confirmPassword,
  [password, confirmPassword]);

  // Función de registro
  async function registerUser(ev) {
    ev.preventDefault();
    setMessage(null); // Limpiar mensaje anterior al intentar de nuevo

    if (!passwordsMatch) {
      setMessage('❌ Las contraseñas no coinciden.');
      setMessageType('error');
      return;
    }

    if (!allValid) {
      setMessage('❌ La contraseña no cumple con todos los requisitos.');
      setMessageType('error');
      return;
    }

    setIsLoading(true); // Iniciar estado de carga

    try {
      const response = await axios.post('/register', { name, email, password });
      setMessage('✅ Registro exitoso. Redirigiendo al inicio de sesión...');
      setMessageType('success');
      setTimeout(() => {
        navigate('/login'); // Asegúrate que la ruta '/login' es correcta
      }, 1500);

    } catch (e) {
      // Intentar obtener un mensaje de error más específico del backend
      const errorMsg = e.response?.data?.message || '❌ Error en el registro. Verifica tus datos o intenta más tarde.';
      setMessage(errorMsg);
      setMessageType('error');
    } finally {
      setIsLoading(false); // Detener estado de carga (siempre)
    }
  }

  return (
    // Contenedor principal (modal/página completa)
    <div className="fixed inset-0 bg-[#f1f1f1] flex items-center justify-center p-4 min-h-screen overflow-y-auto">
      {/* Tarjeta del formulario */}
      <div className="relative bg-white border border-black p-4 w-full max-w-md rounded-2xl shadow-xl px-6 sm:px-8 py-8 ">
      <Link
         to="/"
         className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
         aria-label="Volver al inicio"
        >
          <XMarkIcon />
        </Link>
        <div className="space-y-5">
        {/* Encabezado */}
        <h1 className="text-3xl font-bold text-center text-black mb-1">Crear Cuenta</h1>
        <p className="text-center text-gray-500 text-sm mb-5">Regístrate para comenzar</p>

        {/* Área de mensajes de estado */}
        {message && (
          <div
            className={`text-sm text-center p-3 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-600 bg-opacity-80 text-white'
                : 'bg-red-600 bg-opacity-80 text-white'
            }`}
            // aria-live="polite" // Anuncia cambios a lectores de pantalla
          >
            {message}
          </div>
        )}

        {/* Formulario */}
        <form className="space-y-4" onSubmit={registerUser}>
          {/* Campo Nombre */}
          <div>
            <label htmlFor="nameInput" className="block text-sm font-medium text-black mb-1">
              Nombre completo
            </label>
            <input
              id="nameInput"
              type="text"
              placeholder="Beatriz Pizón"
              value={name}
              onChange={ev => setName(ev.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-white text-black placeholder-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              required // Validación básica del navegador
              disabled={isLoading} // Deshabilitar durante carga
            />
          </div>

          {/* Campo Email */}
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

          {/* Campo Contraseña */}
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
              className="w-full px-4 py-2.5 rounded-lg bg-white text-black placeholder-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200" // pr-10 para dejar espacio al icono
              required
              disabled={isLoading}
              // aria-describedby="password-requirements" // Asocia con los requisitos
            />
           
          </div>

          {/* Requisitos de Contraseña (solo se muestra si se ha empezado a escribir) */}
          {password && <PasswordRequirements checks={passwordChecks} id="password-requirements" />}


          {/* Campo Confirmar Contraseña */}
          <div className="relative">
            <label htmlFor="confirmPasswordInput" className="block text-sm font-medium text-black mb-1">
              Confirmar contraseña
            </label>
            <input
              id="confirmPasswordInput"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={ev => setConfirmPassword(ev.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg bg-white text-black placeholder-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ${
                confirmPassword && !passwordsMatch ? 'ring-2 ring-red-500' : '' // Borde rojo si no coinciden y hay algo escrito
              }`}
              required
              disabled={isLoading}
            />
             
          </div>
           {/* Mensaje de error si las contraseñas no coinciden */}
           {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-400 mt-1">Las contraseñas no coinciden</p>
          )}


          {/* Botón de Envío */}
          <button
            type="submit"
            className={`w-full py-3 mt-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
              allValid && passwordsMatch && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600 shadow-md hover:shadow-lg'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!allValid || !passwordsMatch || isLoading} // Deshabilitado si no es válido, no coinciden o está cargando
          >
            {isLoading ? (
              // Indicador de carga simple
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Registrar'
            )}
          </button>

          {/* Enlace a Iniciar Sesión */}
          <div className="text-center text-sm text-gray-400 pt-2">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline">
              Inicia sesión
            </Link>
          </div>
        </form>

        {/* Logo Opcional (ajusta la ruta) */}
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