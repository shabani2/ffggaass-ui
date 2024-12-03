import { lazy } from 'react';


const Home = lazy(()=>import('../Pages/Admins/Home'))
const Caisse = lazy(()=>import('../Pages/Admins/Caisse'))
const Livraison = lazy(()=>import('../Pages/Admins/Livraison'))
const Produit = lazy(()=>import('../Pages/Admins/Produit'))
const Profile = lazy(()=>import('../Pages/Admins/Profile'))
const Stock = lazy(()=>import('../Pages/Admins/Stock'))
const Vente = lazy(()=>import('../Pages/Admins/Vente'))
const Configuration = lazy(()=>import('../Pages/Admins/Configuration'))
const Client = lazy(()=>import('../Pages/Admins/ClientPage.tsx'))
const commande = lazy(()=>import('../Pages/Admins/CommandePage.tsx'))
const bonEntre = lazy(()=>import('../Pages/Admins/BonEntrePage.tsx'))

// les composants de la configuration
const General = lazy(()=>import('../Pages/Admins/Conf/Generale'))
const PointVente = lazy(()=>import('../Pages/Admins/Conf/PointVente'))
const Category= lazy(()=>import('../Pages/Admins/Conf/Category'))
const Seuil = lazy(()=>import("../Pages/Admins/Conf/Seuil"))
const Vendeur= lazy(()=>import('../Pages/Admins/Conf/Vendeur'))
const Admin = lazy(()=>import('../Pages/Admins/Conf/Admin'))

//les composants lies au vendeur
const  HomeVendeur = lazy(()=>import('@/Pages/Vendeurs/HomeVendeur'))
const  LivraisonVendeur = lazy(()=>import('@/Pages/Vendeurs/LivraisonVendeur'))
const  VenteVendeur = lazy(()=>import('@/Pages/Vendeurs/VenteVendeur'))
const  CaisseVendeur = lazy(()=>import('@/Pages/Vendeurs/CaisseVendeur'))
const  Stockendeur = lazy(()=>import('@/Pages/Vendeurs/StockVendeur'))
const  ProfilVendeur = lazy(()=>import('@/Pages/Vendeurs/Profile'))

const coreRoutes = [
  {
    path: '/',
    title: 'Acceuil',
    component: Home,
  },
  {
    path: '/produit',
    title: 'Produit',
    component: Produit,
  },
  {
    path: '/caisse',
    title: 'Livraison',
    component: Caisse,
  },
  {
    path: '/livraison',
    title: 'Journal de Livraisons',
    component: Livraison,
  },
 
  {
    path: '/bonEntre',
    title: 'Journal Des Intrants',
    component: bonEntre,
  },
  {
    path: '/client',
    title: 'Clients',
    component: Client,
  },
  {
    path: '/commande',
    title: 'Commandes',
    component: commande,
  },
  {
    path: '/vente',
    title: 'Rapport de ventes',
    component: Vente,
  },
 
  {
    path: '/stock',
    title: 'Solde en Stock',
    component: Stock,
  },


];

export const configRoute = [
  {
    path: '/settings/general',
    title: 'General',
    component: General,
  },
  {
    path: '/settings/pointvente',
    title: 'Point de Vente',
    component: PointVente,
  },
  {
    path: '/settings/category',
    title: 'Category',
    component: Category,
  },
  {
    path: '/settings/seuil',
    title: 'Seuil',
    component: Seuil,
  },
  {
    path: '/settings/vendeur',
    title: 'Vendeurs',
    component: Vendeur,
  },
  {
    path: '/settings/admin',
    title: 'Admin',
    component: Admin,
  },
 
 
 

]

export const vendeurRoute = [
  {
    path: '/vendeur/',
    title: 'Dashboard',
    component: HomeVendeur,
  },
  {
    path: '/vendeur/livraison',
    title: 'Livraisons',
    component: LivraisonVendeur,
  },
  {
    path: '/vendeur/vente',
    title: 'Fiche de ventes',
    component: VenteVendeur,
  },
  {
    path: '/vendeur/caisse',
    title: 'Caisse',
    component: CaisseVendeur,
  },
  {
    path: '/vendeur/stock',
    title: 'Stock',
    component: Stockendeur,
  },
  {
    path: '/vendeur/profil',
    title: 'Profil',
    component: ProfilVendeur,
  },
 
 
 

]

export const others = [
  {
    path: '/settings',
    title: 'Configuration',
    component: Configuration,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  } 
]

const routes = [...coreRoutes];
export default routes;
