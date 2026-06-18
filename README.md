# RestaurantERP Pro

RestaurantERP Pro is a complete Node.js, Express, MySQL, Socket.io, and vanilla JavaScript restaurant management system for a multi-cuisine family restaurant.

## Features

- JWT authentication with bcrypt password hashing
- Role-based dashboards for Admin, Manager, Waiter, Chef, Cashier, and Customer
- Responsive glassmorphism SaaS UI without React or frontend frameworks
- Menu browsing, cart, order placement, order tracking, and customer history
- Real-time order and kitchen status updates using Socket.io
- Table management for waiters
- Kitchen display system for chefs
- Billing, invoice lookup, and payment processing for cashiers
- Reservation requests and approval workflow
- Review submission and moderation
- Analytics cards and Chart.js charts
- MySQL schema with relationships, constraints, indexes, and foreign keys
- PM2 configuration for Ubuntu VPS deployment

## Folder Structure

```text
restaurant-erp/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    sockets/
    utils/
    server.js
  database/
    schema.sql
    seed.sql
  frontend/
    assets/
    css/
      styles.css
    js/
      api.js
      auth.js
      dashboard.js
      home.js
      login.js
    dashboard.html
    index.html
    login.html
  .env.example
  ecosystem.config.js
  package.json
  README.md
```

## Default Login Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@restaurant.com | Admin@123 |
| Manager | manager@restaurant.com | Manager@123 |
| Chef | chef@restaurant.com | Chef@123 |
| Cashier | cashier@restaurant.com | Cashier@123 |
| Waiter | waiter@restaurant.com | Waiter@123 |
| Customer | customer@restaurant.com | Customer@123 |

## Local Installation

1. Install Node.js 18 or newer and MySQL 8.
2. Create the environment file:

```bash
cp .env.example .env
```

3. Edit `.env` and set your MySQL credentials and a strong `JWT_SECRET`.
4. Install dependencies:

```bash
npm install
```

5. Import the database:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p restaurant_erp_pro < database/seed.sql
```

6. Start the application:

```bash
npm start
```

7. Open:

```text
http://localhost:3000
```

The login page is available at:

```text
http://localhost:3000/login.html
```

## Environment Variables

```env
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000
JWT_SECRET=change_this_to_a_long_random_secret_for_production
JWT_EXPIRES_IN=1d
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=restaurant_erp_pro
CORS_ORIGIN=http://localhost:3000
```

For production, set `NODE_ENV=production`, use a long random `JWT_SECRET`, and set `CORS_ORIGIN` to your domain.

## Ubuntu VPS Deployment

1. Update the server:

```bash
sudo apt update && sudo apt upgrade -y
```

2. Install Node.js, MySQL, Nginx, and PM2:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs mysql-server nginx
sudo npm install -g pm2
```

3. Upload or clone the project to the VPS:

```bash
cd /var/www
sudo mkdir -p restaurant-erp-pro
sudo chown $USER:$USER restaurant-erp-pro
cd restaurant-erp-pro
```

4. Install app dependencies:

```bash
npm install --production
```

5. Configure MySQL:

```bash
sudo mysql
CREATE USER 'restaurant_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON restaurant_erp_pro.* TO 'restaurant_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

6. Import schema and seed data:

```bash
mysql -u restaurant_user -p < database/schema.sql
mysql -u restaurant_user -p restaurant_erp_pro < database/seed.sql
```

7. Create `.env`:

```bash
cp .env.example .env
nano .env
```

8. Start with PM2:

```bash
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

9. Optional Nginx reverse proxy:

```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Enable the site and reload Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/restaurant-erp-pro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Production Commands

```bash
pm2 status
pm2 logs restaurant-erp-pro
pm2 restart restaurant-erp-pro
pm2 stop restaurant-erp-pro
```

## API Modules

- `/api/auth`
- `/api/users`
- `/api/menu`
- `/api/tables`
- `/api/reservations`
- `/api/orders`
- `/api/payments`
- `/api/reviews`
- `/api/analytics`

## Security Notes

The application uses prepared MySQL statements through `mysql2`, JWT protected routes, bcrypt password hashes, input validation with `express-validator`, Helmet security headers, CORS configuration, and rate limiting.
