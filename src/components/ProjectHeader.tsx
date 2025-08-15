import React from 'react';
import { Calendar, User, DollarSign, TrendingUp, Wallet } from 'lucide-react';

interface ProjectData {
  nom: string;
  prixVente: number;
  dateDebut: string;
  client: string;
  avancementFacturation: number;
  cash: number;
}

interface ProjectHeaderProps {
  project: ProjectData;
  onProjectChange: (project: ProjectData) => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, onProjectChange }) => {
  const handleInputChange = (field: keyof ProjectData, value: string | number) => {
    onProjectChange({ ...project, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <User className="w-4 h-4 mr-1" />
            Nom du projet
          </label>
          <input
            type="text"
            value={project.nom}
            onChange={(e) => handleInputChange('nom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nom du projet"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <DollarSign className="w-4 h-4 mr-1" />
            Prix de vente
          </label>
          <input
            type="number"
            value={project.prixVente}
            onChange={(e) => handleInputChange('prixVente', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 mr-1" />
            Date début
          </label>
          <input
            type="date"
            value={project.dateDebut}
            onChange={(e) => handleInputChange('dateDebut', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <User className="w-4 h-4 mr-1" />
            Client
          </label>
          <input
            type="text"
            value={project.client}
            onChange={(e) => handleInputChange('client', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nom du client"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <TrendingUp className="w-4 h-4 mr-1" />
            Avancement facturation
          </label>
          <div className="relative">
            <input
              type="number"
              value={project.avancementFacturation}
              onChange={(e) => handleInputChange('avancementFacturation', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
              min="0"
              max="100"
            />
            <span className="absolute right-3 top-2 text-gray-500">%</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Wallet className="w-4 h-4 mr-1" />
            Cash
          </label>
          <input
            type="number"
            value={project.cash}
            onChange={(e) => handleInputChange('cash', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
};