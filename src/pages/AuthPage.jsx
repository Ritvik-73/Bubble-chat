import { useState } from 'react'
import LoginForm from '../components/auth/LoginForm'
import SignupForm from '../components/auth/SignupForm'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="h-screen flex overflow-hidden bg-[#30302e]">
      {/* LEFT HALF - Hidden on mobile, visible from 'lg' (1024px) upwards */}
      <div className="hidden lg:flex relative lg:w-1/3 h-full z-10 group">
        <div className="relative z-10 bg-[#1D9E75] p-12 flex flex-col justify-between h-full pl-20 shadow-[30px_0_60px_-15px_rgba(0,0,0,0.2)] border-r border-black/20">
          {/* Top — Brand */}
          <div>
            <h1 className="text-white text-2xl font-medium tracking-tight pt-10">Bubble Chat</h1>
            <p className="text-white/60 text-sm mt-1">Real-time messaging with AI</p>
          </div>

          {/* Middle — Hero text */}
          <div>
            <h2 className="text-white text-5xl font-medium leading-tight tracking-tighter">
              Chat smarter.<br />Together.
            </h2>
            <p className="text-white/65 text-sm mt-4 leading-relaxed">
              Real-time conversations with<br />built-in AI — for everyone.
            </p>
          </div>

          {/* Bottom — Dots */}
          <div className="flex gap-2 pb-10">
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      {/* RIGHT HALF - Full width on mobile, 2/3 width on desktop */}
      <div className="relative z-0 w-full lg:w-2/3 bg-[#30302e] p-8 lg:p-16 flex flex-col justify-center items-center h-full">
        <div className="max-w-sm w-full mx-auto">
          
          {/* Mobile-only Branding (Optional: shows logo when sidebar is gone) */}
          <div className="lg:hidden mb-12 text-center">
             <h1 className="text-white text-3xl font-medium tracking-tight">Bubble Chat</h1>
             <p className="text-[#b0aea5] text-sm mt-2">Sign in to continue</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#b0aea5] mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`text-lg font-medium pb-3 mr-6 border-b-2 transition-colors ${
                isLogin
                  ? 'border-[#1D9E75] text-[#1D9E75]'
                  : 'border-transparent text-[#b0aea5] hover:text-[#8f8e86]'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`text-lg font-medium pb-3 border-b-2 transition-colors ${
                !isLogin
                  ? 'border-[#1D9E75] text-[#1D9E75]'
                  : 'border-transparent text-[#b0aea5] hover:text-[#8f8e86]'
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Form */}
          <div className="w-full">
            {isLogin ? <LoginForm /> : <SignupForm />}
          </div>

        </div>
      </div>      
    </div>
  )
}

export default AuthPage