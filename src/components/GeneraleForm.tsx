/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';

const GeneraleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    denominationsociale: '',
    numerorccm: '',
    dateimmatriculation: '',
    datedebutexploitation: '',
    origine: '',
    formejuridique: '',
    capitalesociale: 0,
    duree: 0,
    sigle: '',
    adressedusiege: '',
    secteuractiviteohada: '',
    activiteprincipaleohada: '',
    logoentreprise: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-ts-comment
 // @ts-expect-error
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // Pour réinitialiser l'input

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logoentreprise: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputClick = () => {
    document.getElementById('file-input')?.click();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    // Ici, tu peux envoyer les données au serveur
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="denominationsociale"
          placeholder="Dénomination Sociale"
          value={formData.denominationsociale}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="numerorccm"
          placeholder="Numéro RCCM"
          value={formData.numerorccm}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        <input
          type="date"
          name="dateimmatriculation"
          value={formData.dateimmatriculation}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        <input
          type="date"
          name="datedebutexploitation"
          value={formData.datedebutexploitation}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="origine"
          placeholder="Origine"
          value={formData.origine}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="formejuridique"
          placeholder="Forme Juridique"
          value={formData.formejuridique}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        <input
          type="number"
          name="capitalesociale"
          placeholder="Capital Social"
          value={formData.capitalesociale}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        <input
          type="number"
          name="duree"
          placeholder="Durée"
          value={formData.duree}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="sigle"
          placeholder="Sigle"
          value={formData.sigle}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />
        <input
          type="text"
          name="adressedusiege"
          placeholder="Adresse du Siège"
          value={formData.adressedusiege}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="secteuractiviteohada"
          placeholder="Secteur Activité OHADA"
          value={formData.secteuractiviteohada}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        <input
          type="text"
          name="activiteprincipaleohada"
          placeholder="Activité Principale OHADA"
          value={formData.activiteprincipaleohada}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
        />
        
        <div 
          className="col-span-2 border border-dashed border-gray-400 flex items-center justify-center cursor-pointer h-[225px] w-full"
          onClick={handleFileInputClick}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Aperçu" className="h-full w-full object-cover rounded-lg" />
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-gray-500">Cliquez ici pour uploader une image</span>
              <span className="text-gray-400">Dimension: 225x225</span>
            </div>
          )}
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            key={fileInputKey} // Pour réinitialiser l'input
          />
        </div>

        <div className="col-span-2 flex justify-end">
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
                Enregistrer
            </button>
        </div>

      </form>
    </div>
  );
};

export default GeneraleForm;
