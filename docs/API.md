# API para el proyecto (Completa)

En la medida de lo posible, se intenta "desnormalizar" la información. O sea, un endpoint puede resultar en varias consultas en la base de datos y se devuelve la información junta. La idea es simplificar el contrato de la API y reducir la cantidad de requests por parte del front.

Todos los endpoints, menos la autenticación y los resultados de las elecciones, necesitan el JWT.

### Departamentos

#### `GET /api/departamentos`
- Devuelve una lista con los 19 departamentos.

```jsonc
{
  "data": [
    {
      "numero": 1,
      "nombre": "montevideo"
    },
    //...
  ]
}
```

#### `GET /api/departamentos/{numero}`
- Devuelve un departamento específico.

```jsonc
{
  "numero": 1,
  "nombre": "montevideo"
}
```

#### `GET /api/departamentos/{numero}/establecimientos`
- Devuelve todos los establecimientos de un departamento.

```jsonc
{
  "data": [
    {
      "id": 123,
      "nombre": "Establecimiento A",
      "tipo": "Escuela",
      "direccion": {
        "calle": "Calle Falsa",
        "numero": "123",
        "ciudad": "Montevideo",
        "pueblo": null,
        "paraje": null
      },
      "url": "/api/establecimientos/123"
    }
    // ...
  ]
}
```

---

### Elecciones

#### `GET /api/elecciones`
- Devuelve todas las elecciones.

```jsonc
{
  "data": [
    {
      "id": 1,
      "tipo": "Nacional",
      "fecha": "2024-10-27"
    },
    // ...
  ]
}
```

#### `GET /api/elecciones/{idEleccion}`
- Devuelve una elección específica.

```jsonc
{
  "id": 1,
  "tipo": "Nacional",
  "fecha": "2024-10-27"
}
```

#### `GET /api/elecciones/{idEleccion}/circuitos`
- Devuelve los circuitos de una elección determinada. Solo info básica y una URL para acceder al recurso completo.

```jsonc
{
  "data": [
    {
      "numero": 1,
      "estado": "abierto", // o cerrado
      "url": "/api/elecciones/1/circuitos/1"
    },
    // ...
  ]
}
```

#### `GET /api/elecciones/{idEleccion}/circuitos/{numero}`
- Devuelve un circuito específico, con toda su información, incluyendo el establecimiento y la mesa correspondiente.

```jsonc
{
  "numero": 1,
  "idEleccion": 1,
  "esAccesible": true,
  "horaInicio": "08:00:00",
  "horaCierre": "19:30:00",
  "rangoInicioCred": "00000",
  "rangoFinCred": "99999",
  "serie": "AAA",
  "estado": "abierto",
  "establecimiento": {
    "id": 123,
    "nombre": "Establecimiento A",
    "tipo": "Escuela",
    "departamento": {
      "numero": 1,
      "nombre": "montevideo"
    },
    "direccion": {
      "calle": "Calle Falsa",
      "numero": "123",
      "ciudad": "Montevideo",
      "pueblo": null,
      "paraje": null
    }
  },
  // OPCIONAL- A VER SI APORTA
  "mesa": {
    "numero": 1,
    "presidente": { "ci": 12345678, "nombreCompleto": "Presidente Mesa" },
    "secretario": { "ci": 87654321, "nombreCompleto": "Secretario Mesa" },
    "vocal": { "ci": 11223344, "nombreCompleto": "Vocal Mesa" }
  }
}
```

#### `GET /api/elecciones/{idEleccion}/circuitos/{numero}/resultados`
- Devuelve los resultados de una elección para un circuito específico, con votos por fórmula.

```jsonc
{
  "idEleccion": 1,
  "numeroCircuito": 1,
  "votos": {
    "total": 350,
    "validos": 340,
    "blanco": 5,
    "anulado": 5,
    "porFormula": [
      {
        "partido": {
          "nombre": "Partido A",
          "url": "/api/partidos/Partido%20A"
        },
        // -------------------------
        // CAPAZ QUE NO, DE NUEVO
        "presidente": {
          "ci": 12345678,
          "nombreCompleto": "Candidato A Presidente",
          "url": "/api/candidatos/12345678"
        },
        "vicepresidente": {
          "ci": 87654321,
          "nombreCompleto": "Candidato A Vicepresidente",
          "url": "/api/candidatos/87654321"
        },
        // -------------------------
        "votos": 150
      }
      // ...
    ]
  }
}
```

#### `POST /api/elecciones/{idEleccion}/circuitos/{numero}/abrir`
- Abre un circuito electoral. Devuelve un error si se intenta cerrar antes de la `horaInicio` especificada.
**Success Response (200 OK):**
- Devuelve el objeto del circuito actualizado con el estado "abrir".
```jsonc
{
  "numero": 1,
  "idEleccion": 1,
  "estado": "abierto",
  "url": "/api/elecciones/1/circuitos/1"
}
```

#### `POST /api/elecciones/{idEleccion}/circuitos/{numero}/cerrar`
- Cierra un circuito electoral. Devuelve un error si se intenta cerrar antes de la `horaCierre` especificada.

**Success Response (200 OK):**
- Devuelve el objeto del circuito actualizado con el estado "cerrado".
```jsonc
{
  "numero": 1,
  "idEleccion": 1,
  "estado": "cerrado",
  "url": "/api/elecciones/1/circuitos/1"
}
```

**Error Response (409 Conflict):**
```jsonc
{
  "error": "El circuito no puede ser cerrado antes de las 19:30:00."
}
```

#### `POST /api/elecciones/{idEleccion}/circuitos/{numero}/votar`
- Registra la constancia de voto para un ciudadano y el voto emitido. Esto corresponde a una inserción en las tablas `VotanteVota`, `Voto` y `Valido` (si corresponde). Si el votante no pertenece a este circuito, el voto debe ser marcado como `observado`.

**Request Body:**
```jsonc
{
  "ciVotante": 12345678,
  "observado": false,
  "voto": {
    "tipo": "Valido", // "Valido", "Blanco" o "Anulado"
    "nombrePartido": "Partido A" // Opcional. Solo si el tipo es "Valido".
  }
}
```

**Success Response (201 Created):**
- Devuelve los registros creados.
```jsonc
{
  "ciVotante": 12345678,
  "idEleccion": 1,
  "observado": false,
  "numCircuito": 1
}
```

**Error Response (409 Conflict):**
```jsonc
{
  "error": "El votante con CI 12345678 ya ha votado en esta elección."
}
```

**Error Response (404 Not Found):**
```jsonc
{
  "error": "El votante con CI 12345678 no fue encontrado."
}
```

#### `GET /api/elecciones/{idEleccion}/votos-observados`
- Devuelve una lista de todas las constancias de voto marcadas como observadas para una elección específica.

**Success Response (200 OK):**
```jsonc
{
  "data": [
    {
      "ciVotante": 87654321,
      "idEleccion": 1,
      "observado": true,
      "numCircuito": 5
    }
    // ...
  ]
}
```

#### `POST /api/elecciones/{idEleccion}/votos-observados/{ciVotante}`
- Confirma o anula un voto observado. La acción se especifica en el cuerpo de la solicitud.

**Request Body:**
```jsonc
{
  "accion": "confirmar" // "confirmar" o "anular"
}
```

**Success Response (200 OK):**
```jsonc
{
  "mensaje": "El voto observado del votante con CI 87654321 ha sido confirmado."
}
```

**Error Response (404 Not Found):**
```jsonc
{
  "error": "No se encontró un voto observado para el votante con CI 87654321 en esta elección."
}
```

**Error Response (400 Bad Request):**
```jsonc
{
  "error": "La acción especificada no es válida. Use 'confirmar' o 'anular'."
}
```

**Error Response (409 Conflict):**
```jsonc
{
  "error": "La elección ya ha finalizado y no se pueden procesar más votos observados."
}
```

#### `GET /api/elecciones/{idEleccion}/resultados`
- Devuelve los resultados de una elección, con votos por fórmula. Se pueden filtrar por departamento.

**Query Parameters:**
- `departamento` (opcional): Número del departamento para filtrar los resultados.

```jsonc
{
  "idEleccion": 1,
  "votos": {
    "total": 15000,
    "validos": 14500,
    "blanco": 300,
    "anulado": 200,
    "porFormula": [
      {
        "partido": {
          "nombre": "Partido A",
          "url": "/api/partidos/Partido%20A"
        },
        //------------------------
        // ESTO NO SERÍA NECESARIO
        "presidente": {
          "ci": 12345678,
          "nombreCompleto": "Candidato A Presidente",
          "url": "/api/candidatos/12345678"
        },
        "vicepresidente": {
          "ci": 87654321,
          "nombreCompleto": "Candidato A Vicepresidente",
          "url": "/api/candidatos/87654321"
        },
        //------------------------
        "votos": 5000
      }
      // ...
    ]
  }
}
```

---

### Votantes

#### `GET /api/votantes`
- Devuelve todos los votantes, con info básica y URL para acceder al recurso.

```jsonc
{
  "data": [
    {
      "ci": 12345678,
      "nombreCompleto": "Juan Perez",
      "credencial": "AAA 1234",
      "url": "/api/votantes/12345678"
    }
    // ...
  ]
}
```

#### `GET /api/votantes/{ci}`
- Devuelve un votante + toda la info relacionada (incluyendo tabla VotanteVota).

```jsonc
{
  "ci": 12345678,
  "nombreCompleto": "Juan Perez",
  "credencial": "AAA 1234",
  "fechaNacimiento": "1990-01-15",
  "votaEn": [
    {
      "idEleccion": 1,
      "numCircuito": 1,
      "observado": false
    },
    // ...
  ]
}
```

---

### Partidos

#### `GET /api/partidos`
- Devuelve todos los partidos.

```jsonc
{
  "data": [
    {
      "nombre": "Partido A",
      "url": "/api/partidos/Partido%20A"
    },
    // ...
  ]
}
```

#### `GET /api/partidos/{nombre}`
- Devuelve un partido específico con sus candidatos principales.

```jsonc
{
  "nombre": "Partido A",
  "presidente": "Presidente Partido",
  "vicepresidente": "Vicepresidente Partido",
  "numero": 10,
  "calle": "Calle del Partido",
  "candidatos": [
      {
          "ci": 12345678,
          "nombreCompleto": "Candidato A",
          "candidatura": "Presidente",
          "idEleccion": 1
      }
      // ...
  ]
}
```

---

### Establecimientos

#### `GET /api/establecimientos/{id}`
- Devuelve un establecimiento específico con su dirección.

```jsonc
{
  "id": 123,
  "nombre": "Establecimiento A",
  "tipo": "Escuela",
  "departamento": {
    "numero": 1,
    "nombre": "Montevideo"
  },
  "direccion": {
    "calle": "Calle Falsa",
    "numero": "123",
    "ciudad": "Montevideo",
    "pueblo": null,
    "paraje": null
  }
}
```

---

### Autenticación

#### `POST /api/auth/login`
- Autentica a un presidente de mesa y devuelve un JWT junto con la información de su circuito.
- El payload almacena la cédula del presidente de mesa, el id de la elección y el circuito que le corresponde. Usa esta info para autenticar las rutas.

**Request Body:**
```jsonc
{
  "ci": 12345678,
  "credencial": "AAA 12345"
}
```

**Success Response (200 OK):**
```jsonc
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikp1YW4gUGVyZXoiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "circuito": {
    "numero": 1,
    "idEleccion": 1,
    "url": "/api/elecciones/1/circuitos/1"
  }
}
```

**Error Response (401 Unauthorized):**
```jsonc
{
  "error": "Credenciales inválidas o no es presidente de mesa activo."
}
```
