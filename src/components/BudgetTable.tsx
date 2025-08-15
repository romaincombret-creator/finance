import React from 'react';

export interface BudgetItem {
  id: string;
  category: string;
  budget: number;
  debourse: number;
  resteAFaire: number;
  totalFinal: number;
  ecartBudget: number;
  type: 'header' | 'item' | 'subtotal' | 'total';
  color?: 'green' | 'yellow' | 'orange';
}

interface BudgetTableProps {
  items: BudgetItem[];
  onItemChange: (id: string, field: 'budget' | 'debourse' | 'resteAFaire' | 'totalFinal' | 'ecartBudget', value: number) => void;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({ items, onItemChange }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getRowClassName = (item: BudgetItem) => {
    let baseClass = "border-b border-gray-200";
    
    if (item.type === 'header') {
      return `${baseClass} bg-gray-100 font-bold text-gray-800`;
    }
    
    if (item.type === 'total') {
      return `${baseClass} bg-blue-50 font-bold text-blue-900 border-t-2 border-blue-200`;
    }
    
    if (item.type === 'subtotal') {
      return `${baseClass} bg-gray-50 font-semibold text-gray-700`;
    }
    
    if (item.color === 'green') {
      return `${baseClass} bg-green-50`;
    }
    
    if (item.color === 'yellow') {
      return `${baseClass} bg-yellow-50`;
    }
    
    if (item.color === 'orange') {
      return `${baseClass} bg-orange-50`;
    }
    
    return `${baseClass} hover:bg-gray-50`;
  };

  const handleInputChange = (id: string, field: 'budget' | 'debourse' | 'resteAFaire' | 'totalFinal' | 'ecartBudget', value: string) => {
    const numericValue = parseFloat(value) || 0;
    onItemChange(id, field, numericValue);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Catégorie</th>
              <th className="px-6 py-4 text-right font-semibold">Budget</th>
              <th className="px-6 py-4 text-right font-semibold">Déboursé</th>
              <th className="px-6 py-4 text-right font-semibold">Reste à faire</th>
              <th className="px-6 py-4 text-right font-semibold">Total final</th>
              <th className="px-6 py-4 text-right font-semibold">Écart budget</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={getRowClassName(item)}>
                <td className="px-6 py-3">
                  {item.category}
                </td>
                <td className="px-6 py-3 text-right">
                  {item.type === 'item' && item.id !== 'total-facturation' ? (
                    <input
                      type="number"
                      value={item.budget}
                      onChange={(e) => handleInputChange(item.id, 'budget', e.target.value)}
                      className="w-24 px-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : item.id === 'total-facturation' ? (
                    <input
                      type="number"
                      value={item.budget}
                      onChange={(e) => handleInputChange(item.id, 'budget', e.target.value)}
                      className="w-24 px-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-yellow-50"
                    />
                  ) : (
                    <span className={item.type === 'total' ? 'font-bold' : ''}>
                      {formatCurrency(item.budget)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 text-right">
                  {item.type === 'item' && item.id !== 'total-facturation' ? (
                    <input
                      type="number"
                      value={item.debourse}
                      onChange={(e) => handleInputChange(item.id, 'debourse', e.target.value)}
                      className="w-24 px-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  ) : item.id === 'total-facturation' ? (
                    <input
                      type="number"
                      value={item.debourse}
                      onChange={(e) => handleInputChange(item.id, 'debourse', e.target.value)}
                      className="w-24 px-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-yellow-50"
                    />
                  ) : (
                    <span className={item.type === 'total' ? 'font-bold' : ''}>
                      {formatCurrency(item.debourse)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 text-right">
                  {item.type === 'item' && item.id !== 'total-facturation' ? (
                    <input
                      type="number"
                      value={item.resteAFaire}
                      onChange={(e) => handleInputChange(item.id, 'resteAFaire', e.target.value)}
                      className="w-24 px-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  ) : item.id === 'total-facturation' ? (
                    <input
                      type="number"
                      value={item.resteAFaire}
                      onChange={(e) => handleInputChange(item.id, 'resteAFaire', e.target.value)}
                      className="w-24 px-2 py-1 text-right border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-yellow-50"
                    />
                  ) : (
                    <span className={item.type === 'total' ? 'font-bold' : ''}>
                      {formatCurrency(item.resteAFaire)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-3 text-right">
                  <span className={`${item.type === 'total' ? 'font-bold' : ''} ${item.type === 'item' ? 'bg-gray-100 px-2 py-1 rounded' : ''}`}>
                    {item.id === 'resultat-pourcentage' ? formatPercentage(item.totalFinal) : formatCurrency(item.totalFinal)}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <span className={`${item.type === 'total' ? 'font-bold' : ''} ${item.type === 'item' ? 'bg-gray-100 px-2 py-1 rounded' : ''} ${item.ecartBudget < 0 ? 'text-red-600' : item.ecartBudget > 0 ? 'text-green-600' : ''}`}>
                    {item.id === 'resultat-pourcentage' ? formatPercentage(item.ecartBudget) : formatCurrency(item.ecartBudget)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};