import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const LoginForm = ({ onSwitch }) => {
    const [ email, setEmail] = useState('')
    const [ password, setPassword ] = useState('')
    const [ error, setError ] = useState(null)
    const [ loading, setLoading ] = useState(false)

    const handleLogin = async () => {
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) setError(error.message)
        setLoading(false)
    }

    return(
        <div className="cot">
            <h2 className="midHead">Welcome Back</h2>

            {error && (
                <p className="error">{error}</p>
            )}

            <input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            />

            <input type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            />

            <button
                onClick={handleLogin}
                disabled={loading}
                className="button"
            >
                {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="para">
                No account?{' '}
                <button onClick={onSwitch} className="link">
                    Sign up
                </button>
            </p>
        </div>
    )
}

export default LoginForm