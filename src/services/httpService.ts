import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { apiUrl } from '../config.json';

axios.interceptors.response.use(response => response, httpErrorHandler);
axios.defaults.baseURL = apiUrl;

// Handle unexpected errors
function httpErrorHandler(error: AxiosError) {
    // Determine if an error is unexpected
    const expectedError =
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500;

    // Log an unexpected error to a Raven imitation and show an error to a user
    if (!expectedError) {
        console.error(error);
        toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
}

// HTTP methods for easy using
const httpMethods = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete
};

export default httpMethods;