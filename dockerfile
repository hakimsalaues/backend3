# Usa la imagen oficial de Node.js
FROM node:18-alpine

# Crea y usa el directorio /app
WORKDIR /app

# Copia package.json y package-lock.json para aprovechar la cache de Docker
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de tu código al contenedor
COPY . .

# Expone el puerto en el que corre tu app
EXPOSE 3000

# Comando por defecto para iniciar tu servidor
CMD ["npm", "run", "dev"]
