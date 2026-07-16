import axios from 'axios';

// PUT — substituição completa
export async function updateProduct(apiUrl, id, { name, price, stock, category }) {
    try {
        const response = await axios.put(`${apiUrl}?id=${id}`, {
            name,
            price: Number(price),
            stock: Number(stock),
            category,
        });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to update product';
        throw new Error(message);
    }
}

// PATCH — atualização parcial
export async function patchProduct(apiUrl, id, fields) {
    if (fields.price !== undefined) {
        fields.price = Number(fields.price);
    }

    if (fields.stock !== undefined) {
        fields.stock = Number(fields.stock);
    }

    try {
        const response = await axios.patch(`${apiUrl}?id=${id}`, fields);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || 'Failed to patch product';
        throw new Error(message);
    }
}