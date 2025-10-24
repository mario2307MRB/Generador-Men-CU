import React, { useState, FormEvent, ChangeEvent } from 'react';
import type { UserInfo } from '../types';

interface UpdateInfoModalProps {
  isOpen: boolean;
  currentUserInfo: UserInfo;
  onConfirm: (updatedUserInfo: UserInfo) => void;
  onClose: () => void;
}

const UpdateInfoModal: React.FC<UpdateInfoModalProps> = ({ isOpen, currentUserInfo, onConfirm, onClose }) => {
  const [localUserInfo, setLocalUserInfo] = useState<UserInfo>(currentUserInfo);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onConfirm(localUserInfo);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full m-4 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Actualizar Información</h2>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl font-bold leading-none p-1">&times;</button>
        </div>
        
        <p className="text-slate-600 mb-6">
            Antes de generar un nuevo menú, por favor, confirma o actualiza tus datos. Es importante mantener tu peso al día.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modal-name" className="block text-sm font-medium text-slate-700">Nombre</label>
              <input type="text" name="name" id="modal-name" required value={localUserInfo.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"/>
            </div>
            <div>
              <label htmlFor="modal-gender" className="block text-sm font-medium text-slate-700">Sexo</label>
              <select name="gender" id="modal-gender" required value={localUserInfo.gender} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500">
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
            <div>
              <label htmlFor="modal-age" className="block text-sm font-medium text-slate-700">Edad</label>
              <input type="number" name="age" id="modal-age" required value={localUserInfo.age} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"/>
            </div>
            <div>
              <label htmlFor="modal-weight" className="block text-sm font-medium text-slate-700">Peso (kg)</label>
              <input type="number" name="weight" id="modal-weight" required value={localUserInfo.weight} onChange={handleInputChange} step="0.1" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ring-2 ring-teal-300"/>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="modal-height" className="block text-sm font-medium text-slate-700">Estatura (cm)</label>
              <input type="number" name="height" id="modal-height" required value={localUserInfo.height} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"/>
            </div>
          </div>
          <div className="flex justify-end items-center gap-4 pt-4">
            <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-200 transition-colors"
            >
                Cancelar
            </button>
            <button
                type="submit"
                className="bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-colors"
            >
                Confirmar y Generar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInfoModal;