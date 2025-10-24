import React, { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { generateMealPlan } from './services/geminiService';
import type { MealPlan, UserInfo } from './types';
import MealCard from './components/MealCard';
import HydrationCard from './components/HydrationCard';
import HealthAdviceCard from './components/HealthAdviceCard';
import UpdateInfoModal from './components/UpdateInfoModal';

const initialUserInfo: UserInfo = {
  name: '',
  gender: '',
  age: '',
  weight: '',
  height: ''
};

// --- Extracted Components ---

interface UserInfoFormProps {
  userInfo: UserInfo;
  isLoading: boolean;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ userInfo, isLoading, handleInputChange, handleSubmit }) => (
    <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-slate-200 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">Planificador de Menús de Bienestar</h1>
      <p className="text-slate-600 mx-auto mb-6">
        Para comenzar, por favor completa tus datos. Esto nos ayudará a crear un menú y consejos de salud personalizados para ti.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nombre</label>
            <input type="text" name="name" id="name" required value={userInfo.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"/>
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-slate-700">Sexo</label>
            <select name="gender" id="gender" required value={userInfo.gender} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500">
              <option value="">Selecciona...</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-slate-700">Edad</label>
            <input type="number" name="age" id="age" required value={userInfo.age} onChange={handleInputChange} placeholder="ej. 35" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"/>
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-slate-700">Peso (kg)</label>
            <input type="number" name="weight" id="weight" required value={userInfo.weight} onChange={handleInputChange} placeholder="ej. 102.4" step="0.1" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"/>
          </div>
           <div className="md:col-span-2">
            <label htmlFor="height" className="block text-sm font-medium text-slate-700">Estatura (cm)</label>
            <input type="number" name="height" id="height" required value={userInfo.height} onChange={handleInputChange} placeholder="ej. 175" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"/>
          </div>
        </div>
        <div className="text-center pt-4">
            <button
                type="submit"
                disabled={isLoading}
                className="bg-teal-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
            >
                Generar Mi Menú Personalizado
            </button>
        </div>
      </form>
    </div>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-500 mb-4"></div>
      <p className="text-slate-600 font-semibold text-lg">Generando tu plan de bienestar...</p>
      <p className="text-slate-500 mt-2">La IA está elaborando cuidadosamente tus comidas y consejos.</p>
    </div>
);

interface ErrorDisplayProps {
    error: string | null;
    onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => (
     <div className="text-center p-8 bg-red-50 border border-red-200 rounded-xl">
      <h2 className="text-2xl font-bold text-red-700 mb-2">¡Ups! Algo salió mal.</h2>
      <p className="text-red-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors"
      >
        Intentar de Nuevo
      </button>
    </div>
);


const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleGenerateMenu = useCallback(async (currentUserInfo: UserInfo) => {
    setIsLoading(true);
    setError(null);
    setMealPlan(null);
    try {
      const plan = await generateMealPlan(currentUserInfo);
      setMealPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    handleGenerateMenu(userInfo);
  }, [userInfo, handleGenerateMenu]);
  
  const handleRegenerate = useCallback(() => {
    setIsUpdateModalOpen(true);
  }, []);

  const handleConfirmUpdate = useCallback((updatedUserInfo: UserInfo) => {
    setUserInfo(updatedUserInfo);
    setIsUpdateModalOpen(false);
    handleGenerateMenu(updatedUserInfo);
  }, [handleGenerateMenu]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            <h1 className="text-2xl font-bold text-slate-800">Planificador de Menús de Bienestar</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {!formSubmitted && !isLoading && !error && (
            <UserInfoForm 
                userInfo={userInfo}
                isLoading={isLoading}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        )}
        {isLoading && <LoadingSpinner />}
        {error && !isLoading && <ErrorDisplay error={error} onRetry={handleRegenerate} />}
        
        {mealPlan && !isLoading && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800">Tu Menú Personalizado para Hoy, {userInfo.name}</h2>
              <p className="text-slate-600 mt-2">Un plan suave y nutritivo para apoyar tu bienestar.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <MealCard meal={mealPlan.breakfast} mealType="Desayuno" />
              <MealCard meal={mealPlan.lunch} mealType="Almuerzo" />
              <MealCard meal={mealPlan.dinner} mealType="Cena" />
              {mealPlan.snacks.map((snack, index) => (
                <MealCard key={index} meal={snack} mealType={`Colación ${index + 1}`} />
              ))}
              <HydrationCard plan={mealPlan.hydration} />
              <HealthAdviceCard plan={mealPlan.healthAdvice} />
            </div>
             <div className="text-center mt-8">
                <button
                    onClick={handleRegenerate}
                    disabled={isLoading}
                    className="bg-teal-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Generar un Nuevo Menú
                </button>
            </div>
          </div>
        )}
        
        {isUpdateModalOpen && (
            <UpdateInfoModal 
                isOpen={isUpdateModalOpen}
                currentUserInfo={userInfo}
                onConfirm={handleConfirmUpdate}
                onClose={() => setIsUpdateModalOpen(false)}
            />
        )}
      </main>
      <footer className="text-center py-6 px-4 text-sm text-slate-500">
        <p>Descargo de responsabilidad: Este plan es generado por IA y no sustituye el consejo médico profesional. Consulta con tu médico o un dietista registrado antes de realizar cambios significativos en tu dieta o rutina de ejercicio.</p>
      </footer>
    </div>
  );
};

export default App;