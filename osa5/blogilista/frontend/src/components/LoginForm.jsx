import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ onLogin, user }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    onLogin(username, password)
    navigate('/')
    setUsername('')
    setPassword('')
  }

  return(

    <div>
      {!user && (
        <div>
          <h2>Log in to application</h2>
          <form onSubmit={handleLogin}>
            <div>
              <TextField
                label="username"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              <TextField
                label="password"
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
              login
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}

export default LoginForm