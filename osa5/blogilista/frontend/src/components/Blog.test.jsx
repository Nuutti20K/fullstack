import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'





describe('<Blog />', () => {
  beforeEach(() => {
    const blog = {
      "title": "This should be visible",
      "author": "Vitest",
      "url": "http://vitest.vite.test",
      "likes": 7,
      "user": {
        "username": "tester123",
        "name": "Testi Testinen",
      }
    }
    const mockHandler = vi.fn()

    render(<Blog blog={blog} onLike={mockHandler} />)
  })

  test('renders limited information only', () => {

    const title = screen.getByText('This should be visible Vitest')
    expect(title).toBeDefined()

    const url = screen.queryByText('http://vitest.vite.test')
    const likes = screen.queryByText('likes 7')
    const name = screen.queryByText('Testi Testinen')
    expect(url).toBeNull()
    expect(likes).toBeNull()
    expect(name).toBeNull()
  })

  test('renders all information after view is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const title = screen.getByText('This should be visible Vitest')
    const url = screen.getByText('http://vitest.vite.test')
    const likes = screen.getByText('likes 7')
    const name = screen.getByText('Testi Testinen')

    expect(title).toBeDefined()
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(name).toBeDefined()
  })  
})

test('clicking like twice calls event handler twice', async () => {
    const blog = {
      "title": "This should be visible",
      "author": "Vitest",
      "url": "http://vitest.vite.test",
      "likes": 7,
      "user": {
        "username": "tester123",
        "name": "Testi Testinen",
      }
    }
    const mockHandler = vi.fn()

    render(<Blog blog={blog} onLike={mockHandler} />)
    
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })