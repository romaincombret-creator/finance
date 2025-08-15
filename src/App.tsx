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
    { id: 'rh-header', category: 'RESSOURCES HUMAINES', budget: 0, paye: 0, resteAFaire: 0, type: 'header' },
    { id: 'resp-affaires-h', category: 'Responsables d\'affaires (H)', budget: 15000, paye: 8500, resteAFaire: 6500, type: 'item' },
    { id: 'resp-affaires-e', category: 'Responsables d\'affaires (€)', budget: 12000, paye: 7200, resteAFaire: 4800, type: 'item' },
    { id: 'chef-chantier-h', category: 'Chef de chantier (H)', budget: 18000, paye: 12000, resteAFaire: 6000, type: 'item' },
    { id: 'chef-chantier-e', category: 'Chef de chantier (€)', budget: 16000, paye: 10500, resteAFaire: 5500, type: 'item' },
    { id: 'technicien-h', category: 'Technicien (H)', budget: 25000, paye: 18000, resteAFaire: 7000, type: 'item' },
    { id: 'technicien-e', category: 'Technicien (€)', budget: 22000, paye: 15500, resteAFaire: 6500, type: 'item' },
    { id: 'total-heures', category: 'Total heures', budget: 0, paye: 0, resteAFaire: 0, type: 'subtotal', color: 'green' },
    { id: 'total-heures-e', category: 'Total heures (€)', budget: 0, paye: 0, resteAFaire: 0, type: 'subtotal', color: 'green' },
    { id: 'notes-frais', category: 'Notes de frais', budget: 3000, paye: 1800, resteAFaire: 1200, type: 'item' },
    { id: 'deplacements', category: 'Déplacements/Autres indemnités', budget: 2500, paye: 1200, resteAFaire: 1300, type: 'item' },
    
    // Main d'œuvre
    { id: 'autres-main-oeuvre', category: 'Autres main d\'œuvre', budget: 8000, paye: 4500, resteAFaire: 3500, type: 'item', color: 'green' },
    { id: 'fournitures', category: 'Fournitures', budget: 35000, paye: 28000, resteAFaire: 7000, type: 'item' },
    { id: 'total-achats', category: 'Total Achats', budget: 0, paye: 0, resteAFaire: 0, type: 'subtotal', color: 'green' },
    
    // Sous-traitance
    { id: 'sous-traitance', category: 'Sous traitance', budget: 45000, paye: 30000, resteAFaire: 15000, type: 'item' },
    { id: 'sous-traitance-site', category: 'Sous traitance site externe', budget: 25000, paye: 15000, resteAFaire: 10000, type: 'item', color: 'yellow' },
    { id: 'sous-traitance-services', category: 'Sous traitance services', budget: 15000, paye: 8000, resteAFaire: 7000, type: 'item', color: 'yellow' },
    { id: 'total-sous-traitance', category: 'Total Sous traitance', budget: 0, paye: 0, resteAFaire: 0, type: 'subtotal' },
    { id: 'location-equipement', category: 'Location équipement', budget: 12000, paye: 7500, resteAFaire: 4500, type: 'item', color: 'yellow' },
    
    // Autres dépenses
    { id: 'autres-depenses', category: 'Autres dépenses', budget: 5000, paye: 2800, resteAFaire: 2200, type: 'item' },
    { id: 'aleas', category: 'Aléas', budget: 8000, paye: 0, resteAFaire: 8000, type: 'item' },
    { id: 'total-depenses', category: 'Total dépenses', budget: 0, paye: 0, resteAFaire: 0, type: 'subtotal' },
    { id: 'frais-redevance', category: 'Frais redevance groupe', budget: 3500, paye: 2100, resteAFaire: 1400, type: 'item', color: 'yellow' },
    { id: 'prix-revient', category: 'Prix de revient total', budget: 0, paye: 0, resteAFaire: 0, type: 'total' },
    
    // Facturation
    { id: 'total-facturation', category: 'Total Facturation (PV)', budget: 150000, paye: 97500, resteAFaire: 52500, type: 'total', color: 'orange' },
    { id: 'decaissement', category: 'Décaissement', budget: 0, paye: 0, resteAFaire: 0, type: 'item' },
    { id: 'encaissement', category: 'Encaissement', budget: 150000, paye: 97500, resteAFaire: 52500, type: 'item' },
    { id: 'resultat-final', category: 'Résultat final estimé', budget: 0, paye: 0, resteAFaire: 0, type: 'total' },
    { id: 'resultat-pourcentage', category: '% Résultat final estimé', budget: 0, paye: 0, resteAFaire: 0, type: 'total' },
    { id: 'ecart-facturation', category: 'Écart facturation', budget: 0, paye: 0, resteAFaire: 0, type: 'item' },
    { id: 'cash-affaire', category: 'Cash de l\'affaire', budget: 0, paye: 0, resteAFaire: 0, type: 'total' }
  ]);

  // Calcul automatique des totaux
  useEffect(() => {
    const updatedItems = [...budgetItems];
    
    // Calcul des sous-totaux et totaux
    const categories = {
      'total-heures': ['resp-affaires-h', 'chef-chantier-h', 'technicien-h'],
      'total-heures-e': ['resp-affaires-e', 'chef-chantier-e', 'technicien-e'],
      'total-achats': ['autres-main-oeuvre', 'fournitures'],
      'total-sous-traitance': ['sous-traitance', 'sous-traitance-site', 'sous-traitance-services'],
      'total-depenses': ['autres-depenses', 'aleas'],
    };

    Object.entries(categories).forEach(([totalId, itemIds]) => {
      const totalIndex = updatedItems.findIndex(item => item.id === totalId);
      if (totalIndex !== -1) {
        const budget = itemIds.reduce((sum, id) => {
          const item = updatedItems.find(i => i.id === id);
          return sum + (item?.budget || 0);
        }, 0);
        
        const paye = itemIds.reduce((sum, id) => {
          const item = updatedItems.find(i => i.id === id);
          return sum + (item?.paye || 0);
        }, 0);

        const resteAFaire = itemIds.reduce((sum, id) => {
          const item = updatedItems.find(i => i.id === id);
          return sum + (item?.resteAFaire || 0);
        }, 0);

        updatedItems[totalIndex] = { ...updatedItems[totalIndex], budget, paye, resteAFaire };
      }
    });

    // Calcul du prix de revient total
    const prixRevientIndex = updatedItems.findIndex(item => item.id === 'prix-revient');
    if (prixRevientIndex !== -1) {
      const excludedIds = ['total-facturation', 'decaissement', 'encaissement', 'resultat-final', 'resultat-pourcentage', 'ecart-facturation', 'cash-affaire', 'prix-revient'];
      const budget = updatedItems
        .filter(item => !excludedIds.includes(item.id) && item.type !== 'header')
        .reduce((sum, item) => sum + item.budget, 0);
      
      const paye = updatedItems
        .filter(item => !excludedIds.includes(item.id) && item.type !== 'header')
        .reduce((sum, item) => sum + item.paye, 0);

      const resteAFaire = updatedItems
        .filter(item => !excludedIds.includes(item.id) && item.type !== 'header')
        .reduce((sum, item) => sum + item.resteAFaire, 0);

      updatedItems[prixRevientIndex] = { ...updatedItems[prixRevientIndex], budget, paye, resteAFaire };
    }

    // Calcul du résultat final
    const resultatIndex = updatedItems.findIndex(item => item.id === 'resultat-final');
    const facturationItem = updatedItems.find(item => item.id === 'total-facturation');
    const prixRevientItem = updatedItems.find(item => item.id === 'prix-revient');
    
    if (resultatIndex !== -1 && facturationItem && prixRevientItem) {
      const budget = facturationItem.budget - prixRevientItem.budget;
      const paye = facturationItem.paye - prixRevientItem.paye;
      const resteAFaire = facturationItem.resteAFaire - prixRevientItem.resteAFaire;
      updatedItems[resultatIndex] = { ...updatedItems[resultatIndex], budget, paye, resteAFaire };
    }

    setBudgetItems(updatedItems);
  }, []);

  const handleItemChange = (id: string, field: 'budget' | 'paye' | 'resteAFaire', value: number) => {
    setBudgetItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      );

      // Recalculer les totaux après modification
      const categories = {
        'total-heures': ['resp-affaires-h', 'chef-chantier-h', 'technicien-h'],
        'total-heures-e': ['resp-affaires-e', 'chef-chantier-e', 'technicien-e'],
        'total-achats': ['autres-main-oeuvre', 'fournitures'],
        'total-sous-traitance': ['sous-traitance', 'sous-traitance-site', 'sous-traitance-services'],
        'total-depenses': ['autres-depenses', 'aleas'],
      };

      Object.entries(categories).forEach(([totalId, itemIds]) => {
        const totalIndex = updatedItems.findIndex(item => item.id === totalId);
        if (totalIndex !== -1) {
          const budget = itemIds.reduce((sum, itemId) => {
            const item = updatedItems.find(i => i.id === itemId);
            return sum + (item?.budget || 0);
          }, 0);
          
          const paye = itemIds.reduce((sum, itemId) => {
            const item = updatedItems.find(i => i.id === itemId);
            return sum + (item?.paye || 0);
          }, 0);

          const resteAFaire = itemIds.reduce((sum, itemId) => {
            const item = updatedItems.find(i => i.id === itemId);
            return sum + (item?.resteAFaire || 0);
          }, 0);

          updatedItems[totalIndex] = { ...updatedItems[totalIndex], budget, paye, resteAFaire };
        }
      });

      // Recalcul du prix de revient total
      const prixRevientIndex = updatedItems.findIndex(item => item.id === 'prix-revient');
      if (prixRevientIndex !== -1) {
        const excludedIds = ['total-facturation', 'decaissement', 'encaissement', 'resultat-final', 'resultat-pourcentage', 'ecart-facturation', 'cash-affaire', 'prix-revient'];
        const budget = updatedItems
          .filter(item => !excludedIds.includes(item.id) && item.type !== 'header')
          .reduce((sum, item) => sum + item.budget, 0);
        
        const paye = updatedItems
          .filter(item => !excludedIds.includes(item.id) && item.type !== 'header')
          .reduce((sum, item) => sum + item.paye, 0);

        const resteAFaire = updatedItems
          .filter(item => !excludedIds.includes(item.id) && item.type !== 'header')
          .reduce((sum, item) => sum + item.resteAFaire, 0);

        updatedItems[prixRevientIndex] = { ...updatedItems[prixRevientIndex], budget, paye, resteAFaire };
      }

      // Recalcul du résultat final
      const resultatIndex = updatedItems.findIndex(item => item.id === 'resultat-final');
      const facturationItem = updatedItems.find(item => item.id === 'total-facturation');
      const prixRevientItem = updatedItems.find(item => item.id === 'prix-revient');
      
      if (resultatIndex !== -1 && facturationItem && prixRevientItem) {
        const budget = facturationItem.budget - prixRevientItem.budget;
        const paye = facturationItem.paye - prixRevientItem.paye;
        const resteAFaire = facturationItem.resteAFaire - prixRevientItem.resteAFaire;
        updatedItems[resultatIndex] = { ...updatedItems[resultatIndex], budget, paye, resteAFaire };
      }

      return updatedItems;
    });
  };

  const totalBudget = budgetItems.find(item => item.id === 'prix-revient')?.budget || 0;
  const totalPaye = budgetItems.find(item => item.id === 'prix-revient')?.paye || 0;
  const resultat = budgetItems.find(item => item.id === 'resultat-final')?.paye || 0;
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
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(budgetItems.find(item => item.id === 'prix-revient')?.resteAFaire || 0)}
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