# ProyectoBD2

Proyecto para Bases de Datos 2

### .env

El proyecto necesita de un .env (en la raíz del proyecto) con las credenciales de la base de datos.

```
# agregar acá
DB_USER=
DB_PASS=
DB_NAME=
DB_HOST=
DB_PORT=

# dejar como está (o no, no tendría que cambiar nada...)
JWT_SECRET=napolitanaconfritas

# algunas horas de ejemplo
# descomentar para probar abrir y cerrar circuitos
#HORA=06:00:00 # no deja abrir
#HORA=16:45:00 # deja abrir, no deja cerrar
HORA=19:30:00 # deja abrir y cerrar
```

### docker

- El proyecto usa docker compose para crear dos imágenes y levantar los contenedores
- Cada contenedor copia la parte del monorepo que le sirve y la ejecuta
- `$ docker-compose up --build`
- El front queda en `http://localhost:5173/`

---

### Instalar

- node
- pnpm

### Para levantar las cosas

- `pnpm install`
- `pnpm --filter backend dev` para levantar el backend

### Para instalar paquetes

- `pnpm --filter [frontend o  backend] add -D [paquete]` para instalar en un proyecto específico
- `pnpm -D -w [paquete]` para instalar en todo el proyecto
