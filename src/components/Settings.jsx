import '../styles/settings.css'

function Settings({mealCount,setMealCount,prepareTime,setPrepareTime,sleepHours,setSleepHours,sleepMinutes,setSleepMinutes,onNext}){
  return(
    <div className="settings-screen">
      <div className="settings-box">
        <div className="settings-title">
          <h1>듀티 메이트</h1>
          <p>생활 설정을 입력해주세요</p>
        </div>

        <div className="setting-item">
          <h3>하루 식사 횟수</h3>
          <div className="setting-input">
            <input
              type="number"
              min="1"
              value={mealCount}
              onChange={e=>setMealCount(Number(e.target.value))}
            />
            <span>끼</span>
          </div>
        </div>

        <div className="setting-item">
          <h3>출근 준비 시간</h3>
          <div className="setting-input">
            <input
              type="number"
              min="0"
              value={prepareTime}
              onChange={e=>setPrepareTime(Number(e.target.value))}
            />
            <span>시간 전</span>
          </div>
        </div>

        <div className="setting-item">
          <h3>목표 수면 시간</h3>
          <div className="setting-input">
            <input
              type="number"
              min="0"
              value={sleepHours}
              onChange={e=>setSleepHours(Number(e.target.value))}
            />
            <span>시간</span>

            <input
              type="number"
              min="0"
              max="59"
              value={sleepMinutes}
              onChange={e=>setSleepMinutes(Number(e.target.value))}
            />
            <span>분</span>
          </div>
        </div>

        <button className="next-button" onClick={onNext} type="button">
          다음
        </button>
      </div>
    </div>
  )
}

export default Settings