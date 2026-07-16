import axios from 'axios';

export async function createProduct(apiUrl, { name, price, stock, category }) {
    try {
        const response = await axios.post(apiUrl, {
            name,
            price: Number(price),
            stock: Number(stock),
            category,
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to create product';
        throw new Error(message);
    }
}