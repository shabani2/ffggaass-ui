/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Grid, CircularProgress } from '@mui/material';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import { AppDispatch, RootState } from '@/Redux/Store';
// import { fetchProduits, Produit1, selectAllProduits } from '@/Redux/Admin/productSlice';
// import { fetchCategories, selectAllCategories } from '@/Redux/Admin/categorySlice';
// import { selectCurrentUser } from '@/Redux/Auth/userSlice';
// import { Vente } from '@/Utils/dataTypes';
// import { addVente,fetchSolde } from '@/Redux/Admin/venteSlice';
// import 'jspdf-autotable';
// //import { DownloadIcon } from 'lucide-react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


// const validationSchema = yup.object({
//   montant: yup.number().required('Montant est requis').min(1, 'Le montant doit être au moins de 1'),
//   produit: yup.string().required('Produit est requis'),
//   category: yup.string().required('Catégorie est requise'),
//   quantite: yup
//     .number()
//     .required('Quantité est requise')
//     .min(1, 'La quantité doit être au moins de 1')
//     .test(
//       'quantite-stock',
//       'Quantité en stock insuffisante pour valider cette opération',
//       function (value) {
//         const { solde } = this.options.context; // Retrieve solde from context

//         console.log('Solde in validation:', solde); // Debug: Log solde value
//         console.log('Quantité saisie:', value); // Debug: Log entered quantity

//         if (solde === undefined || solde === null) {
//           console.log('Solde is undefined or null. Skipping validation.');
//           return true; // Skip validation if solde is not available
//         }

//         return value <= solde; // Validate that quantity doesn't exceed solde
//       }
//     ),
// });

// const validationClientSchema = yup.object({ 
//   name: yup.string().required('name is required'),
//   numero: yup.string().required('numero is required'),
//   adresse:yup.string().required('adresse is required'),
// });

// const CaisseVendeur: React.FC = () => {
//   const dispatch: AppDispatch = useDispatch<AppDispatch>();
//   const produits = useSelector((state: RootState) => selectAllProduits(state));
//   const categories = useSelector((state: RootState) => selectAllCategories(state));

//   const [filteredProduits, setFilteredProduits] = useState<Produit1[]>([]);
//   const [selectedProduit, setSelectedProduit] = useState<Produit1 | null>(null);
//   const [client,setClient] = useState({nom:'',numero:'',adresse:''})
//   const [loading, setLoading] = useState(false);
 
//   const [solde,setSolde] = useState(0);
 
//   const user = useSelector(selectCurrentUser);
//  // const [produitId1,setProduitId1] = useState('')

//   const [products, setProducts] = useState<Vente[]>([]);
//   const addStatus = useSelector((state: RootState) => state.vente.status);
 

//   useEffect(() => {
//     dispatch(fetchCategories());
//     dispatch(fetchProduits());
//   }, [dispatch]);

//   useEffect(() => {
//     if (addStatus === 'failed') {
//       toast.error(`Erreur: la quantite en stock est inferieur pour accepter cette operation`);
//     }
//   }, [addStatus]);

  

//   const formik = useFormik({
//     initialValues: {
//       quantite: 0,
//       montant: 0,
//       produit: '',
//       category: '',
//       prix: 0,
//     },
//     validationSchema: validationSchema,
//     validateOnChange: true,
//     validateOnBlur: true,
//     validate: async (values) => {
//       try {
//         // Pass 'solde' into Yup schema validation
//         await validationSchema.validate(values, { context: { solde } });
//         return {}; // No errors
//       } catch (error) {
//         // Handle and return validation errors to Formik
//         return error.inner.reduce((acc, err) => {
//           acc[err.path] = err.message;
//           return acc;
//         }, {});
//       }
//     },
//     onSubmit: (values, { resetForm }) => {
//       // Your submit logic
//       if(values.quantite>solde){
//        // toast.failed('quantite entre superieur au solde')
//         toast.error('La quantité saisie est supérieure au solde disponible');
//         return ;
//       }
//       const newMvtStock = { ...values, produit: selectedProduit };
//       const data = {
//         quantite: newMvtStock.quantite,
//         montant: newMvtStock.montant,
//         produit: newMvtStock?.produit,
//         pointVente: user?.pointVente,
//       };
//       //@ts-ignore
//       setProducts([...products, data]);
//       resetForm();
//     },
//     enableReinitialize: true,
//   });
  
  

//   const handleCategoryChange = (event: { target: { value: any } }) => {
//     const categoryId = event.target.value as string;
//     formik.setFieldValue('category', categoryId);
//     setFilteredProduits(produits.filter((produit: Produit1) => produit.category._id === categoryId));
//     formik.setFieldValue('produit', '');
//     formik.setFieldValue('prix', 0);
//     formik.setFieldValue('quantite', 0);
//   };


//   useEffect(() => {
//     if (solde !== null) {
//       console.log('Solde mis à jour:', solde);
//     }
//   }, [solde]);

 

//   const handleProduitChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const produitId = event.target.value;
  
//     try {
//       const resultAction = await dispatch(fetchSolde({ pointVenteId: user?.pointVente._id, produitId }));
//       if (fetchSolde.fulfilled.match(resultAction)) {
//         const fetchedSolde = resultAction.payload;
//         setSolde(fetchedSolde);  // Make sure solde is set here
//         console.log('Solde fetched:', fetchedSolde); // Debugging: Check if solde is correctly fetched
//       } else {
//         console.error('Erreur lors de la récupération du solde:', resultAction.error);
//         setSolde(null); // Set solde to null if fetching fails
//       }
//     } catch (error) {
//       console.error('Erreur lors de la récupération du solde:', error);
//       setSolde(null); // Handle any errors and ensure solde is set to null
//     }
  
//     const selected = produits.find((produit) => produit?._id === produitId);
//     setSelectedProduit(selected || null);
//     formik.setFieldValue('produit', produitId);
//     formik.setFieldValue('prix', selected?.prixVente);
//   };
  


//   useEffect(() => {
//     const montant = formik.values.quantite * formik.values.prix;
//     formik.setFieldValue('montant', montant);
//   }, [formik.values.quantite, formik.values.prix]);  

//   const totalAmount = products.reduce((acc, product) => acc + product.montant, 0);

//   const clientFormik = useFormik({
//     initialValues: {nom: '', numero: '', adresse: ''},
//     validationSchema: validationClientSchema,
//     onSubmit: (values, { resetForm }) => {
//       console.log('Form Submitted', client);
//       products.forEach((p) => dispatch(addVente(p)));
//       setClient(values);
//       resetForm();
//       setProducts([]);
//     },
//   });
//   const handleChange = (e: { target: { name: any; value: any; }; }) => {
//     const { name, value } = e.target;
//     setClient({
//       ...client,
//       [name]: value,
//     });
//   };
//   const validateFacture = async (e: { preventDefault: () => void; }) => {
//     e.preventDefault();
//     setLoading(true); // Commencez le chargement

//     try {
//       console.log('Form Submitted', client);
//       for (const p of products) {
//         await dispatch(addVente(p)); // Ajoutez des ventes une par une
//         if(addStatus=='fulfilled'){
//           toast.success('Vente effectuee avec succes');
//         }
        
//       }     
     
//       setProducts([]);
//       //setModalOpen(true)
//     } finally {
//       setLoading(false); // Terminez le chargement
//     }
//   };


//   return (
//     <>
    
//     <div className='p-[2rem] w-full bg-gray-300'>
    
      
//     <div className="flex flex-col items-center w-full min-h-screen p-6 ">
//       {/* Header */}
//       <header className="w-full p-6 mb-6 bg-white rounded-lg shadow-lg">
//         <h1 className="text-3xl font-bold text-gray-800">Gestion de  Caisse</h1>
//       </header>

//       {/* Main Content */}
//       <main className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
//         {/* Product Selection Area */}
//         <section className="p-6 bg-white rounded-lg shadow-lg md:col-span-2">
        

//           {/* Product Input */}
//           <div className="space-y-4 ">           
             
//               <Box component="form" onSubmit={formik.handleSubmit} sx={{ flexGrow: 1 }}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={9}>
//                     <h2 className="mb-4 text-2xl font-semibold text-gray-700">Sélection des Produits</h2>
//                     </Grid>
//                     <Grid item xs={3}>
//                     <Box >
//                       <button  className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500" type='submit'>
//                         Ajouter le produit
//                       </button>
//                     </Box>
//                     </Grid>
//                 </Grid>
//               <Grid container spacing={2}>
//                 <Grid item xs={4}>
//                   <FormControl fullWidth margin="normal">
//                     <InputLabel>Category</InputLabel>
//                     <Select
//                       name="category"
//                       value={formik.values.category}
//                       onChange={handleCategoryChange}
//                       error={formik.touched.category && Boolean(formik.errors.category)}
//                     >
//                       {categories.map((category) => (
//                         <MenuItem key={category.id} value={category.id}>
//                           {category.nom}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 <Grid item xs={4}>
//                   <FormControl fullWidth margin="normal">
//                     <InputLabel>Produit</InputLabel>
//                     <Select
//                       name="produit"
//                       value={formik.values.produit}
//                       onChange={handleProduitChange}
//                       error={formik.touched.produit && Boolean(formik.errors.produit)}
//                     >
//                       {filteredProduits.map((produit) => (
//                         <MenuItem key={produit.id} value={produit.id}>
//                           {produit.nom}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>

//                 <Grid item xs={4}>
//                   <TextField
//                     fullWidth
//                     margin="normal"
//                     id="prix"
//                     name="prix"
//                     label="Prix"
//                     type="number"
//                     disabled
//                     value={formik.values.prix}
//                     onChange={formik.handleChange}
//                     error={formik.touched.prix && Boolean(formik.errors.prix)}
//                     helperText={formik.touched.prix && formik.errors.prix}
//                     InputProps={{
//                       readOnly: true,
//                     }}
//                   />
//                 </Grid>

//                 <Grid item xs={4}>
//                   <TextField
//                     fullWidth
//                     margin="normal"
//                     id="quantite"
//                     name="quantite"
//                     label="Quantité"
//                     type="number"
//                     value={formik.values.quantite}
//                     onChange={formik.handleChange}
//                     error={formik.touched.quantite && Boolean(formik.errors.quantite)}
//                     helperText={formik.touched.quantite && formik.errors.quantite}
//                   />

//                 </Grid>

//                 <Grid item xs={4}>
//                   <TextField
//                     fullWidth
//                     margin="normal"
//                     disabled
//                     id="montant"
//                     name="montant"
//                     label="Montant"
//                     type="number"
//                     value={formik.values.montant}
//                     onChange={formik.handleChange}
//                     error={formik.touched.montant && Boolean(formik.errors.montant)}
//                     helperText={formik.touched.montant && formik.errors.montant}
//                   />
//                 </Grid>
//               </Grid>

              
//             </Box>  
//             </div>
//             {/* <button
//               onClick={addProduct}
//               className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500"
//             >
//               Ajouter le Produit
//             </button> */}
          

//           {/* Products List */}
//           <div className="mt-6 space-y-4">
//             {products.map((product:any, index) => (
//               <div key={index} className="flex items-center justify-between p-4 rounded-lg shadow-inner bg-gray-50">
//                 <div className="flex items-center space-x-4">
//                   <span className="font-medium text-gray-600">{product?.produit?.nom}</span>
//                   <span className="font-semibold text-gray-800">
//                     {product.quantite} x fc :{product?.produit?.prixVente}
//                   </span>
//                 </div>
//                 <span className="font-bold text-gray-800">fc: {product.montant.toFixed(2)}</span>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Invoice Creation Area */}
//         <section className="p-6 bg-white rounded-lg shadow-lg">
//           <h2 className="mb-4 text-2xl font-semibold text-gray-700">Rédiger la Facture</h2>

//           {/* Client Information */}
//           <form  onSubmit={validateFacture} className="mb-4 space-y-4">
//             <input
//               type="text"
//               name="nom"
//               value={client.nom}
//               onChange={handleChange}
//               placeholder="Nom du client"
//               className={`w-full p-3 border rounded-lg focus:outline-none ${
//                 clientFormik.touched.nom && clientFormik.errors.nom
//                   ? "border-red-500 focus:border-red-500"
//                   : "border-gray-300 focus:border-blue-500"
//               }`}     
             
//             />
//             {clientFormik.touched.nom && clientFormik.errors.nom ? (
//               <div className="mt-1 text-sm text-red-500">{clientFormik.errors.nom}</div>
//             ) : null}
//             <input
//               type="text"
//               name="numero"
//               value={client.numero}
//               onChange={handleChange}
//               placeholder="numero du client"
             
//               className={`w-full p-3 border rounded-lg focus:outline-none ${
//                 clientFormik.touched.nom && clientFormik.errors.nom
//                   ? "border-red-500 focus:border-red-500"
//                   : "border-gray-300 focus:border-blue-500"
//               }`}
//             />
//             {clientFormik.touched.numero&& clientFormik.errors.numero? (
//               <div className="mt-1 text-sm text-red-500">{clientFormik.errors.numero}</div>
//             ) : null}
//              <input
//               type="text"
//               name="adresse"
//               value={client.adresse}
//               onChange={handleChange}
//               placeholder="Adresse du client"
//               className={`w-full p-3 border rounded-lg focus:outline-none ${
//                 clientFormik.touched.nom && clientFormik.errors.nom
//                   ? "border-red-500 focus:border-red-500"
//                   : "border-gray-300 focus:border-blue-500"
//               }`}
              
//             />
//               {clientFormik.touched.adresse && clientFormik.errors.adresse ? (
//               <div className="mt-1 text-sm text-red-500">{clientFormik.errors.adresse}</div>
//             ) : null}

//           {/* Selected Products Summary */}
//           <div className="mb-4 space-y-2">
//             {products.map((product:any, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <span className="text-gray-600">{product?.produit.nom}</span>
//                 <span className="font-semibold text-gray-800">
//                   fc: {product?.produit.prixVente} x {product.quantite}
//                 </span>
//               </div>
//             ))}
//           </div>

//           <hr className="my-4" />

//           {/* Total Amount */}
//           <div className="flex items-center justify-between mb-6">
//             <span className="font-medium text-gray-600">Montant Total :</span>
//             <span className="font-bold text-gray-800">fc: {totalAmount.toFixed(2)}</span>
//           </div>

//           {/* Validate Invoice Button */}
//           <button
//           disabled={loading}
//            type="submit"  // Assurez-vous que le bouton est de type "submit"
//             className="w-full px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-500"
//           >
//            {loading ? <CircularProgress size={24} /> : 'Validate Facture'}
//           </button>
//         </form>
        
//         </section>
        
//       </main>
//     </div>

            
//     </div>
   
//     <ToastContainer 
//        position="top-center"
//        autoClose={5000}
//        hideProgressBar={false}
//        newestOnTop={false}
//        closeOnClick
//        rtl={false}
//        pauseOnFocusLoss
//        draggable
//        pauseOnHover
//       />
//     </>
    
//   );
// };


// export default CaisseVendeur


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Grid, CircularProgress, Modal } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchProduits, Produit1, selectAllProduits } from '@/Redux/Admin/productSlice';
import { fetchCategories, selectAllCategories } from '@/Redux/Admin/categorySlice';
import { selectCurrentUser } from '@/Redux/Auth/userSlice';
import { Vente } from '@/Utils/dataTypes';
import { addVente, fetchSolde, generateInvoicePdf } from '@/Redux/Admin/venteSlice'; // Importation de generateInvoicePdf
import 'jspdf-autotable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = yup.object({
  montant: yup.number().required('Montant est requis').min(1, 'Le montant doit être au moins de 1'),
  produit: yup.string().required('Produit est requis'),
  category: yup.string().required('Catégorie est requise'),
  quantite: yup
    .number()
    .required('Quantité est requise')
    .min(1, 'La quantité doit être au moins de 1')
    .test(
      'quantite-stock',
      'Quantité en stock insuffisante pour valider cette opération',
      function (value) {
        const { solde } = this.options.context;
        if (solde === undefined || solde === null) return true;
        return value <= solde;
      }
    ),
});



const CaisseVendeur: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const produits = useSelector((state: RootState) => selectAllProduits(state));
  const categories = useSelector((state: RootState) => selectAllCategories(state));
  const [filteredProduits, setFilteredProduits] = useState<Produit1[]>([]);
  const [selectedProduit, setSelectedProduit] = useState<Produit1 | null>(null);
  const [client, setClient] = useState({ nom: '', numero: '', adresse: '' });
  const [loading, setLoading] = useState(false);
  const [solde, setSolde] = useState(0);
  const user = useSelector(selectCurrentUser);
  const [products, setProducts] = useState<Vente[]>([]);
  const addStatus = useSelector((state: RootState) => state.vente.status);
  const [ventesIds,setVenteIds] = useState<string[]>([])

  const [modalOpen, setModalOpen] = useState(false); // Modal pour confirmer l'impression

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProduits());
  }, [dispatch]);

  useEffect(() => {
    if (addStatus === 'failed') {
      toast.error(`Erreur: la quantité en stock est insuffisante`);
    }
  }, [addStatus]);

  const formik = useFormik({
    initialValues: {
      quantite: 0,
      montant: 0,
      produit: '',
      category: '',
      prix: 0,
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validate: async (values) => {
      try {
        await validationSchema.validate(values, { context: { solde } });
        return {};
      } catch (error) {
        return error.inner.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
      }
    },
    onSubmit: (values, { resetForm }) => {
      if (values.quantite > solde) {
        toast.error('La quantité saisie est supérieure au solde disponible');
        return;
      }
      const newMvtStock = { ...values, produit: selectedProduit };
      const data = {
        quantite: newMvtStock.quantite,
        montant: newMvtStock.montant,
        produit: newMvtStock?.produit,
        pointVente: user?.pointVente,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      setProducts([...products, data]);
      resetForm();
    },
    enableReinitialize: true,
  });

  const handleProduitChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const produitId = event.target.value;
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const resultAction = await dispatch(fetchSolde({ pointVenteId: user?.pointVente._id, produitId }));
      if (fetchSolde.fulfilled.match(resultAction)) {
        const fetchedSolde = resultAction.payload;
        setSolde(fetchedSolde);
      } else {
        setSolde(null);
      }
    } catch (error) {
      setSolde(null);
    }

    const selected = produits.find((produit) => produit?._id === produitId);
    setSelectedProduit(selected || null);
    formik.setFieldValue('produit', produitId);
    formik.setFieldValue('prix', selected?.prixVente);
  };

  useEffect(() => {
    const montant = formik.values.quantite * formik.values.prix;
    formik.setFieldValue('montant', montant);
  }, [formik.values.quantite, formik.values.prix]);

  const totalAmount = products.reduce((acc, product) => acc + product.montant, 0);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setClient({
      ...client,
      [name]: value,
    });
  };

  // const validateFacture = async (e: { preventDefault: () => void }) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     for (const p of products) {
  //       await dispatch(addVente(p)).then((resp : { payload: { _id: string }} )=>{
  //         setVenteIds((prevVentesIds) => [...prevVentesIds, resp.payload._id]);
  //       });
  //       if (addStatus === 'fulfilled') {
  //         toast.success('Vente effectuée avec succès');
  //       }
  //     }
  //     setModalOpen(true); // Ouvrir le modal après la validation
  //   } finally {
  //     setLoading(false);
  //     setProducts([]);
  //   }
  // };

  const validateFacture = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      for (const p of products) {
        const responseAction = await dispatch(addVente(p));
  
        if (addVente.fulfilled.match(responseAction)) {
          const { _id } = responseAction.payload;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          setVenteIds((prevVentesIds) => [...prevVentesIds, _id]);
          toast.success('Vente effectuée avec succès');
        } else {
          toast.error('Échec de la vente');
        }
      }
  
      setModalOpen(true); // Ouvrir le modal après la validation
    } catch (error) {
      toast.error('Erreur lors de la validation de la facture');
    } finally {
      setLoading(false);
      setProducts([]); // Réinitialiser les produits seulement après le traitement
    }
  };
  

  const handlePrintInvoice = async () => {
    // Récupérer les IDs des produits
   
    
    try {
      // Appel de la fonction pour générer la facture PDF
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      console.log(ventesIds)
      //@ts-ignore
      await dispatch(generateInvoicePdf({ client: client, ventes : ventesIds })).unwrap();
      
      // Fermer le modal après l'impression
      setModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la génération de la facture:', error);
      // Gérer l'erreur si nécessaire (par exemple, afficher un message d'erreur)
    }
  };

  return (
    <>
      <div className="p-[2rem] w-full bg-gray-300">
        <div className="flex flex-col items-center w-full min-h-screen p-6">
          <header className="w-full p-6 mb-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800">Gestion de Caisse</h1>
          </header>

          <main className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            <section className="p-6 bg-white rounded-lg shadow-lg md:col-span-2">
              <div className="space-y-4">
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={9}>
                      <h2 className="mb-4 text-2xl font-semibold text-gray-700">Sélection des Produits</h2>
                    </Grid>
                    <Grid item xs={3}>
                      <Box>
                        <button className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500" type="submit">
                          Ajouter le produit
                        </button>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Catégorie</InputLabel>
                        <Select
                          name="category"
                          value={formik.values.category}
                          onChange={(e) => {
                            formik.handleChange(e);
                            const categoryId = e.target.value;
                            setFilteredProduits(produits.filter((prod) => prod.category._id === categoryId));
                          }}
                          error={formik.touched.category && Boolean(formik.errors.category)}
                        >
                          {categories.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                              {category.nom}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Produit</InputLabel>
                        <Select
                          name="produit"
                          value={formik.values.produit}
                          onChange={handleProduitChange}
                          error={formik.touched.produit && Boolean(formik.errors.produit)}
                        >
                          {filteredProduits.map((produit) => (
                            <MenuItem key={produit._id} value={produit._id}>
                              {produit.nom}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        margin="normal"
                        id="prix"
                        name="prix"
                        label="Prix"
                        type="number"
                        disabled
                        value={formik.values.prix}
                        onChange={formik.handleChange}
                        error={formik.touched.prix && Boolean(formik.errors.prix)}
                        helperText={formik.touched.prix && formik.errors.prix}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        margin="normal"
                        id="quantite"
                        name="quantite"
                        label="Quantité"
                        type="number"
                        value={formik.values.quantite}
                        onChange={formik.handleChange}
                        error={formik.touched.quantite && Boolean(formik.errors.quantite)}
                        helperText={formik.touched.quantite && formik.errors.quantite}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        margin="normal"
                        disabled
                        id="montant"
                        name="montant"
                        label="Montant"
                        type="number"
                        value={formik.values.montant}
                        onChange={formik.handleChange}
                        error={formik.touched.montant && Boolean(formik.errors.montant)}
                        helperText={formik.touched.montant && formik.errors.montant}
                      />
                    </Grid>
                  </Grid>
                </Box>
                          {/* Products List */}
              <div className="mt-6 space-y-4">
                {products.map((product:any, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg shadow-inner bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-gray-600">{product?.produit?.nom}</span>
                    <span className="font-semibold text-gray-800">
                        {product.quantite} x fc :{product?.produit?.prixVente}
                      </span>
                    </div>
                    <span className="font-bold text-gray-800">fc: {product.montant.toFixed(2)}</span>
                  </div>            ))}
              </div>
       
              </div>
            </section>

            {/* Invoice creation area */}
            <section className="p-6 bg-white rounded-lg shadow-lg">
              <form onSubmit={validateFacture} className="mb-4 space-y-4">
                {/* Client details */}
                <TextField
                  fullWidth
                  name="nom"
                  label="Nom du client"
                  value={client.nom}
                  onChange={handleChange}
                  error={client.nom === ''}
                  helperText={client.nom === '' ? 'Nom requis' : ''}
                />
                <TextField
                  fullWidth
                  name="numero"
                  label="Numéro du client"
                  value={client.numero}
                  onChange={handleChange}
                  error={client.numero === ''}
                  helperText={client.numero === '' ? 'Numéro requis' : ''}
                />
                <TextField
                  fullWidth
                  name="adresse"
                  label="Adresse du client"
                  value={client.adresse}
                  onChange={handleChange}
                  error={client.adresse === ''}
                  helperText={client.adresse === '' ? 'Adresse requise' : ''}
                />

                {/* Product summary */}
                <div className="mb-4 space-y-2">
                  {products.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-600">{product?.produit?.nom}</span>
                      <span className="font-semibold text-gray-800">
                        fc: {product?.produit?.prixVente} x {product.quantite}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="my-4" />

                <div className="flex items-center justify-between mb-6">
                  <span className="font-medium text-gray-600">Montant Total :</span>
                  <span className="font-bold text-gray-800">fc: {totalAmount.toFixed(2)}</span>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-500"
                >
                  {loading ? <CircularProgress size={24} /> : 'Valider la Vente'}
                </button>
              </form>
            </section>
          </main>
        </div>
      </div>

      {/* Modal for printing invoice */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 className="text-2xl font-semibold">Confirmer l'impression</h2>
          <p className="mt-2">Voulez-vous imprimer la facture maintenant?</p>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 mr-2 text-white bg-red-600 rounded-lg shadow-md hover:bg-red-500"
              onClick={() => setModalOpen(false)}
            >
              Annuler
            </button>
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500"
              onClick={handlePrintInvoice}
            >
              Imprimer
            </button>
          </div>
        </Box>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default CaisseVendeur;
