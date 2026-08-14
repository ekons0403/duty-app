function AccountPanel({
  session,
  open,
  onClose,
  onLogout,
  onNavigate,
}) {
  const handleNavigate = (step) => {
    onNavigate(step)
    onClose()
  }

  return (
    <>
      <button
        className={`menu-toggle ${open ? 'open' : ''}`}
        onClick={onClose}
        type="button"
      >
        {open ? '‹' : '☰'}
      </button>

      <div className={`account-panel ${open ? 'open' : ''}`}>
        <div className="account-panel-content">

          <h2>듀티 메이트</h2>

          {/* 계정 정보 */}
          <div className="account-info">
            <div className="account-icon">👤</div>

            <div>
              <p>로그인 계정</p>
              <strong>{session?.user?.email}</strong>
            </div>
          </div>

          {/* 메뉴 */}
          <nav className="side-menu">

            <button
              type="button"
              onClick={() => handleNavigate(1)}
            >
              ⚙️
              <span>생활 설정</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate(2)}
            >
              🕐
              <span>근무시간 설정</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate(3)}
            >
              📅
              <span>달력</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavigate(4)}
            >
              🏥
              <span>근무표</span>
            </button>

          </nav>

          {/* 로그아웃 */}
          <button
            className="logout-button"
            onClick={onLogout}
            type="button"
          >
            🚪 로그아웃
          </button>

        </div>
      </div>

      {open && (
        <div
          className="account-overlay"
          onClick={onClose}
        />
      )}
    </>
  )
}

export default AccountPanel