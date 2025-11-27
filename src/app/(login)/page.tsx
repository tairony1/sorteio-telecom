import { Suspense } from 'react'
import LoginComponent from './login-client'

const Login = () => {
  return (
    <Suspense>
      <LoginComponent />
    </Suspense>
  )
}

export default Login
