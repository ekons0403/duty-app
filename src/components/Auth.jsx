import { useEffect, useState } from 'react'
import '../styles/auth.css'

function Auth({
  onLogin,
  onSignUp,
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [saveEmail, setSaveEmail] = useState(false)


  // 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem('duty-mate-email')

    if (savedEmail) {
      setEmail(savedEmail)
      setSaveEmail(true)
    }
  }, [])


  const handleLogin = async () => {

    // 이메일 저장
    if (saveEmail) {
      localStorage.setItem(
        'duty-mate-email',
        email
      )
    } else {
      localStorage.removeItem(
        'duty-mate-email'
      )
    }

    await onLogin(email, password)
  }


  const handleSignUp = async () => {
    await onSignUp(email, password)
  }


  return (
    <div className="auth-screen">

      <div className="auth-card">

        {/* 로고 */}
        <div className="auth-logo">

          <div className="auth-logo-icon">
            📅
          </div>

          <div className="auth-logo-text">
            <h1>듀티 메이트</h1>
            <p>나의 근무와 생활을 한눈에</p>
          </div>

        </div>


        {/* 제목 */}
        <h2 className="auth-title">
          {mode === 'login'
            ? '다시 만나서 반가워요'
            : '새로운 시작을 함께해요'}
        </h2>

        <p className="auth-subtitle">
          {mode === 'login'
            ? '계정에 로그인해주세요.'
            : '계정을 만들어주세요.'}
        </p>


        {/* 이메일 */}
        <div className="auth-field">

          <label htmlFor="auth-email">
            이메일
          </label>

          <input
            id="auth-email"
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

        </div>


        {/* 비밀번호 */}
        <div className="auth-field">

          <label htmlFor="auth-password">
            비밀번호
          </label>

          <input
            id="auth-password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

        </div>


        {/* 이메일 저장 */}
        {mode === 'login' && (
          <div className="auth-save">

            <input
              id="save-email"
              type="checkbox"
              checked={saveEmail}
              onChange={(e) =>
                setSaveEmail(e.target.checked)
              }
            />

            <label htmlFor="save-email">
              이메일 저장
            </label>

          </div>
        )}


        {/* 메인 버튼 */}
        <button
          className="auth-main-button"
          onClick={
            mode === 'login'
              ? handleLogin
              : handleSignUp
          }
          type="button"
        >
          <span className="auth-main-text">
            {mode === 'login'
              ? '로그인'
              : '회원가입'}
          </span>

          <span className="auth-arrow">
            →
          </span>
        </button>


        {/* 로그인 ↔ 회원가입 */}
        <div className="auth-switch">

          <span className="auth-switch-message">
            {mode === 'login'
              ? '아직 계정이 없으신가요?'
              : '이미 계정이 있으신가요?'}
          </span>

          <button
            className="auth-switch-button"
            type="button"
            onClick={() =>
              setMode(
                mode === 'login'
                  ? 'signup'
                  : 'login'
              )
            }
          >
            {mode === 'login'
              ? '회원가입'
              : '로그인'}
          </button>

        </div>


        {/* 하단 */}
        <div className="auth-footer">
          <strong>DUTY MATE</strong>
          <span>•</span>
          생활을 더 편하게
        </div>

      </div>

    </div>
  )
}

export default Auth