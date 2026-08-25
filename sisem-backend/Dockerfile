FROM php:8.2-cli

# Dépendances système + extensions PHP nécessaires à Laravel + PostgreSQL
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libonig-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring zip

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copie les fichiers du projet
COPY . .

# Installe les dépendances PHP (sans les dev, optimisé)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Permissions pour Laravel
RUN chmod -R 775 storage bootstrap/cache

# Render fournit le port via la variable $PORT
EXPOSE 10000

# Au démarrage : cache la config, migre, puis lance le serveur
CMD php artisan config:cache && \
    php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=${PORT:-10000}