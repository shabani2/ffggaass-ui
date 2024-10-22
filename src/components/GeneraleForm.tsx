/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGenerale, updateGenerale, selectAllGenerales, addGenerale } from "@/Redux/Admin/generalSlice"; // Actions Redux
import { AppDispatch } from "@/Redux/Store";
import getApiUrl from "@/Utils/apiUrl";

const FormGenerale = () => {
  const dispatch: AppDispatch = useDispatch();
  const general = useSelector(selectAllGenerales); // Sélectionne les données générales
  const [fileInputKey] = useState(Date.now());
  const apiUrl = getApiUrl();
  // Form state
  const [formData, setFormData] = useState({
    denominationsociale: "",
    numerorccm: "",
    dateimmatriculation: "",
    datedebutexploitation: "",
    origine: "",
    formejuridique: "",
    capitalesociale: 0,
    duree: 0,
    sigle: "",
    adressedusiege: "",
    secteuractiviteohada: "",
    activiteprincipaleohada: "",
    logoentreprise: "",
  });

  // Fichier sélectionné
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  

  useEffect(() => {
    dispatch(fetchGenerale()); // Fetch initial data
  }, [dispatch]);

  useEffect(() => {
    if (general[0] != undefined) {
      setFormData(general[0]);
      setIsEditable(false); // Désactive le formulaire si des données existent déjà
    } else {
      setIsEditable(true); // Active le formulaire s'il n'y a pas de données
    }
  }, [general]);

  // Gestion des changements de champs texte
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Gestion des fichiers (logo entreprise)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file); // Stocke le fichier
      const imagePreview = URL.createObjectURL(file); // Affichage de l'aperçu de l'image
      console.log('file=>',file),
      
      setFormData({
        ...formData,
        logoentreprise: imagePreview, // Pour l'aperçu seulement
      });
    }
  };

  // Envoi du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Ajouter les données du formulaire à formData
    Object.keys(formData).forEach((key) => {
      //@ts-ignore
      formDataToSend.append(key, formData[key as keyof typeof formData]);
    });

    // Ajouter le fichier logoentreprise si présent
    
    if (selectedFile) {
      console.info(selectedFile)
      formDataToSend.append('logoentreprise', selectedFile);
    }

    if (general[0]) {
      // Si des données générales existent, on fait un update
      //@ts-ignore
      dispatch(updateGenerale({ id: general[0].id, updatedData: formDataToSend }));
    } else {
      // Sinon, on ajoute un nouvel enregistrement
      dispatch(addGenerale(formDataToSend)).then((resp)=>{
        console.log(resp)
      });
    }
  };

  // Activer l'édition du formulaire
  const handleEdit = () => {
    setIsEditable(true);
  };

  // Ouvrir l'explorateur de fichiers pour uploader l'image
  const handleFileInputClick = () => {
    document.getElementById('file-input')?.click();
  };
console.log(apiUrl)
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        name="denominationsociale"
        placeholder="Dénomination Sociale"
        value={formData.denominationsociale}
        onChange={handleChange}
        className="border rounded-lg p-2"
        required
        disabled={!isEditable}
      />
      <input
        type="text"
        name="numerorccm"
        placeholder="Numéro RCCM"
        value={formData.numerorccm}
        onChange={handleChange}
        className="border rounded-lg p-2"
        required
        disabled={!isEditable}
      />
      <input
        type="date"
        name="dateimmatriculation"
        value={formData.dateimmatriculation}
        onChange={handleChange}
        className="border rounded-lg p-2"
        required
        disabled={!isEditable}
      />
      <input
        type="date"
        name="datedebutexploitation"
        value={formData.datedebutexploitation}
        onChange={handleChange}
        className="border rounded-lg p-2"
        required
        disabled={!isEditable}
      />
      <input
        type="text"
        name="origine"
        placeholder="Origine"
        value={formData.origine}
        onChange={handleChange}
        className="border rounded-lg p-2"
        required
        disabled={!isEditable}
      />
      <input
        type="text"
        name="formejuridique"
        placeholder="Forme Juridique"
        value={formData.formejuridique}
        onChange={handleChange}
        className="border rounded-lg p-2"
        required
        disabled={!isEditable}
      />
      <div className="flex flex-col">
        <label htmlFor="capitalesociale" className="mb-1 text-sm text-gray-700">
          Capital Social
        </label>
        <input
          type="number"
          id="capitalesociale"
          name="capitalesociale"
          placeholder="Capital Social"
          value={formData.capitalesociale}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
          disabled={!isEditable}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="duree" className="mb-1 text-sm text-gray-700">
          Durée
        </label>
        <input
          type="number"
          id="duree"
          name="duree"
          placeholder="Durée"
          value={formData.duree}
          onChange={handleChange}
          className="border rounded-lg p-2"
          required
          disabled={!isEditable}
        />
      </div>
      <input
        type="text"
        name="sigle"
        placeholder="Sigle"
        value={formData.sigle}
        onChange={handleChange}
        className="border rounded-lg p-2"
        disabled={!isEditable}
      />
      <input
        type="text"
        name="adressedusiege"
        placeholder="Adresse du Siège"
        value={formData.adressedusiege}
        onChange={handleChange}
        className="border rounded-lg p-2"
        required
        disabled={!isEditable}
      />
      <input
        type="text"
        name="secteuractiviteohada"
        placeholder="Secteur Activité OHADA"
        value={formData.secteuractiviteohada}
        onChange={handleChange}
        className="border rounded-lg p-2"
        required
        disabled={!isEditable}
      />
      <input
        type="text"
        name="activiteprincipaleohada"
        placeholder="Activité Principale OHADA"
        value={formData.activiteprincipaleohada}
        onChange={handleChange}
        className="border rounded-lg p-2"
        required
        disabled={!isEditable}
      />

      <div 
        className="col-span-2 border border-dashed border-gray-400 flex items-center justify-center cursor-pointer h-[225px] w-full"
        onClick={!isEditable ? undefined : handleFileInputClick}
      >
        {formData.logoentreprise ? (
         
          <img src={`${apiUrl}/${formData.logoentreprise}`} alt="Aperçu/" className="w-full h-full object-cover rounded-lg" />
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
          key={fileInputKey}
          disabled={!isEditable}
        />
      </div>

      <div className="col-span-2 flex justify-between">
        {!isEditable && (
          <button
            type="button"
            className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition"
            onClick={handleEdit}
          >
            Modifier
          </button>
        )}
        {isEditable && (
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
          >
            {general[0] ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        )}
      </div>
    </form>
  );
};

export default FormGenerale;
