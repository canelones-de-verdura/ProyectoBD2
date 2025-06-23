# API para el proyecto

## GET
#### /api/elecciones/
- Devuelve las elecciones (con todos los campos, son 3 nomás)

#### /api/elecciones/{idEleccion}/circuitos
- Devuelve los circuitos de una elección determinada. No devuelve toda la info de cada circuito, solo info básica y una URL para acceder al recuso completo.
- **Pseudo-json:**
```json
{
  "data": [
    {
      "numero": XX,
      "estado": "abierto"|"cerrado",
      "url": "/api/elecciones/X/circuitos/XX"
    },
    {
      ...
    },
    ...
  ]
}
```

#### /api/elecciones/{idEleccion}/circuitos/{numero}
- Devuelve un circuito específico, con toda su información. Además, incluye otra info relacionada (?).
- **Pseudo-json:**
```json
{
  "numero": XX,
  "idEleccion": X,
  ...,
}
```
**TODO: mandar establecimiento con circuito? así ahorramos pegadas a la api**

**TODO: mandar mesa con circuito? no tiene sentido poner una URI para listar mesas, si es una sola x circuito**

#### /api/votantes/
- Devuelve todos los votantes, con info básica.
- Devuelve URL para acceder al recurso
- **Pseudo-json:**
```json
{
  "data": [
    {
      "ci": XXXXXXXX,
      "nombreCompleto": "XXXXX XXXXX",
      "credencial": "AAA XXXXX",
      "url": "/api/votantes/XXXXXXXX/"
    }
    ...
  ]
}
```

#### /api/votantes/{ci}/
- Devuelve un votante + toda la info relacionada (incluyendo tabla VotanteVota) (mínimo *overhead*, en toda su vida una persona participa de 15 elecciones como mucho).
- **Pseudo-json:**
```json
{
  "ci": XXXXXXXX,
  "nombreCompleto": "XXXXX XXXXX",
  "credencial": "AAA XXXXX",
  "fechaNacimiento": "XX/XX/XXXX",
  "vota": [
    {
      "idEleccion": X,
      "circuito": XX,
      "observado": true|false
    },
    ...
  ]
}
```

#### /api/candidatos/
- Devuelve todos los candidatos.
- Tablas Candidato + Votante + CandidatoParticipa
- **Pseudo-json:**
```json
{
  "data": [
    {
      "ci":,
      "nombreCompleto":,
      "nombrePartido":,
      "participa": [X, Y, Z],
      "infoPartido":
      "infoPersonal":
    },
    ...
  ]
}
```
