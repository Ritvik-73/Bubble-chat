import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const SignupForm = ({ onSwitch }) => {
    const [ email, setEmail] = useState('')
    const [ password, setPassword ] = useState('')
    const [ username, setUsername ] = useState('')
    const [ error, setError ] = useState(null)
    const [ success, setSuccess ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const handleSignup = async () => {
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        })

        if (error) setError(error.message)
        else setSuccess(true)

        setLoading(false)
    }

    if(success){
        return (
            <div className="cot">
                <h2 className="midHead">Check your email!</h2>
                <p className="para">
                    We sent a confirmation link to <span className="email">{email}</span>.
                    Confirm it and then sign in.
                </p>
                <button onClick={onSwitch} className="button">
                    Back to sign in
                </button>
            </div>
        )
    }


    return (
        <div className="cot">
            <h2 className="midHead">Create an account</h2>

            {error && (
                <p className="error">{error}</p>
            )}

            <input 
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input" 
            />

            <input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            />

            <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input" 
            />

            <button
            onClick={handleSignup}
            disabled={loading}
            className="button"
            >
                {loading ? 'Creating account...' : 'Sign up'}
            </button>

            <p className='para'>
                Already have an account?{' '}
                <button onClick={onSwitch} className="link">
                    Sign in
                </button>
            </p>
        </div>
    )
}

export default SignupForm