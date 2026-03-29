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
            <div className="flex flex-col gap-4 text-center py-8">
                <div className="text-4xl">📬</div>
                <h2 className="text-xl font-bold text-[#b0aea5] tracking-tight">Check your email</h2>
                <p className="text-sm text-[#b0aea5] leading-relaxed">
                We sent a confirmation link to{' '}
                <span className="font-medium text-[#b0aea5]">{email}</span>
                </p>
            </div>
            )
        }

    return (
        <div className="flex flex-col gap-7">

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold text-[#b0aea5]">USERNAME</p>
                    <input 
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#b0aea5] text-lg text-[#b0aea5] outline-none focus-border-[#1D9E75] "
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold text-[#b0aea5]">EMAIL</p>
                    <input 
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#b0aea5] text-lg text-[#b0aea5] outline-none focus-border-[#1D9E75] "
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold text-[#b0aea5]">PASSWORD</p>
                    <input type="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#b0aea5] text-lg text-[#b0aea5] outline-none focus-border-[#1D9E75] "
                    />
                </div>
                
            </div>

            <button 
            onClick={handleSignup}
            disabled={loading}
            className="group relative bg-transparent p-0 border-none cursor-pointer outline-offset-4 outline-[#1D9E75] transition-[filter] duration-250 [-webkit-tap-highlight-color:transparent] hover:brightness-110 focus:outline-none focus-visible:outline-2 focus-visible:outline-[#1D9E75]">
                 
                    
                {/* Shadow (Darkened for dark backgrounds) */}
                <span className="absolute inset-0 w-full h-full bg-[#082f23] rounded-lg blur-[2px] will-change-transform translate-y-2px transition-transform duration-600 ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-1 group-hover:duration-250 group-hover:ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-active:translate-y-1px group-active:duration-34"></span>
                
                {/* Edge */}
                <span className="absolute inset-0 w-full h-full rounded-lg bg-[linear-gradient(to_right,#0f563f_0%,#16805e_8%,#16805e_92%,#0b402e_100%)]"></span>
                
                {/* Front */}
                <span className="block relative rounded-lg bg-[#1D9E75] py-4 px-8 text-white font-bold uppercase tracking-[1.5px] text-base -translate-y-1 transition-transform duration-600 ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-1.5 group-hover:duration-250 group-hover:ease-[cubic-bezier(0.3,0.7,0.4,1.5)] group-active:-translate-y-0.5 group-active:duration-34">
                    {loading ? 'Creating account...' : 'Sign Up'}
                </span>
  
            </button>
        </div>
    )
}

export default SignupForm