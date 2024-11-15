const VITE_API_LOCAL = import.meta.env.VITE_API_LOCAL;
const VITE_API_DEV = import.meta.env.VITE_API_DEV;
const VITE_API_PREPROD = import.meta.env.VITE_API_PREPROD;
const VITE_API_PROD = import.meta.env.VITE_API_PROD;

const getApiUrl = (): string => {
  const hostname = window.location.hostname; // Ne renvoie que le nom de domaine

  switch (hostname) {
    case 'localhost':
    case '127.0.0.1':
      console.log('ffggaass is running on localhost!');
      return VITE_API_LOCAL;

    case 'inaf-backend-510563b7750d.herokuapp.com':
      console.log('ffggaass is running on development or preproduction!');
      if (process.env.NODE_ENV === 'development') {
        return VITE_API_DEV;
      } else if (process.env.NODE_ENV === 'preproduction') {
        return VITE_API_PREPROD;
      }
      // Ajoutez une valeur de secours si la condition n'est pas remplie
      return VITE_API_DEV; 

    case 'inaf-vente.netlify.app':
      console.log('ffggaass is running on development!');
      return VITE_API_DEV;

    case 'www.agrecavente.online':
      console.log('ffggaass is running on preproduction!');
      return VITE_API_PREPROD;

    case 'dgi.243technologies.com':
      console.log('DGI is running on production!');
      return VITE_API_PROD;

    default:
      console.log('Unknown environment, defaulting to local API:', hostname);
      return VITE_API_LOCAL;
  }
};

export default getApiUrl;
