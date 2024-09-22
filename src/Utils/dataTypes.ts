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
  [x: string]: any;
  id: string;
  quantite: number;
  montant: number;
  statut: string;
  produit: Produit1;
  pointVente: PointVente1;
  createdAt: string;
  updatedAt: string;
}

export interface Vente {
  id: string;
  quantite: number;
  montant: number;
  produit: Produit1;
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


export interface BonEntre { 
  produit: string;  // Référence à l'objet Produit (ID)
  quantite: number;  // Quantité des produits dans ce bon d'entrée
  montant: number;  // Montant total du bon d'entrée
 
}



export interface General { 
  denominationsociale: string;
  numerorccm: string;
  dateimmatriculation: string;
  datedebutexploitation: string;
  origine: string;
  formejuridique: string;
  capitalesociale: number;
  duree: number;
  sigle: string;
  adressedusiege: string;
  secteuractiviteohada: string;
  activiteprincipaleohada: string;
  logoentreprise: string; // Cela pourrait être une URL ou un chemin vers l'image
}




