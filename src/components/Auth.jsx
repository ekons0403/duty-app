// src/components/Auth.jsx

import { useState } from 'react'

function Auth({
  onLogin,
  onSignUp,
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [mode, setMode] = useState('login')

  const handleLogin = async () => {
    await onLogin(email, password)
  }

  const handleSignUp = async () => {
    await onSignUp(email, password)
  }

  return (
    <div className="app">
      <div className="card auth-screen">

        <h1>듀티 메이트</h1>

        <p className="subtitle">
          {mode === 'login'
            ? '로그인해주세요'
            : '계정을 만들어주세요'}
        </p>

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {mode === 'login' ? (
          <>
            <button onClick={handleLogin}>
              로그인
            </button>

            <button
              type="button"
              onClick={() =>
                setMode('signup')
              }
            >
              회원가입
            </button>
          </>
        ) : (
          <>
            <button onClick={handleSignUp}>
              회원가입
            </button>

            <button
              type="button"
              onClick={() =>
                setMode('login')
              }
            >
              로그인으로 돌아가기
            </button>
          </>
        )}

      </div>
    </div>
  )
}

export default Auth