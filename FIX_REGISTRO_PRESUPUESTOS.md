# FIX — REGISTRO DE PRESUPUESTOS EN DIDIAL_Base_OT

**Problema detectado:** El formulario capturaba "¿Solicitó presupuesto?", "N° Presupuesto" y "¿Aprueba?" en pantalla, pero esos datos **nunca se enviaban** a Google Sheets. El objeto `data` no los incluía y los campos del formulario no tenían identificadores para leerlos.

**Solución:** Corregido en 2 puntas (formulario + Apps Script). Sigue las instrucciones abajo.

---

# CAUSA RAÍZ (para que entiendas qué pasó)

El sistema tiene dos partes que deben estar sincronizadas:

```
FORMULARIO (index.html)          APPS SCRIPT (Google)
  captura datos          →         escribe en Sheet
  objeto "data"          →         array "row"
```

El problema era que los datos de presupuesto:
1. Se mostraban en pantalla (botones Sí/No, campo número)
2. **PERO** los botones no guardaban el valor en ningún lado legible
3. **Y** el objeto `data` que se envía no tenía campos de presupuesto

Resultado: los datos se "perdían" en pantalla, nunca viajaban a la Sheet.

---

# QUÉ SE CORRIGIÓ EN EL FORMULARIO

Ya está corregido en los archivos `index.html` y `service-worker.js` que descargarás. Los cambios:

1. **Cada presupuesto ahora tiene campos con ID único** (`_solicito`, `_numero`, `_aprueba`)
2. **Los botones Sí/No guardan su valor** en un campo oculto legible
3. **Se agregó la recolección** de todos los presupuestos al enviar
4. **El objeto `data` ahora incluye 4 campos nuevos:**
   - `presupSolicito` → "Sí" / "No" (si solicitó al menos un presupuesto)
   - `presupNumero` → números de presupuesto (separados por "; " si hay varios)
   - `presupAprueba` → "Sí" / "No" (si aprobó)
   - `presupDetalle` → detalle completo de cada presupuesto

---

# QUÉ DEBES HACER TÚ

## PARTE 1: Actualizar el formulario (GitHub)

1. Descarga los 2 archivos nuevos:
   - `index.html`
   - `service-worker.js` (subido a v5.4)

2. Súbelos a GitHub (`github.com/davidveralp/didial-ot`):
   - "Add file" → "Upload files"
   - Arrastra ambos
   - "Commit changes"

3. Espera 1 minuto, abre la app con **Ctrl+Shift+R**

---

## PARTE 2: Actualizar el Apps Script (CRÍTICO)

Sin este paso, los datos siguen sin guardarse. El Apps Script debe recibir los 4 campos nuevos.

### Paso 1: Abre tu Apps Script
Google Sheet → Extensiones → Apps Script

### Paso 2: Busca el array `row`

Dentro de la función `doPost`, busca el final del array `row`, que termina así:

```javascript
      data.nroDocumento        || "",  // AG - N° Documento
      data.sucursal            || "",  // AH - Sucursal
      data.asesorEmail         || "",  // AI - Email Asesor
      data.encuestaAplica      || "",  // AJ - Encuesta Aplica
      data.encP1Tiempo         || "",  // AK
      data.encP2Atencion       || "",  // AL
      data.encP3Servicio       || "",  // AM
      data.encP4Recomienda     || "",  // AN
      data.encConocio          || "",  // AO
    ];
```

### Paso 3: Reemplaza el array completo

**Reemplaza TODO el array `row`** por esta versión (incluye los presupuestos en AP-AS, después de la encuesta):

```javascript
    const row = [
      data.nroOT               || "",  // A  - N° Orden Trabajo
      data.fechaIngreso        || "",  // B  - F. Ingreso
      "",                              // C  - Mes Ingreso (fórmula)
      "",                              // D  - Año Ingreso (fórmula)
      data.patente             || "",  // E  - Patente
      data.marca               || "",  // F  - Marca
      data.modelo              || "",  // G  - Modelo
      data.cilindrada          || "",  // H  - Cilindrada
      data.anio                || "",  // I  - Año
      data.km                  || "",  // J  - Kilometraje
      data.tipoCliente         || "",  // K  - Tipo Cliente
      data.propietario         || "",  // L  - Propietario
      data.telefono            || "",  // M  - Teléfono
      data.email               || "",  // N  - E-Mail
      data.ciudad              || "",  // O  - Ciudad
      data.asesor              || "",  // P  - Asesor de Servicio
      data.tipoIngreso         || "",  // Q  - Tipo de Ingreso
      data.tecnicoPrincipal    || "",  // R  - Técnico Principal
      data.tecnicosSecundarios || "",  // S  - Técnicos Secundarios
      data.montoRepuestos      || 0,   // T  - Monto Repuestos
      data.montoLubricantes    || 0,   // U  - Monto Lubricantes
      data.montoMO             || 0,   // V  - Monto Mano de Obra
      data.montoServicioExterno|| 0,   // W  - Monto Servicio Externo
      data.descServicioExterno || "",  // X  - Desc Servicio Externo
      data.descuento           || 0,   // Y  - Descuento
      data.totalReparacion     || 0,   // Z  - Total Reparación
      data.tipoServicio1       || "",  // AA - Tipo Servicio 1
      data.tipoServicio2       || "",  // AB - Tipo Servicio 2
      data.unidadesNegocio     || "",  // AC - Unidades de Negocio
      data.estadoVehiculo      || "",  // AD - Estado Vehículo
      data.fechaEntrega        || "",  // AE - Fecha Entrega
      data.tipoDocumento       || "",  // AF - Tipo Documento
      data.nroDocumento        || "",  // AG - N° Documento
      data.sucursal            || "",  // AH - Sucursal
      data.asesorEmail         || "",  // AI - Email Asesor
      data.encuestaAplica      || "",  // AJ - Encuesta Aplica
      data.encP1Tiempo         || "",  // AK - Enc. P1 Entrega a tiempo
      data.encP2Atencion       || "",  // AL - Enc. P2 Atención cliente
      data.encP3Servicio       || "",  // AM - Enc. P3 Servicio mecánico
      data.encP4Recomienda     || "",  // AN - Enc. P4 Recomendaría
      data.encConocio          || "",  // AO - Enc. Cómo conoció DIDIAL
      data.presupSolicito      || "",  // AP - ¿Solicitó presupuesto?
      data.presupNumero        || "",  // AQ - N° Presupuesto(s)
      data.presupAprueba       || "",  // AR - ¿Aprobó presupuesto?
      data.presupDetalle       || "",  // AS - Detalle presupuestos
    ];
```

### Paso 4: Guardar y desplegar

1. Clic **Guardar** (Ctrl+S)
2. **Implementar** → **Gestionar implementaciones** → ✏️ Editar
3. **Nueva versión** → **Implementar**

---

## PARTE 3: Agregar los encabezados en Google Sheets

El script ahora escribe en columnas AP-AS, pero necesitan título.

### En tu Google Sheet, en la fila 1:

| Celda | Escribe |
|---|---|
| **AP1** | `¿Solicitó Presupuesto?` |
| **AQ1** | `N° Presupuesto` |
| **AR1** | `¿Aprobó Presupuesto?` |
| **AS1** | `Detalle Presupuestos` |

**Cómo llegar a AP1 rápido:**
- En Google Sheets, en la casilla de nombre (arriba izquierda, donde dice "A1"), escribe `AP1` y Enter
- Te lleva directo a esa celda

---

# CÓMO QUEDAN LOS DATOS

## Ejemplo: Una OT con 1 presupuesto solicitado y aprobado

| Columna | Encabezado | Valor |
|---|---|---|
| AP | ¿Solicitó Presupuesto? | Sí |
| AQ | N° Presupuesto | 4521 |
| AR | ¿Aprobó Presupuesto? | Sí |
| AS | Detalle Presupuestos | P1: solicitó=Sí, N°=4521, aprobó=Sí |

## Ejemplo: OT con 2 presupuestos

| Columna | Valor |
|---|---|
| AP | Sí |
| AQ | 4521; 4522 |
| AR | Sí |
| AS | P1: solicitó=Sí, N°=4521, aprobó=No \| P2: solicitó=Sí, N°=4522, aprobó=Sí |

## Ejemplo: OT sin presupuesto

| Columna | Valor |
|---|---|
| AP | No |
| AQ | (vacío) |
| AR | (vacío) |
| AS | P1: solicitó=No, N°=-, aprobó=- |

---

# POR QUÉ 4 COLUMNAS Y NO 3

Diseñé la solución con una columna extra (`Detalle Presupuestos`) porque tu formulario **permite agregar múltiples presupuestos** a una misma OT. Las 3 columnas simples (AP, AQ, AR) te dan un resumen rápido para filtrar y reportear, pero si una OT tuvo 2 o 3 presupuestos con distintos resultados, el detalle completo queda en AS sin perder información.

Esto te permite:
- **Filtrar rápido:** "muéstrame todas las OT donde se aprobó presupuesto" (columna AR = "Sí")
- **Analizar tasa de aprobación:** % de presupuestos aprobados vs rechazados
- **Auditar caso por caso:** ver el detalle en AS si necesitas profundizar

---

# VERIFICACIÓN (haz esto al terminar)

```
1. Sube index.html + service-worker.js a GitHub
2. Actualiza el array row en Apps Script + nueva versión
3. Agrega encabezados AP1-AS1 en la Sheet
4. Abre la app con Ctrl+Shift+R
5. Llena una OT de prueba:
   - En Presupuestos: clic "✅ Sí"
   - N° Presupuesto: escribe "TEST123"
   - ¿Aprueba?: clic "✅ Sí"
6. Completa el resto y guarda
7. Revisa la Sheet:
   - ¿Columna AP dice "Sí"?
   - ¿Columna AQ dice "TEST123"?
   - ¿Columna AR dice "Sí"?
   - ¿Columna AS tiene el detalle?
```

Si las 4 columnas se llenan → **corregido completamente**.

---

# RECORDATORIO IMPORTANTE

Este caso ilustra la regla de oro del sistema:

> **Cuando un dato debe llegar a la Sheet, hay que tocar 2 puntas: el objeto `data` en el formulario Y el array `row` en el Apps Script. Si solo se toca una, el dato se pierde silenciosamente.**

Ya actualicé el formulario por ti. Solo te queda actualizar el Apps Script (Parte 2) y agregar los encabezados (Parte 3).

---

**¿Dudas con algún paso? Avísame y lo resolvemos.**
