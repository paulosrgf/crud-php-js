import { renderProducts, findProductById } from './scripts/dom/render.js';
import { createProduct } from './scripts/api/create.js';
import { deleteProduct } from './scripts/api/delete.js';
import { updateProduct, patchProduct } from './scripts/api/update.js';

const apiUrl = 'http://localhost:8000/api/products';

// Referências do DOM
const form = document.getElementById('create-product-form');
const formError = document.getElementById('form-error');
const formTitle = document.getElementById('form-title');
const submitBtn = form.querySelector('button[type="submit"]');
const cancelBtn = document.getElementById('cancel-edit');
const productsSection = document.getElementById('products');

// Estado de edição
let editingId = null;
let originalProduct = null;

// --- Helpers de erro ---
function showError(message) {
    formError.textContent = message;
    formError.classList.remove('d-none');
}

function hideError() {
    formError.classList.add('d-none');
    formError.textContent = '';
}

// --- Helpers de edição ---
function getProductFromCard(button) {
    const card = button.closest('.product-card');
    return findProductById(Number(card.id));
}

function enterEditMode(product) {
    editingId = product.id;
    originalProduct = { ...product };
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-category').value = product.category;
    formTitle.textContent = 'Edit Product';
    submitBtn.textContent = 'Update';
    cancelBtn.style.display = '';
    document.getElementById('product-name').focus();
}

function exitEditMode() {
    editingId = null;
    originalProduct = null;
    formTitle.textContent = 'Add Product';
    submitBtn.textContent = 'Add';
    cancelBtn.style.display = 'none';
    form.reset();
}

cancelBtn.addEventListener('click', exitEditMode);

// --- Delegação de eventos nos cards ---
productsSection.addEventListener('click', async (event) => {
    const { target } = event;

    if (target.dataset.action === 'edit') {
        enterEditMode(getProductFromCard(target));
    }

    if (target.dataset.action === 'delete') {
        const product = getProductFromCard(target);
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await deleteProduct(apiUrl, product.id);
            if (editingId === product.id) exitEditMode();
            renderProducts(apiUrl);
        } catch (error) {
            showError(error.message);
        }
    }
});

// --- Submit: cria ou edita ---
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const stock = document.getElementById('product-stock').value;
    const category = document.getElementById('product-category').value;

    hideError();

    try {
        if (editingId !== null) {
            // MODO EDIÇÃO — descobre o que mudou
            const changed = {};
            if (name !== originalProduct.name) changed.name = name;
            if (Number(price) !== originalProduct.price) changed.price = price;
            if (Number(stock) !== originalProduct.stock) changed.stock = stock;
            if (category !== originalProduct.category) changed.category = category;

            if (Object.keys(changed).length === 0) {
                exitEditMode();
                return;
            }

            const allChanged = Object.keys(changed).length === 4;
            if (allChanged) {
                await updateProduct(apiUrl, editingId, { name, price, stock, category });
            } else {
                await patchProduct(apiUrl, editingId, changed);
            }
        } else {
            // MODO CRIAÇÃO
            await createProduct(apiUrl, { name, price, stock, category });
        }

        exitEditMode();
        renderProducts(apiUrl);
    } catch (error) {
        showError(error.message);
    }
});

// --- Primeira renderização ---
document.addEventListener('DOMContentLoaded', () => renderProducts(apiUrl));