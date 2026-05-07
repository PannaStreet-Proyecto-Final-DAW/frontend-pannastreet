# Informe Técnico: Estandarización de APIs y Formatos de Datos (Versión Final)

Este informe detalla los requisitos definitivos de estructura JSON para los endpoints del sistema, con el fin de unificar el consumo de datos entre el Backend y el Frontend.

---

## 1. Entidad: PLAYER (Jugador)
**Requerimiento:** Estructura plana para uso directo en la lógica del juego.

| Atributo Actual (Backend) | Atributo Deseado (Respuesta API) | Acción |
| :--- | :--- | :--- |
| `id` | `id` | Mantener |
| `name` | `name` | Mantener |
| `age` | `age` | Mantener |
| `tier` | `tier` | Mantener |
| `team.name` | **`team`** | String (Nombre del equipo) |
| `country.name` | **`nationality`** | String (Nombre del país) |
| `position` | **`position`** | **Array<String> completo** |
| `generalPosition` | **`generalPosition`** | Enum (GK, DEFENDER, MIDFIELDER, FORWARD) |

---

## 2. Entidad: TEAM (Equipo)
**Requerimiento:** Incluir nombres de las relaciones de forma plana y el escudo.

| Atributo Actual (Backend) | Atributo Deseado (Respuesta API) | Acción |
| :--- | :--- | :--- |
| `id` | `id` | Mantener |
| `name` | `name` | Mantener |
| `tier` | `tier` | Mantener |
| `pictureUrl` | **`pictureUrl`** | String (URL del escudo del equipo) |
| `league.name` | **`league`** | String (Nombre de la liga a la que pertenece) |
| `league.country.name` | **`country`** | String (Nombre del país al que pertenece vía liga) |

---

## 3. Entidad: COUNTRY (País)
**Requerimiento:** Datos completos de competitividad y URL de imagen original.

| Atributo Actual (Backend) | Atributo Deseado (Respuesta API) | Acción |
| :--- | :--- | :--- |
| `id` | `id` | Mantener |
| `name` | `name` | Mantener |
| `tierMale` | `tierMale` | Mantener |
| `tierFemale` | `tierFemale` | Mantener |
| `pictureUrl` | **`pictureUrl`** | String (URL original de la imagen/bandera) |

---

## 4. Entidad: LEAGUE (Liga Real)
**Requerimiento:** Estructura plana con categoría de género.

| Atributo Actual (Backend) | Atributo Deseado (Respuesta API) | Acción |
| :--- | :--- | :--- |
| `id` | `id` | Mantener |
| `name` | `name` | Mantener |
| `category` | **`category`** | Enum ("male" o "female") |
| `country.name` | **`country`** | **String (Solo el nombre del país)** |

---

## 5. Entidad: FORMATION (Alineación)
**Requerimiento:** Estructura plana y simple.

| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único |
| `name` | String | Nombre (ej. "4-3-3") |
| `goalkeeper` | String | Posición única (ej. "GK") |
| `defenders` | Array<String> | Lista de posiciones (ej. ["LB", "CB", "CB", "RB"]) |
| `midfielders` | Array<String> | Lista de posiciones (ej. ["LM", "CM", "CM", "RM"]) |
| `forwards` | Array<String> | Lista de posiciones (ej. ["ST", "LW", "RW"]) |

---

## Notas de Implementación
*   Se solicita que estas transformaciones se realicen en la capa de **Controladores** del Backend mediante un Mapper o Presenter.
*   El objetivo es eliminar la necesidad de procesamiento de datos anidados en el Frontend.

---
