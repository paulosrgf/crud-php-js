<?php

function validateRequiredFields(array $input, array $fields): ?string
{
    $missing = [];

    foreach ($fields as $field) {
        if (!isset($input[$field])) {
            $missing[] = $field;
        }
    }

    if (!empty($missing)) {
        return implode(', ', $missing) . ' are required';
    }

    return null;
}

function validateProductFields(array $input): ?string
{
    if (isset($input['name'])) {
        $name = trim($input['name']);

        if ($name === '') {
            return 'Name cannot be empty';
        }

        if (strlen($name) > 100) {
            return 'Name must be at most 100 characters';
        }
    }

    if (isset($input['price'])) {
        if (!is_numeric($input['price'])) {
            return 'Price must be a number';
        }

        if ((float) $input['price'] <= 0) {
            return 'Price must be greater than 0';
        }
    }

    if (isset($input['stock'])) {
        if (!is_numeric($input['stock'])) {
            return 'Stock must be a number';
        }

        if ((int) $input['stock'] < 0) {
            return 'Stock cannot be negative';
        }
    }

    if (isset($input['category'])) {
        $category = trim($input['category']);

        if ($category === '') {
            return 'Category cannot be empty';
        }

        if (strlen($category) > 50) {
            return 'Category must be at most 50 characters';
        }
    }

    return null;
}