import React from 'react';

interface InfoCardProps {
  title: string;
  icon: React.ReactNode; // Le composant icône sera passé ici
  amount: number;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, icon, amount }) => {
  return (
    <div className="w-full h-full p-4 bg-gray-700 rounded shadow">
      <div className="flex items-center justify-between">
        <div className="w-[70%]">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 ml-6 text-2xl text-white">{amount}fc</p>
        </div>
        <div className="w-[10%] text-right">
          <div className="text-5xl text-gray-500">{icon}</div>
        </div>
      </div>
      <div className="pt-2 mt-4 border-t">
        <p className="text-gray-300">Mois en cours : {new Date().toLocaleString('fr-FR', { month: 'long' })}</p>
      </div>
    </div>
  );
};

export default InfoCard;
