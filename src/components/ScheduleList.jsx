import {createSchedule} from '../utils/schedule'
import '../styles/schedule.css'

function ScheduleList({
  dutyTable,
  dutyTimes,
  prepareTime,
  sleepHours,
  sleepMinutes,
  onBack,
}){
  return(
    <div className="schedule-screen">
      <div className="schedule-box">
        <h1>생활 일정</h1>

        <p className="subtitle">
          듀티에 맞춰 자동으로 계산된 일정입니다.
        </p>

        <div className="schedule-list">
          {Object.entries(dutyTable).length===0?(
            <p className="empty-message">
              입력된 근무가 없습니다.
            </p>
          ):(
            Object.entries(dutyTable).map(([date,duty])=>{
              const schedule=createSchedule({
                duty,
                dutyTimes,
                prepareTime,
                sleepHours,
                sleepMinutes,
              })

              return(
                <div className="schedule-card" key={date}>
                  <div className="schedule-date">
                    <strong>{date}</strong>
                    <span className={`duty ${duty}`}>
                      {duty}
                    </span>
                  </div>

                  <div className="schedule-items">
                    {schedule.map((item,index)=>(
                      <div className="schedule-item" key={index}>
                        <span className="schedule-icon">
                          {item.type==='sleep'
                            ?'😴'
                            :item.type==='meal'
                            ?'🍚'
                            :item.type==='prepare'
                            ?'🚿'
                            :'🏥'}
                        </span>

                        <span className="schedule-title">
                          {item.title}
                        </span>

                        <strong>
                          {item.start} ~ {item.end}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>

        <button onClick={onBack}>
          듀티표 수정
        </button>
      </div>
    </div>
  )
}

export default ScheduleList