# Cron de reporte de ventas

## Variables de entorno

- `SALES_REPORT_EMAIL`: correo que recibirá el reporte diario de ventas del mes en curso.
- `CRON_SECRET`: secreto requerido para autorizar la ejecución del endpoint del cron.

## Llamada manual

Se puede ejecutar manualmente con una petición `GET` al endpoint:

`/api/cron/sales-report`

Opciones de autenticación soportadas:

- Header `x-cron-secret: TU_SECRETO`
- Header `authorization: Bearer TU_SECRETO`
- Query param `?secret=TU_SECRETO`

Ejemplo con header:

```bash
curl -X GET http://localhost:3000/api/cron/sales-report \
  -H "x-cron-secret: TU_SECRETO"
```
