import axios from 'axios';

export async function getProducts(apiUrl, nameFilter = '') {
    try {
        const query = nameFilter ? `?name=${encodeURIComponent(nameFilter)}` : '';
        const response = await axios.get(`${apiUrl}${query}`);
        return response.data.products;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to load products';
        throw new Error(message);
    }
}