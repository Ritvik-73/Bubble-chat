import { useState } from 'react'
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="cot">
      <div className="cot">

        {/* Logo / App name */}
        <div className="cot">
          <h1 className="topHead">Bubble Chat</h1>
          <p className="para">Real-time messaging with AI</p>
        </div>

        {/* Card */}
        <div className="card">
          {isLogin
            ? <LoginForm onSwitch={() => setIsLogin(false)} />
            : <SignupForm onSwitch={() => setIsLogin(true)} />
          }
        </div>

        {/* Footer */}
        <p className="para">
          Built with Supabase + Gemini
        </p>

      </div>
    </div>
  )
}

export default AuthPage