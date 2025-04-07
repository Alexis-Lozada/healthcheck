FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias y tsconfig
COPY package*.json tsconfig.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente (incluye src/, .env, etc.)
COPY . .

# Compilar TypeScript a JavaScript
RUN npm run build

# Exponer el puerto del API Gateway
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
