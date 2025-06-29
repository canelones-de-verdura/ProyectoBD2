# ProyectoBD2
Proyecto para Bases de Datos 2

### docker
- El proyecto usa docker compose para crear dos imágenes y levantar los contenedores
- Cada contenedor copia la parte del monorepo que le sirve, luego la compila y ejecuta
- ```$ docker-compose up --build```
- El front queda en ```http://localhost:5173/```

---

### Instalar
- node
- pnpm

### Para levantar las cosas
- ```pnpm install```
- ```pnpm --filter backend build``` para compilar
- ```pnpm --filter backend dev``` para levantar el backend

### Para instalar paquetes
- ```pnpm --filter [frontend o  backend] add -D [paquete]``` para instalar en un proyecto específico
- ```pnpm -D -w [paquete]``` para instalar en todo el proyecto
