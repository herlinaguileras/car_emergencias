import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoApk from '../assets/logoapk.svg';

export default function Onboarding() {
  const [isLogin, setIsLogin] = useState(true);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    try {
      const res = await axios.post(`${baseUrl}${endpoint}`, { correo, password });
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        navigate('/scanner');
      } else {
        setIsLogin(true);
        setError('Registro exitoso. Ahora inicia sesión.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ocurrió un error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4 relative overflow-hidden">
      {/* Background Decorative Glows and Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Floating Red Square Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-6 h-6 bg-brand-red/20 rounded-md animate-pulse"></div>
        <div className="absolute top-[45%] right-[15%] w-8 h-8 bg-brand-red/10 rounded-md animate-bounce" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-[20%] left-[25%] w-4 h-4 bg-brand-red/30 rounded-md animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-[75%] left-[80%] w-10 h-10 bg-brand-red/15 rounded-md animate-bounce" style={{ animationDuration: '8s' }}></div>
      </div>

      <div className="relative w-full max-w-md bg-[#0d121c]/90 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(255,46,46,0.15)] p-8 border border-white/10 z-10">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-full bg-[#0d121c] flex justify-center py-4 rounded-2xl mb-3 border border-white/5 shadow-inner">
            <img src={logoApk} alt="Logo" className="h-28 w-auto object-contain" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-wider uppercase">
            Data<span className="text-brand-red">Crash</span>
          </h1>
          <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase mt-1">
            Motor de Asistencia Inteligente
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-brand-red/50 text-red-200 p-4 rounded-2xl mb-6 text-sm text-center backdrop-blur-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Correo electrónico</label>
            <input
              type="email"
              placeholder="nombre@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/50 transition-all font-medium"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/50 transition-all font-medium"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-brand-red to-red-600 hover:from-red-500 hover:to-red-700 active:scale-[0.98] text-white font-bold py-4 px-4 rounded-2xl transition-all shadow-[0_4px_20px_rgba(239,68,68,0.3)] text-base tracking-wide"
          >
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8 text-sm">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-brand-red hover:text-red-400 font-bold ml-2 transition-colors focus:outline-none"
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}
