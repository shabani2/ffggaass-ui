import { fakeMtvt } from "@/components/ui/PieChart";
import { EntityId } from "@reduxjs/toolkit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// interface fakeMtvt{
//     id :EntityId,
//     operation :['vente','livraison'],
//     pointVenteNom : ['goodness','thankfullness','God Love'],
//     produit :['wilki','trump','poutine','kuku','mayayi,'],
//     quantite: number,
//     montant :number,
//     statut : ['unvalidate','validate'],

// }

const operations = ['vente', 'livraison'] as const;
const pointVenteNoms = ['goodness', 'thankfullness', 'God Love'] as const;
const produits = ['wilki', 'trump', 'poutine', 'kuku', 'mayayi'] as const;
const statuts = ['unvalidate', 'validate'] as const;

function getRandomElement<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function generateFakeData(count: number): fakeMtvt[] {
    const data: fakeMtvt[] = [];

    for (let i = 0; i < count; i++) {
        const record: fakeMtvt = {
            id: i + 1,
            operation: getRandomElement(operations),
            pointVenteNom: getRandomElement(pointVenteNoms),
            produit: getRandomElement(produits),
            quantite: Math.floor(Math.random() * 100) + 1, // Quantité aléatoire entre 1 et 100
            montant: parseFloat((Math.random() * 1000).toFixed(2)), // Montant aléatoire entre 0 et 1000
            statut: getRandomElement(statuts),
        };

        data.push(record);
    }

    return data;
}

// Générer 200 enregistrements
export const fakeData = generateFakeData(200);
console.log(fakeData);
