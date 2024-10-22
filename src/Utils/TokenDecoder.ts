//import jwtDecode from 'jwt-decode';
import * as jwt_decode from 'jwt-decode';

interface User {
    userId: string;
    nom: string;
    postnom: string;
    prenom: string;
    role: string;
    pointVente: {unknown: unknown}
}

const getToken = (): string | null => {
    return localStorage.getItem('jwt');
};

const TokenDecoder = (): User | null => {
    const token = getToken();
    if (!token) {
        return null;
    }

    try {
        const decodedToken = jwt_decode.jwtDecode<User>(token);
        return decodedToken;
    } catch (error) {
        console.error('Error decoding token', error);
        return null;
    }
};
export default TokenDecoder;

// Exemple d'accès aux informations de l'utilisateur
// const user = getUserFromToken();

// if (user) {
//     console.log('User:', user);
    // Vous pouvez accéder à toutes les propriétés de l'utilisateur ici
// } else {
//     console.log('No user found');
// }

// Exemple d'accès aux informations de l'utilisateur

