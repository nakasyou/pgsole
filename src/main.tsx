import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { raw } from 'hono/html'
import postgres from 'postgres'

const dbUrl = import.meta.env.DB_URL
const sql = postgres(dbUrl, {
  ssl: 'require'
})

const app = new Hono()

app.get(
  '*',
  jsxRenderer(({ children }) => {
    return (
      <html>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          {import.meta.env.PROD ? (
            <script type="module" src="/static/app.js"></script>
          ) : (
            <>
              <script type="module" src="/src/app.ts"></script>
              <script src="//cdn.jsdelivr.net/npm/eruda"></script>
              <script>{raw`eruda.init();`}</script>
            </>
          )}
        </head>
        <body>
          {children}
        </body>
      </html>
    )
  })
)

app.get('/', (c) => {
  return c.render(<div id="app"></div>)
})

app.get('/tables', async c => {
  const result = (await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  ` as { table_name: string }[]).map(res => res.table_name)
  
  return c.json(result)
})
app.get('/col-names', async c => {
  const tableName = c.req.query('table')
  if (!tableName) {
    throw 0
  }
  const result = (await sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = ${tableName};
  `) as {
    column_name: string
    data_type: string
  }[]
  return c.json(result)
})
app.get('/all-datas', async c => {
  const tableName = c.req.query('table')
  if (!tableName) {
    throw 0
  }
  const result = await sql.unsafe(`SELECT * FROM ${tableName}`)
  console.log(result)
})

export default app
