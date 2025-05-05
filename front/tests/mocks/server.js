import { setupServer } from 'msw/node'
import { rest } from 'msw'

export const server = setupServer(
  rest.get('/api/Users', (req, res, ctx) => {
    return res(
      ctx.json([
        { email: 'test@example.com', password: 'password123' }
      ])
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())