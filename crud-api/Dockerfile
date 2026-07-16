FROM php:8.3-cli

WORKDIR /app

# 1. Instala a dependência do SQLite e o driver do PHP (antes de copiar o código para aproveitar o cache)
RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    && docker-php-ext-install pdo_sqlite \
    && rm -rf /var/lib/apt/lists/*

# 2. Copia os arquivos do projeto
COPY src/ src/
COPY data/ data/

# 3. Ajusta as permissões do banco/dados
RUN chmod -R 777 data/

EXPOSE 80

CMD ["php", "-S", "0.0.0.0:80", "-t", "src/public", "src/public/index.php"]