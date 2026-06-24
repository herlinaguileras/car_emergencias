import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Image as ImageIcon, LogOut } from 'lucide-react';
import logoApk from '../assets/logoapk.svg';

export default function Scanner() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('photo', file);
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${baseUrl}/api/incidents/report`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/diagnostic', { state: { result: res.data, preview: URL.createObjectURL(file) } });
    } catch (error) {
      console.error(error);
      alert("Error al analizar la imagen. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-red/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-red/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="w-full grid grid-cols-3 items-center absolute top-0 p-6 z-10 border-b border-white/5 bg-brand-dark">
        <div className="flex justify-start">
          {/* Empty spacer to align center */}
        </div>
        <div className="flex justify-center text-center">
          <span className="text-xl font-black text-white tracking-wider uppercase">
            Data<span className="text-brand-red">Crash</span>
          </span>
        </div>
        <div className="flex justify-end">
          <button 
            onClick={handleLogout} 
            className="text-gray-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all p-2.5 rounded-xl border border-white/10 bg-black/20"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="text-center max-w-sm w-full z-10 mt-16">
        {loading ? (
          <div className="relative flex flex-col justify-center items-center h-80 w-full mx-auto">
            <div className="absolute animate-ping inline-flex h-48 w-48 rounded-full bg-brand-red opacity-10"></div>
            <div className="absolute animate-pulse inline-flex h-36 w-36 rounded-full bg-brand-red opacity-20"></div>
            
            <div className="relative inline-flex rounded-full h-24 w-24 bg-gray-950 border border-brand-red/30 items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)]">
              <Camera className="text-brand-red animate-pulse" size={32} />
            </div>
            
            <div className="mt-8 space-y-2">
              <p className="text-brand-red font-bold animate-pulse tracking-widest text-sm uppercase">PROCESANDO IA...</p>
              <p className="text-gray-400 text-xs font-semibold">Analizando detalles del vehículo...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="mb-6">
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">EVALUAR DAÑO</h1>
              <p className="text-gray-400 font-medium">Captura o sube una foto del accidente</p>
            </div>

            <label className="flex flex-col items-center justify-center w-full bg-gradient-to-br from-brand-red to-red-700 hover:from-red-500 hover:to-red-800 active:scale-[0.98] text-white font-bold py-14 px-6 rounded-3xl cursor-pointer transition-all shadow-[0_10px_30px_rgba(239,68,68,0.25)] border border-red-500/30 group">
              <Camera size={52} strokeWidth={1.5} className="mb-4 text-white group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl tracking-wider font-extrabold uppercase">Capturar Ahora</span>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageUpload} />
            </label>

            <label className="flex items-center justify-center w-full bg-gray-950/40 backdrop-blur-md hover:bg-gray-900/60 active:scale-[0.98] text-white font-semibold py-5 px-4 rounded-2xl cursor-pointer transition-all border border-white/10 shadow-lg group">
              <ImageIcon size={20} className="mr-3 text-gray-400 group-hover:text-brand-red transition-colors" />
              <span className="tracking-wide text-gray-300 group-hover:text-white transition-colors">Subir desde Galería</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
