import { render, screen } from '@testing-library/react'
import { MemoryRouter as Router } from 'react-router-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  test('does not render buttons when not logged in', () => {
    const blog = {
      'title': 'This should be visible',
      'author': 'Vitest',
      'url': 'http://vitest.vite.test',
      'likes': 7,
      'user': {
        'username': 'tester123',
        'name': 'Testi Testinen',
      }
    }

    render(
      <Router>
        <Blog blog={blog} />
      </Router>
    )

    const title = screen.getByText('Vitest: This should be visible')
    expect(title).toBeDefined()

    const url = screen.getByText('http://vitest.vite.test')
    const likes = screen.getByText('likes 7')
    const name = screen.getByText('Added by Testi Testinen')
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(name).toBeDefined()

    const likeButton = screen.queryByText('like')
    const removeButton = screen.queryByText('remove')
    expect(likeButton).toBeNull()
    expect(removeButton).toBeNull()
  })

  test('renders like button when logged in', async () => {
    const blog = {
      'title': 'This should be visible',
      'author': 'Vitest',
      'url': 'http://vitest.vite.test',
      'likes': 7,
      'user': {
        'username': 'tester123',
        'name': 'Testi Testinen',
      }
    }

    const user = {
      'username' : 'someone_else',
      'name': 'unrelated person'
    }

    render(
      <Router>
        <Blog blog={blog} user={user} />
      </Router>
    )
    const title = screen.getByText('Vitest: This should be visible')
    expect(title).toBeDefined()

    const url = screen.getByText('http://vitest.vite.test')
    const likes = screen.getByText('likes 7')
    const name = screen.getByText('Added by Testi Testinen')
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(name).toBeDefined()

    const likeButton = screen.getByText('like')
    const removeButton = screen.queryByText('remove')
    expect(likeButton).toBeDefined()
    expect(removeButton).toBeNull()
  })

  test('renders remove button when creator is logged in', async () => {
    const blog = {
      'title': 'This should be visible',
      'author': 'Vitest',
      'url': 'http://vitest.vite.test',
      'likes': 7,
      'user': {
        'username': 'tester123',
        'name': 'Testi Testinen',
      }
    }

    const user = {
      'username' : 'tester123',
      'name': 'Testi Testinen'
    }

    render(
      <Router>
        <Blog blog={blog} user={user} />
      </Router>
    )
    const title = screen.getByText('Vitest: This should be visible')
    expect(title).toBeDefined()

    const url = screen.getByText('http://vitest.vite.test')
    const likes = screen.getByText('likes 7')
    const name = screen.getByText('Added by Testi Testinen')
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(name).toBeDefined()

    const likeButton = screen.getByText('like')
    const removeButton = screen.getByText('remove')
    expect(likeButton).toBeDefined()
    expect(removeButton).toBeDefined()
  })
})
