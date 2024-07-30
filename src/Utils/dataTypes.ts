import { Category1 } from '@/Redux/Admin/categorySlice';
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
