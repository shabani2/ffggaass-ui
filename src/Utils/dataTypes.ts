import { Category1 } from '@/Redux/Admin/categorySlice';
import { Produit1 } from '@/Redux/Admin/productSlice';
//import { Produit1 } from '@/Redux/Admin/productSlice';
//import { Produit } from '@/Utils/dataTypes';
import { EntityId } from "@reduxjs/toolkit";

export interface PointVente1 {   
    id:EntityId,
    _id: string;
    nom: string;
    emplacement: string;
    createdAt: string;
    updatedAt: string;
    
  }
export interface Produit {
  [x: string]: any;
  id: EntityId;
  _id: string;
  nom: string;
  prix: number;
  category: Category1 | null
  createdAt: string;
  updatedAt: string;
}

export interface MvtStock {
  id: EntityId;
  _id: string;
  operation: 'vente' | 'livraison';
  quantite: number;
  montant: number;
  statut: 'validate' | 'unvalidate';
  produit: Produit;
  pointVente: PointVente1;
  createdAt: string;
  updatedAt: string;
}
export interface Seuil1{
  id:EntityId,
  _id:string
  Produit : Produit,
  quantite:number
}


//import { PointVente } from "@/Redux/Admin/pointVenteSlice";

  
export interface User {
  id : EntityId,
  nom: string;
  numero: string;
  password: string;
  pointVente: PointVente1 ;  // Assurez-vous que `pointVente` est de type `PointVente`
  postnom: string;
  prenom: string;
  role: string;   
  _id: string;
}

// import { EntityId } from '@reduxjs/toolkit';

export interface Livraison {
  id: string;
  quantite: number;
  montant: number;
  statut: string;
  produit: Produit;
  pointVente: PointVente1;
  createdAt: string;
  updatedAt: string;
}

export interface Vente {
  id: string;
  quantite: number;
  montant: number;
  produit: Produit;
  pointVente: PointVente1;
  createdAt: string;
  updatedAt: string;
}

export interface Commande {
  id: string; // Identifiant unique de la commande
  quantite: number; // Quantité de produit commandée
  montant: number; // Montant total de la commande
  statut: 'validate' | 'unvalidate'; // Statut de la commande (validée ou non validée)
  produit: Produit1
  client: Client
  createdAt: string; // Date de création de la commande
  updatedAt: string; // Date de dernière mise à jour de la commande
}
export interface Client {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  [x: string]: Key | null | undefined;
  id: string; // Identifiant unique du client
  nom: string; // Nom du client
  postnom: string; // Postnom du client
  prenom: string; // Prénom du client
  numero: string; // Numéro de téléphone du client (unique)
  adresse: string; // Adresse du client
}

export interface SituationLivraison {
  _id: string;
  date: string;
  produit: Produit1;
  pointVente: PointVente1;
  quantiteTotale: number;
  montantTotal: number;
}

export interface SituationVente {
  _id: string;
  date: string;
  produit: Produit1;
  pointVente: PointVente1;
  quantiteTotale: number;
  montantTotal: number;
}


// Interface pour une SituationVente
// export interface SituationVente {
//   _id: string;
//   pointVente: PointVente1;
//   produit: Produit1;
//   dateStart: string;
//   dateEnd: string;
//   quantiteVendue: number;
//   montantTotal: number;
//   // Ajoutez ici d'autres champs si nécessaire
// }

// Interface pour les paramètres des thunks
export interface AggregateAndSaveParams {
  pointVente: string;
  produit: string;
  dateStart: string;
  dateEnd: string;
}

export interface FetchSituationsParams {
  pointVente?: string;
  produit?: string;
}

// Interface pour l'état du slice
export interface SituationVenteState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  entities: Record<string, SituationVente>;
  ids: string[];
}

export interface Situation {
  id: string;
  date: string;
  pointVente: PointVente1;
  produit: Produit1;
  quantiteTotale: number;
  montantTotal: number;
  operation: 'vente' | 'livraison'; // Ajout de la propriété operation
  
}


export interface Perfomance {
  pointVente: string; // Nom ou identifiant du point de vente
  montantTotal: number;
  quantiteTotale: number;
}


export interface PointVenteTraffic {
  point_vente: string;
  produit: string;
  quantite: number;
  prix_vente: number;
}


export interface ProductPerformance {
  produit: string;
  quantiteTotale: number;
  prixVente: number;
}

export interface PointVenteContribution {
  pointVente: string;
  montantTotal: number;
}

export interface TrafficPv {
  pointVente: string;
  produit: string;
  quantite: number;
  montantTotal: number;
}

export interface ProductContribution {
  produit: string;      // Le nom du produit
  quantite: number;     // La quantité totale vendue pour ce produit
  montantTotal: number; // Le montant total des ventes pour ce produit
}


