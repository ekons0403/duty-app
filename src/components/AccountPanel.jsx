function AccountPanel({session,open,onClose,onLogout}){
  return(
    <>
      <button className={`menu-toggle ${open?'open':''}`} onClick={onClose} type="button">
        {open?'‹':'☰'}
      </button>

      <div className={`account-panel ${open?'open':''}`}>
        <div className="account-panel-content">
          <h2>내 계정</h2>

          <div className="account-info">
            <div className="account-icon">👤</div>
            <div>
              <p>로그인 계정</p>
              <strong>{session?.user?.email}</strong>
            </div>
          </div>

          <button className="logout-button" onClick={onLogout} type="button">
            🚪 로그아웃
          </button>
        </div>
      </div>

      {open&&<div className="account-overlay" onClick={onClose}/>}
    </>
  )
}

export default AccountPanel