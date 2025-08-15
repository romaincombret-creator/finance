import React, { useState, useEffect } from 'react';
import { ProjectHeader } from './components/ProjectHeader';
import { BudgetTable, BudgetItem } from './components/BudgetTable';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';

interface ProjectData {
  nom: string;
  prixVente: number;
  dateDebut: string;
  client: string;
  avancementFacturation: number;
  cash: number;
}

function App() {
  const [project, setProject] = useState<ProjectData>({
    nom: 'Projet Exemple',
    prixVente: 150000,
    dateDebut: '2024-01-15',
    client: 'Client ABC',
    avancementFacturation: 65,
    cash: 25000
  });

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    // Ressources Humaines
    { id: 'chef-chantier-h', category: 'CHEF DE CHANTIER (H)', budget: 10, debourse: 5, resteAFaire: 5, totalFinal: 10, ecartBudget: 0, type: 'item' },
    { id: 'chef-chantier-e', category: 'CHEF DE CHANTIER (€)', budget: 1100, debourse: 550, resteAFaire: 0, totalFinal: 550, ecartBudget: 550, type: 'item' },
    { id: 'technicien-h', category: 'TECHNICIEN (H)', budget: 120, debourse: 90, resteAFaire: 40, totalFinal: 130, ecartBudget: -10, type: 'item' },
    { id: 'technicien-e', category: 'TECHNICIEN (€)', budget: 12000, debourse: 9000, resteAFaire: 4000, totalFinal: 13000, ecartBudget: -1000, type: 'item' },
    { id: 'total-heures', category: 'Total heures', budget: 130, debourse: 95, resteAFaire: 45, totalFinal: 140, ecartBudget: -10, type: 'subtotal', color: 'green' },
    { id: 'total-heures-e', category: 'Total heures (€)', budget: 13100, debourse: 9550, resteAFaire: 4000, totalFinal: 13550, ecartBudget: -450, type: 'subtotal', color: 'green' },
    { id: 'notes-frais', category: 'Notes de frais', budget: 100, debourse: 0, resteAFaire: 0, totalFinal: 0, ecartBudget: 100, type: 'item' },
    { id: 'deplacements', category: 'Déplacements/Autres indemnités', budget: 0, debourse: 0, resteAFaire: 0, totalFinal: 0, ecartBudget: 0, type: 'item' },
    
    // Main d'œuvre
    { id: 'fournitures', category: 'Fournitures', budget: 3000, debourse: 3500, resteAFaire: 1000, totalFinal: 4500, ecartBudget: -1500, type: 'item' },
    { id: 'sous-traitance', category: 'Sous traitance', budget: 2000, debourse: 1000, resteAFaire: 500, totalFinal: 1500, ecartBudget: 500, type: 'item' },
    { id: 'autres-depenses', category: 'Autres dépenses', budget: 0, debourse: 0, resteAFaire: 0, totalFinal: 0, ecartBudget: 0, type: 'item' },
    { id: 'aleas', category: 'Aléas', budget: 1000, debourse: 0, resteAFaire: 0, totalFinal: 0, ecartBudget: 1000, type: 'item' },
    { id: 'total-depenses', category: 'Total dépenses', budget: 19200, debourse: 14050, resteAFaire: 5500, totalFinal: 19550, ecartBudget: -350, type: 'subtotal' },
    
    // Facturation
    { id: 'total-facturation', category: 'Total Facturation', budget: 0, debourse: 12000, resteAFaire: 8000, totalFinal: 20000, ecartBudget: -20000, type: 'total', color: 'orange' },
    { id: 'encaissement', category: 'Encaissement', budget: 0, debourse: 10000, resteAFaire: 0, totalFinal: 0, ecartBudget: 0, type: 'item' },
    { id: 'resultat-final', category: 'Résultat final estimé', budget: 800, debourse: 5950, resteAFaire: 0, totalFinal: 450, ecartBudget: 350, type: 'total' },
    { id: 'resultat-pourcentage', category: '% Résultat final estimé', budget: 4.0, debourse: 29.8, resteAFaire: 0, totalFinal: 2.3, ecartBudget: 0.02, type: 'total' },
    { id: 'ecart-facturation', category: 'Écart facturation', budget: 0, debourse: -8000, resteAFaire: 0, totalFinal: 0, ecartBudget: 0, type: 'item' },
    { id: 'cash-affaire', category: 'Cash de l\'affaire', budget: 0, debourse: -4050, resteAFaire: 0, totalFinal: 0, ecartBudget: 0, type: 'total' }
  ]);

  // Calcul automatique des totaux
  useEffect(() => {
    const updatedItems = [...budgetItems];
    
    // Calcul des sous-totaux et totaux
    const categories = {};

    Object.entries(categories).forEach(([totalId, itemIds]) => {
      const totalIndex = updatedItems.findIndex(item => item.id === totalId);
      if (totalIndex !== -1) {
        const budget = itemIds.reduce((sum, id) => {
          const item = updatedItems.find(i => i.id === id);
          return sum + (item?.budget || 0);
        }, 0);
        
        const debourse = itemIds.reduce((sum, id) => {
          const item = updatedItems.find(i => i.id === id);
          return sum + (item?.debourse || 0);
        }, 0);

        const resteAFaire = itemIds.reduce((sum, id) => {
          const item = updatedItems.find(i => i.id === id);
          return sum + (item?.resteAFaire || 0);
        }, 0);

        updatedItems[totalIndex] = { ...updatedItems[totalIndex], budget, debourse, resteAFaire };
      }
    });

    setBudgetItems(updatedItems);
  }, []);

  const handleItemChange = (id: string, field: 'budget' | 'debourse' | 'resteAFaire' | 'totalFinal' | 'ecartBudget', value: number) => {
    setBudgetItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Calcul automatique du total final (déboursé + reste à faire)
          if (field === 'debourse' || field === 'resteAFaire') {
            const debourse = field === 'debourse' ? value : updatedItem.debourse;
            const resteAFaire = field === 'resteAFaire' ? value : updatedItem.resteAFaire;
            updatedItem.totalFinal = debourse + resteAFaire;
            
            // Calcul automatique de l'écart budget (budget - total final)
            updatedItem.ecartBudget = updatedItem.budget - updatedItem.totalFinal;
          }
          
          // Si on modifie le budget, recalculer l'écart
          if (field === 'budget') {
            updatedItem.ecartBudget = value - updatedItem.totalFinal;
          }
          
          return updatedItem;
        }
        return item;
      });

      // Calculs automatiques des totaux
      const calculateTotals = (items) => {
        return items.map(item => {
          // Total heures (€) = Chef de chantier (€) + Technicien (€)
          if (item.id === 'total-heures-e') {
            const chefChantier = items.find(i => i.id === 'chef-chantier-e');
            const technicien = items.find(i => i.id === 'technicien-e');
            
            const budget = (chefChantier?.budget || 0) + (technicien?.budget || 0);
            const debourse = (chefChantier?.debourse || 0) + (technicien?.debourse || 0);
            const resteAFaire = (chefChantier?.resteAFaire || 0) + (technicien?.resteAFaire || 0);
            const totalFinal = debourse + resteAFaire;
            const ecartBudget = budget - totalFinal;
            
            return { ...item, budget, debourse, resteAFaire, totalFinal, ecartBudget };
          }
          
          // Total heures = Chef de chantier (H) + Technicien (H)
          if (item.id === 'total-heures') {
            const chefChantierH = items.find(i => i.id === 'chef-chantier-h');
            const technicienH = items.find(i => i.id === 'technicien-h');
            
            const budget = (chefChantierH?.budget || 0) + (technicienH?.budget || 0);
            const debourse = (chefChantierH?.debourse || 0) + (technicienH?.debourse || 0);
            const resteAFaire = (chefChantierH?.resteAFaire || 0) + (technicienH?.resteAFaire || 0);
            const totalFinal = debourse + resteAFaire;
            const ecartBudget = budget - totalFinal;
            
            return { ...item, budget, debourse, resteAFaire, totalFinal, ecartBudget };
          }
          
          // Total dépenses = somme de toutes les lignes spécifiées
          if (item.id === 'total-depenses') {
            const lignesAAdditionner = [
              'total-heures-e', 'notes-frais', 'deplacements', 
              'fournitures', 'sous-traitance', 'autres-depenses', 'aleas'
            ];
            
            const budget = lignesAAdditionner.reduce((sum, id) => {
              const ligne = items.find(i => i.id === id);
              return sum + (ligne?.budget || 0);
            }, 0);
            
            const debourse = lignesAAdditionner.reduce((sum, id) => {
              const ligne = items.find(i => i.id === id);
              return sum + (ligne?.debourse || 0);
            }, 0);
            
            const resteAFaire = lignesAAdditionner.reduce((sum, id) => {
              const ligne = items.find(i => i.id === id);
              return sum + (ligne?.resteAFaire || 0);
            }, 0);
            
            const totalFinal = debourse + resteAFaire;
            const ecartBudget = budget - totalFinal;
            
            return { ...item, budget, debourse, resteAFaire, totalFinal, ecartBudget };
          }
          
          return item;
        });
      };

      const finalItems = calculateTotals(updatedItems);
      
      // Calcul du résultat final estimé et du pourcentage
      return finalItems.map(item => {
        // Résultat final estimé = Prix de vente - Total dépenses
        if (item.id === 'resultat-final') {
          const totalDepenses = finalItems.find(i => i.id === 'total-depenses');
          const resultatFinal = project.prixVente - (totalDepenses?.totalFinal || 0);
          
          return {
            ...item,
            budget: project.prixVente - (totalDepenses?.budget || 0),
            debourse: project.prixVente - (totalDepenses?.debourse || 0),
            resteAFaire: 0,
            totalFinal: resultatFinal,
            ecartBudget: item.budget - resultatFinal
          };
        }
        
        // % Résultat final estimé = (Résultat final / Prix de vente) * 100
        if (item.id === 'resultat-pourcentage') {
          const resultatFinal = finalItems.find(i => i.id === 'resultat-final');
          const totalDepenses = finalItems.find(i => i.id === 'total-depenses');
          
          const pourcentageBudget = project.prixVente > 0 ? ((project.prixVente - (totalDepenses?.budget || 0)) / project.prixVente) * 100 : 0;
          const pourcentageDebourse = project.prixVente > 0 ? ((project.prixVente - (totalDepenses?.debourse || 0)) / project.prixVente) * 100 : 0;
          const pourcentageFinal = project.prixVente > 0 ? ((resultatFinal?.totalFinal || 0) / project.prixVente) * 100 : 0;
          
          return {
            ...item,
            budget: pourcentageBudget,
            debourse: pourcentageDebourse,
            resteAFaire: 0,
            totalFinal: pourcentageFinal,
            ecartBudget: pourcentageBudget - pourcentageFinal
          };
        }
        
        // Écart facturation = Total facturation - Prix de vente
        if (item.id === 'ecart-facturation') {
          const totalFacturation = finalItems.find(i => i.id === 'total-facturation');
          
          const ecartBudget = (totalFacturation?.budget || 0) - project.prixVente;
          const ecartDebourse = (totalFacturation?.debourse || 0) - project.prixVente;
          const ecartResteAFaire = (totalFacturation?.resteAFaire || 0) - project.prixVente;
          const ecartTotalFinal = (totalFacturation?.totalFinal || 0) - project.prixVente;
          
          return {
            ...item,
            budget: ecartBudget,
            debourse: ecartDebourse,
            resteAFaire: ecartResteAFaire,
            totalFinal: ecartTotalFinal,
            ecartBudget: ecartBudget - ecartTotalFinal
          };
        }
        
        return item;
      });
    });
  };

  const totalBudget = budgetItems.find(item => item.id === 'total-depenses')?.budget || 0;
  const totalDebourse = budgetItems.find(item => item.id === 'total-depenses')?.debourse || 0;
  const resultat = budgetItems.find(item => item.id === 'resultat-final')?.debourse || 0;
  const pourcentageResultat = project.prixVente > 0 ? (resultat / project.prixVente) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
                Gestion Financière de Projet
              </h1>
              <p className="text-gray-600 mt-1">Suivi budgétaire et analyse des dépenses</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Marge estimée
                </div>
                <div className={`text-xl font-bold ${pourcentageResultat >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {pourcentageResultat.toFixed(1)}%
                </div>
              </div>
              
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <div className="flex items-center text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Total reste à faire
                </div>
                <div className={`text-xl font-bold text-blue-600`}>
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(budgetItems.find(item => item.id === 'total-depenses')?.resteAFaire || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations du projet */}
        <ProjectHeader 
          project={project} 
          onProjectChange={setProject} 
        />

        {/* Tableau budgétaire */}
        <BudgetTable 
          items={budgetItems}
          onItemChange={handleItemChange}
        />
      </div>
    </div>
  );
}

export default App;