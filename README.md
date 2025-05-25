# Food Delivery Application Installation Guide

This guide provides detailed instructions for setting up both the development environment (for developers) and the running environment (for deployment).

## Development Environment Setup (Host)

### Prerequisites
- Node.js (v16.x or higher)
- npm (v8.x or higher)
- Git
- PostgreSQL (v14.x or higher)

### Step 1: Clone the Repository
```bash
git clone https://github.com/PTHoang123/CNPM.git
cd food-delivery
```

### Step 2: Frontend Setup
1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm start
```
The frontend will be available at `http://localhost:3000`

### Step 3: Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=food_delivery
DB_USER=your_username
DB_PASSWORD=your_password
```

4. Set up the database:
```bash
# Create the database
psql -U postgres
CREATE DATABASE food_delivery;
\q

# Run migrations (if using migrations)
npm run migrate
```

5. Start the backend server:
```bash
npm run dev
```

### Development Tools
- VS Code Extensions:
- ESLint
- Prettier
- React Developer Tools


## Running Environment Setup (Target)

### Prerequisites
- Node.js (v16.x or higher)
- PostgreSQL (v14.x or higher)
- PM2 (for process management)
- Nginx (for reverse proxy)

### Step 1: System Preparation
```bash
# Update system packages
sudo apt update
sudo apt upgrade

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx
```

### Step 2: Database Setup
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE food_delivery;
CREATE USER food_delivery_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE food_delivery TO food_delivery_user;
\q
```

### Step 3: Application Deployment
1. Clone the repository:
```bash
git clone https://github.com/yourusername/food-delivery.git
cd food-delivery
```

2. Frontend build:
```bash
# Install dependencies
npm install

# Create production build
npm run build
```

3. Backend setup:
```bash
cd backend
npm install
```
4. Environment Configuration:
Create `/etc/food-delivery/.env`:
```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=food_delivery
DB_USER=food_delivery_user
DB_PASSWORD=your_secure_password
```

## 5. Frontend Configuration

1. Update the frontend environment file (`.env`):
```env
REACT_APP_API_URL=http://192.168.1.8:5000
```

2. Build the frontend:
```bash
npm run build
```

## 6. Backend Configuration

1. Update the backend environment file (`backend/.env`):
```env
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=food_delivery
DB_USER=food_delivery_user
DB_PASSWORD=your_secure_password
```

2. Start the backend with PM2:
```bash
cd backend
pm2 start npm --name "food-delivery-api" -- start
```

## 7. Nginx Configuration

1. Create Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/food-delivery
```

2. Add the following configuration:
```nginx
server {
    listen 80;
    server_name 192.168.1.8;  # Your IP address

    # Frontend
    location / {
        root /path/to/food-delivery/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Enable CORS
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE';
    add_header 'Access-Control-Allow-Headers' 'X-Requested-With,Content-Type,Authorization';
}
```

3. Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/food-delivery /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 8. Firewall Configuration (if enabled)

Allow necessary ports:
```bash
sudo ufw allow 80    # HTTP
sudo ufw allow 5000  # Backend API
sudo ufw allow 5432  # PostgreSQL (if needed)
```

## 9. Testing the Deployment

1. Frontend should be accessible at:
   ```
   http://192.168.1.8
   ```

2. Backend API should be accessible at:
   ```
   http://192.168.1.8:5000
   ```

## Important Notes

1. **Local Network Access**:
   - This setup will only work within your local network
   - Other devices in the same network can access using your IP
   - For external access, you'll need:
    - Public IP address
    - Port forwarding on your router
    - Or a domain name with DNS configuration

2. **Security Considerations**:
   - IP-based access is less secure than domain-based
   - Consider implementing:
     - Strong authentication
     - Rate limiting
     - IP whitelisting
     - HTTPS (even for local network)

3. **IP Address Changes**:
   - If your router assigns IP dynamically, the address might change
   - Consider:
     - Setting a static IP in your router
     - Using local DNS
     - Or using hostname instead of IP

4. **Development Testing**:
   To test from other devices during development:
   ```bash
   # Frontend
   REACT_APP_API_URL=http://192.168.1.8:5000 npm start

   # Backend
   cd backend
   PORT=5000 npm run dev
   ```
