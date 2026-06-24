import { Camera, Upload, AlertCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-brand-dark text-white py-4 shadow-md fixed top-0 left-0 flex items-center justify-center z-10">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <AlertCircle size={24} className="text-brand-red" />
        IA Asistencia Emergencias
      </h1>
    </header>
  );
}
