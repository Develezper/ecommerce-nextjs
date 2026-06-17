# Sales Report Cron

## Production URL

https://ecommerce-nextjs-ebon-two.vercel.app/es

## Environment Variables

- `GMAIL_USER`: Gmail account used by the app to send emails.
- `GMAIL_APP_PASSWORD`: Gmail App Password used to authenticate Nodemailer.
- `SALES_REPORT_EMAIL`: Email address that will receive the daily sales report for the current month.
- `CRON_SECRET`: Secret required to authorize execution of the cron endpoint.

## Manual Trigger

You can run it manually with a `GET` request to:

`/api/cron/sales-report`

Supported authentication options:

- Header `x-cron-secret: YOUR_SECRET`
- Header `authorization: Bearer YOUR_SECRET`
- Query param `?secret=YOUR_SECRET`

Example using a header:

```bash
curl -X GET http://localhost:3000/api/cron/sales-report \
  -H "x-cron-secret: YOUR_SECRET"
```

## Admin Role

To allow product creation from the admin view, you have two simple options:

1. Run the demo users seed:

```bash
bun run seed:users
```

Demo credentials created by the seed:

- Admin: `admin@ecommerce.local` / `Admin123!`
- User: `cliente1@ecommerce.local` / `User123!`
- User: `cliente2@ecommerce.local` / `User123!`

2. Or change an existing user in MongoDB Compass by setting:

```json
{
  "role": "admin"
}
```

If a user was already logged in before the role change, log out and log in again so the JWT includes the updated role.
