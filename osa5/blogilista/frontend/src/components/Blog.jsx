import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Button, Link } from '@mui/material'

const Blog = ({ blog, onLike, onRemove, user }) => {
  const navigate = useNavigate()

  const handleRemove = async () => {
    onRemove(blog.id)
    navigate('/')
  }

  if(!blog) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" fontWeight="bold">
          {blog.title}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" mb={2}>
          By {blog.author}
        </Typography>
        <Link href={blog.url}>
          {blog.url}
        </Link>
        <Typography
          variant="body2"
          color="text.secondary"
          mt={2}
        >
          Added by {blog.user.name}
        </Typography>
        <Typography>
        likes {blog.likes}
        </Typography>
        {user && (
          <Button
            variant="contained"
            onClick={() => onLike(blog.id)}
          >
            Like
          </Button>
        )}
        {user && user.username === blog.user.username && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleRemove}
          >
            Remove
          </Button>
        )}
      </CardContent>
    </Card>
  )

}

export default Blog
