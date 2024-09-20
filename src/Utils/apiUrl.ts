const VITE_API_LOCAL = import.meta.env.VITE_API_LOCAL;
const VITE_API_DEV = import.meta.env.VITE_API_DEV;
const VITE_API_PROD = import.meta.env.VITE_API_PROD;

const getApiUrl = (): string => {
  const hostname = window.location.hostname;

  switch (hostname) {
    case 'localhost':
    case '127.0.0.1':
      console.log('ffggaass is running on localhost!');
      return VITE_API_LOCAL; // Utilise l'API locale pour le développement local

    case 'inaf-backend-510563b7750d.herokuapp.com':
    case 'https://inaf-vente.netlify.app/':
      console.log('ffggaass is running on development!');
      return VITE_API_DEV; // Utilise l'API pour le développement

    case 'dgi.243technologies.com':
      console.log('DGI is running on production!');
      return VITE_API_PROD; // Utilise l'API pour la production

    default:
      console.log('Unknown environment, defaulting to local API:', hostname);
      return VITE_API_LOCAL; // Par défaut, retourne l'API locale
  }
};

export default getApiUrl;
