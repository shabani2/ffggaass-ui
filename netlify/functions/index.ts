/* eslint-disable @typescript-eslint/no-unused-vars */

export  const handler = async (event, context) => {
    // Logique de votre API ici
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello from the API!" }),
    };
};