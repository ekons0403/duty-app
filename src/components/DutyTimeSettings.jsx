import '../styles/dutyTime.css'

function DutyTimeSettings({dutyTimes,onChange,onNext,onBack}){
  return(
    <div className="duty-time-screen">
      <div className="duty-time-box">
        <div className="duty-time-title">
          <h1>근무 시간 설정</h1>
          <p>D / E / N 근무 시간을 입력해주세요</p>
        </div>

        <div className="duty-time-list">
          <div className="duty-time-item">
            <div className="duty-label">D</div>
            <div className="duty-input-group">
              <label>출근</label>
              <input
                type="time"
                value={dutyTimes.D.start}
                onChange={e=>onChange('D','start',e.target.value)}
              />
            </div>
            <div className="duty-input-group">
              <label>퇴근</label>
              <input
                type="time"
                value={dutyTimes.D.end}
                onChange={e=>onChange('D','end',e.target.value)}
              />
            </div>
          </div>

          <div className="duty-time-item">
            <div className="duty-label">E</div>
            <div className="duty-input-group">
              <label>출근</label>
              <input
                type="time"
                value={dutyTimes.E.start}
                onChange={e=>onChange('E','start',e.target.value)}
              />
            </div>
            <div className="duty-input-group">
              <label>퇴근</label>
              <input
                type="time"
                value={dutyTimes.E.end}
                onChange={e=>onChange('E','end',e.target.value)}
              />
            </div>
          </div>

          <div className="duty-time-item">
            <div className="duty-label">N</div>
            <div className="duty-input-group">
              <label>출근</label>
              <input
                type="time"
                value={dutyTimes.N.start}
                onChange={e=>onChange('N','start',e.target.value)}
              />
            </div>
            <div className="duty-input-group">
              <label>퇴근</label>
              <input
                type="time"
                value={dutyTimes.N.end}
                onChange={e=>onChange('N','end',e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="duty-time-buttons">
          <button className="duty-back-button" onClick={onBack} type="button">
            이전
          </button>

          <button className="duty-next-button" onClick={onNext} type="button">
            다음
          </button>
        </div>
      </div>
    </div>
  )
}

export default DutyTimeSettings