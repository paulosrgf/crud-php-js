import { renderProducts, findProductById } from './scripts/dom/render.js';
import { createProduct } from './scripts/api/create.js';
import { deleteProduct } from './scripts/api/delete.js';
import { updateProduct, patchProduct } from './scripts/api/update.js';

const apiUrl = 'http://localhost:8000/api/products';

// Referências do DOM — form principal
const form = document.getElementById('create-product-form');
const formError = document.getElementById('form-error');
const formTitle = document.getElementById('form-title');
const submitBtn = form.querySelector('button[type="submit"]');
const cancelBtn = document.getElementById('cancel-edit');
const productsSection = document.getElementById('products');

// Referências do DOM — busca
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');

// Referências do DOM — modal de exclusão
const deleteModalEl = document.getElementById('delete-modal');
const deleteModal = new bootstrap.Modal(deleteModalEl);
const deleteModalProductName = document.getElementById('delete-modal-product-name');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

// Estado de edição
let editingId = null;
let originalProduct = null;

// Mantém o termo de busca atual, pra não perder o filtro após create/update/delete
let currentSearch = '';

// Produto aguardando confirmação de exclusão no modal
let pendingDeleteId = null;

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

// --- Busca por query string ---
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    currentSearch = searchInput.value.trim();
    renderProducts(apiUrl, currentSearch);
});

clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    currentSearch = '';
    renderProducts(apiUrl, currentSearch);
});

// --- Delegação de eventos nos cards ---
productsSection.addEventListener('click', (event) => {
    const { target } = event;

    if (target.dataset.action === 'edit') {
        enterEditMode(getProductFromCard(target));
    }

    if (target.dataset.action === 'delete') {
        const product = getProductFromCard(target);
        pendingDeleteId = product.id;
        deleteModalProductName.textContent = product.name;
        deleteModal.show();
    }
});

// --- Confirmação de exclusão vinda do modal ---
confirmDeleteBtn.addEventListener('click', async () => {
    if (pendingDeleteId === null) return;

    try {
        await deleteProduct(apiUrl, pendingDeleteId);
        if (editingId === pendingDeleteId) exitEditMode();
        deleteModal.hide();
        renderProducts(apiUrl, currentSearch);
    } catch (error) {
        deleteModal.hide();
        showError(error.message);
    } finally {
        pendingDeleteId = null;
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
            await createProduct(apiUrl, { name, price, stock, category });
        }

        exitEditMode();
        renderProducts(apiUrl, currentSearch);
    } catch (error) {
        showError(error.message);
    }
});

// --- Primeira renderização ---
document.addEventListener('DOMContentLoaded', () => renderProducts(apiUrl));