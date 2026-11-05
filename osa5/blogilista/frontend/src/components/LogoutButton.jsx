import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'

const LogoutButton = ({ onLogout }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    onLogout()
    navigate('/')
  }

  const style = { bgcolor: 'rgb(50, 50, 50)',
    '&:hover': {
      bgcolor: 'rgb(100, 100, 100)',
    } }

  return (
    <Button onClick={handleLogout} variant="contained" sx={style} >
      logout
    </Button>
  )
}

export default LogoutButton