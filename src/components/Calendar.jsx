import '../styles/calendar.css'

const holidays={
  '2026-01-01':'신정',
  '2026-02-16':'설날 연휴',
  '2026-02-17':'설날',
  '2026-02-18':'설날 연휴',
  '2026-03-01':'삼일절',
  '2026-05-05':'어린이날',
  '2026-05-24':'부처님오신날',
  '2026-06-06':'현충일',
  '2026-08-15':'광복절',
  '2026-09-24':'추석 연휴',
  '2026-09-25':'추석',
  '2026-09-26':'추석 연휴',
  '2026-10-03':'개천절',
  '2026-10-09':'한글날',
  '2026-12-25':'성탄절'
}

function Calendar({currentDate,dutyTable,onMonthChange,onDutySelect,onGenerate,onSettings}){
  const year=currentDate.getFullYear()
  const month=currentDate.getMonth()
  const firstDay=new Date(year,month,1).getDay()
  const lastDate=new Date(year,month+1,0).getDate()
  const days=[]

  for(let i=0;i<firstDay;i++)days.push(null)
  for(let day=1;day<=lastDate;day++)days.push(day)

  const getDateKey=day=>{
    if(!day)return null
    return `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  }

  const handleDutyClick=(day,duty)=>{
    const dateKey=getDateKey(day)
    if(!dateKey)return
    onDutySelect(dateKey,duty)
  }

  return(
    <div className="calendar-screen">
      <div className="calendar-box">

        <div className="calendar-header">
          <button
            className="month-button"
            onClick={()=>onMonthChange(-1)}
            type="button"
          >
            ‹
          </button>

          <h1>{year}년 {month+1}월</h1>

          <button
            className="month-button"
            onClick={()=>onMonthChange(1)}
            type="button"
          >
            ›
          </button>
        </div>

        <div className="calendar-week">
          <div className="sunday">일</div>
          <div>월</div>
          <div>화</div>
          <div>수</div>
          <div>목</div>
          <div>금</div>
          <div className="saturday">토</div>
        </div>

        <div className="calendar-grid">
          {days.map((day,index)=>{
            if(!day){
              return(
                <div
                  className="calendar-day empty"
                  key={index}
                />
              )
            }

            const dateKey=getDateKey(day)
            const selectedDuty=dutyTable[dateKey]
            const holiday=holidays[dateKey]
            const weekDay=new Date(year,month,day).getDay()
            const isRed=weekDay===0||!!holiday

            return(
              <div
                className={`calendar-day ${isRed?'red-day':''}`}
                key={dateKey}
              >
                <div className="day-number">
                  <span>{day}</span>
                  {holiday&&(
                    <span className="holiday-name">
                      {holiday}
                    </span>
                  )}
                </div>

                <div className="duty-buttons">

                  <button
                    type="button"
                    className={`duty-btn duty-d ${selectedDuty==='D'?'selected':''} ${selectedDuty&&selectedDuty!=='D'?'dimmed':''}`}
                    onClick={()=>handleDutyClick(day,'D')}
                  >
                    D
                  </button>

                  <button
                    type="button"
                    className={`duty-btn duty-e ${selectedDuty==='E'?'selected':''} ${selectedDuty&&selectedDuty!=='E'?'dimmed':''}`}
                    onClick={()=>handleDutyClick(day,'E')}
                  >
                    E
                  </button>

                  <button
                    type="button"
                    className={`duty-btn duty-n ${selectedDuty==='N'?'selected':''} ${selectedDuty&&selectedDuty!=='N'?'dimmed':''}`}
                    onClick={()=>handleDutyClick(day,'N')}
                  >
                    N
                  </button>

                  <button
                    type="button"
                    className={`duty-btn duty-off ${selectedDuty==='off'?'selected':''} ${selectedDuty&&selectedDuty!=='off'?'dimmed':''}`}
                    onClick={()=>handleDutyClick(day,'off')}
                  >
                    OFF
                  </button>

                </div>
              </div>
            )
          })}
        </div>

        <div className="calendar-buttons">

          <button
            type="button"
            className="calendar-settings-button"
            onClick={onSettings}
          >
            설정
          </button>

          <button
            type="button"
            className="calendar-generate-button"
            onClick={onGenerate}
          >
            일정 생성
          </button>

        </div>

      </div>
    </div>
  )
}

export default Calendar