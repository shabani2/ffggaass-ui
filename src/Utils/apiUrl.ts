const VITE_API_LOCAL = import.meta.env.VITE_API_LOCAL;
const VITE_API_DEV = import.meta.env.VITE_API_DEV;
const VITE_API_PROD = import.meta.env.VITE_API_PROD;

const getApiUrl = (): string => {
    switch (window.location.hostname) {
      case 'localhost':
      case '127.0.0.1:9091/api/ffggaass/':
        console.log('ffggaass is running on localhost !');
        return VITE_API_LOCAL;
      case 'dgi.netlify.app':
      case 'dev-dgi.web.app':
        console.log('DGI is running on developement !');
        return VITE_API_DEV;
      case 'dgi.243technologies.com':
        console.log('DGI is running on production !');
        return VITE_API_PROD;
      default:
        console.log('DGI is runnign on : ', window.location.hostname);
        return VITE_API_LOCAL;
    }
  };
  
  export default getApiUrl;