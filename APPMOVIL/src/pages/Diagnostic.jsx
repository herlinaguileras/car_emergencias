import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, RefreshCw, LogOut, ChevronLeft } from 'lucide-react';
import logoApk from '../assets/logoapk.svg';

export default function Diagnostic() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, preview } = location.state || {};

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-white p-6">
        <img src={logoApk} alt="Logo" className="h-20 w-auto object-contain mb-6" />
        <p className="text-gray-400 font-semibold mb-6">No hay datos disponibles.</p>
        <button onClick={() => navigate('/scanner')} className="bg-brand-red hover:bg-red-700 active:scale-95 text-white px-6 py-3 rounded-xl font-bold transition-all">
          Ir al Escáner
        </button>
      </div>
    );
  }

  const data = result.data;
  const isHighConfidence = data.confianza >= 0.60;
  const confidencePercent = (data.confianza * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-brand-dark p-6 flex flex-col items-center pt-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-red/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-red/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header */}
      <div className="w-full grid grid-cols-3 items-center absolute top-0 p-6 z-10 border-b border-white/5 bg-brand-dark">
        <div className="flex justify-start">
          <button 
            onClick={() => navigate('/scanner')} 
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-semibold">Volver</span>
          </button>
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

      <div className="w-full max-w-sm z-10 mt-6">
        <h1 className="text-2xl font-black text-white tracking-tight mb-6 uppercase">Reporte de Análisis</h1>
        
        <div className="bg-gray-950/40 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)] border border-white/10">
          {preview && (
            <div className="relative bg-black/50 flex justify-center items-center h-64 border-b border-white/5">
              <img src={preview} alt="Accidente analizado" className="max-w-full max-h-64 object-contain mx-auto opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent pointer-events-none"></div>
            </div>
          )}
          
          <div className="p-6 relative -mt-12">
            {!isHighConfidence ? (
              <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/20 shadow-xl">
                <div className="flex items-center text-yellow-500 mb-3">
                  <AlertTriangle size={28} className="mr-3" />
                  <h2 className="text-lg font-black uppercase tracking-tight">Análisis Impreciso</h2>
                </div>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {data.observaciones || "La confianza de la clasificación es baja para un diagnóstico automatizado seguro."}
                </p>
                <button onClick={() => navigate('/scanner')} className="w-full flex justify-center items-center bg-gray-800 hover:bg-gray-700 active:scale-95 text-white py-4 rounded-xl font-bold transition-all border border-white/5 shadow-md">
                  <RefreshCw size={18} className="mr-2" /> Reintentar Escaneo
                </button>
              </div>
            ) : (
              <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-brand-red/20 shadow-xl">
                <div className="mb-6">
                  <div className="flex items-center mb-1">
                    <CheckCircle2 size={16} className="text-brand-red mr-2" />
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-extrabold">Diagnóstico Confirmado</p>
                  </div>
                  <h2 className="text-2xl font-black text-white leading-tight uppercase tracking-tight">
                    {data.clase_predicha ? data.clase_predicha.replace(/_/g, ' ') : 'SIN DAÑO VISIBLE'}
                  </h2>
                </div>
                
                <div className="bg-black/50 rounded-xl p-4 mb-8 border border-white/5 shadow-inner">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Índice de Confianza</span>
                    <span className="font-extrabold text-brand-red">{confidencePercent}%</span>
                  </div>
                  {/* Barra de progreso visual */}
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-brand-red h-2 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)] transition-all duration-1000" style={{ width: `${confidencePercent}%` }}></div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/scanner')} 
                  className="w-full bg-gradient-to-r from-brand-red to-red-600 hover:from-red-500 hover:to-red-700 active:scale-[0.98] text-white py-4 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(239,68,68,0.2)] uppercase tracking-wider text-sm"
                >
                  Finalizar y Volver
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
