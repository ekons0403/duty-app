import { useState } from 'react'
import './App.css'

function App() {
  const [step, setStep] = useState(1)

  const [mealCount, setMealCount] = useState(2)
  const [prepareTime, setPrepareTime] = useState(1)
  const [sleepHours, setSleepHours] = useState(7)
  const [sleepMinutes, setSleepMinutes] = useState(30)

  const [dutyTimes, setDutyTimes] = useState({
    D: { start: '06:00', end: '15:00' },
    E: { start: '14:00', end: '23:00' },
    N: { start: '22:00', end: '07:00' },
  })

  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 7, 1)
  )

  const [dutyTable, setDutyTable] = useState({})

  const handleDutyTimeChange = (duty, type, value) => {
    setDutyTimes({
      ...dutyTimes,
      [duty]: {
        ...dutyTimes[duty],
        [type]: value,
      },
    })
  }

  const getCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1).getDay()
    const lastDate = new Date(year, month + 1, 0).getDate()

    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let day = 1; day <= lastDate; day++) {
      days.push(day)
    }

    return days
  }

  const changeMonth = (amount) => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + amount,
        1
      )
    )
  }

  const selectDuty = (dateKey, duty) => {
    setDutyTable((prev) => ({
      ...prev,
      [dateKey]: duty,
    }))
  }

  return (
    <div className="app">
      <div className="card">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h1>듀티 메이트</h1>

            <p className="subtitle">
              생활 설정을 입력해주세요
            </p>

            <div className="setting">
              <label>하루 식사 횟수</label>

              <div className="input-row">
                <input
                  type="number"
                  min="1"
                  value={mealCount}
                  onChange={(e) =>
                    setMealCount(Number(e.target.value))
                  }
                />
                <span>끼</span>
              </div>
            </div>

            <div className="setting">
              <label>출근 준비 시간</label>

              <div className="input-row">
                <input
                  type="number"
                  min="0"
                  value={prepareTime}
                  onChange={(e) =>
                    setPrepareTime(Number(e.target.value))
                  }
                />
                <span>시간 전</span>
              </div>
            </div>

            <div className="setting">
              <label>목표 수면 시간</label>

              <div className="input-row">
                <input
                  type="number"
                  min="0"
                  value={sleepHours}
                  onChange={(e) =>
                    setSleepHours(Number(e.target.value))
                  }
                />

                <span>시간</span>

                <input
                  type="number"
                  min="0"
                  max="59"
                  value={sleepMinutes}
                  onChange={(e) =>
                    setSleepMinutes(Number(e.target.value))
                  }
                />

                <span>분</span>
              </div>
            </div>

            <button onClick={() => setStep(2)}>
              다음
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h1>근무시간 설정</h1>

            <p className="subtitle">
              D / E / N 근무시간을 확인해주세요
            </p>

            {['D', 'E', 'N'].map((duty) => (
              <div className="duty-setting" key={duty}>
                <label>{duty} 근무</label>

                <div className="time-row">
                  <input
                    type="time"
                    value={dutyTimes[duty].start}
                    onChange={(e) =>
                      handleDutyTimeChange(
                        duty,
                        'start',
                        e.target.value
                      )
                    }
                  />

                  <span>~</span>

                  <input
                    type="time"
                    value={dutyTimes[duty].end}
                    onChange={(e) =>
                      handleDutyTimeChange(
                        duty,
                        'end',
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}

            <button onClick={() => setStep(3)}>
              저장
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h1>듀티표</h1>

            <p className="subtitle">
              날짜에 마우스를 올려 근무를 선택해주세요
            </p>

            <div className="calendar">

              <div className="calendar-header">
                <button
                  className="month-button"
                  onClick={() => changeMonth(-1)}
                >
                  ‹
                </button>

                <h2>
                  {currentDate.getFullYear()}년{' '}
                  {currentDate.getMonth() + 1}월
                </h2>

                <button
                  className="month-button"
                  onClick={() => changeMonth(1)}
                >
                  ›
                </button>
              </div>

              <div className="weekdays">
                <div>일</div>
                <div>월</div>
                <div>화</div>
                <div>수</div>
                <div>목</div>
                <div>금</div>
                <div>토</div>
              </div>

              <div className="calendar-grid">

                {getCalendarDays().map((day, index) => {

                  if (day === null) {
                    return (
                      <div
                        className="calendar-day empty"
                        key={index}
                      />
                    )
                  }

                  const key =
                    `${currentDate.getFullYear()}-` +
                    `${String(
                      currentDate.getMonth() + 1
                    ).padStart(2, '0')}-` +
                    `${String(day).padStart(2, '0')}`

                  const duty = dutyTable[key]

                  return (
                    <div
                      className="calendar-day-wrapper"
                      key={key}
                    >
                      <div
                        className={`calendar-day ${
                          duty
                            ? `has-${duty}`
                            : ''
                        }`}
                      >

                        <span className="day-number">
                          {day}
                        </span>

                        {duty && (
                          <span
                            className={`duty ${duty}`}
                          >
                            {duty}
                          </span>
                        )}

                        <div className="duty-menu">

                          <button
                            onClick={() =>
                              selectDuty(key, 'D')
                            }
                          >
                            D
                          </button>

                          <button
                            onClick={() =>
                              selectDuty(key, 'E')
                            }
                          >
                            E
                          </button>

                          <button
                            onClick={() =>
                              selectDuty(key, 'N')
                            }
                          >
                            N
                          </button>

                          <button
                            onClick={() =>
                              selectDuty(key, 'OFF')
                            }
                          >
                            OFF
                          </button>

                        </div>

                      </div>
                    </div>
                  )
                })}

              </div>
            </div>

            <button onClick={() => setStep(4)}>
              일정 생성
            </button>

            <button onClick={() => setStep(2)}>
              이전
            </button>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h1>일정 생성</h1>

            <p className="subtitle">
              입력한 듀티표를 확인해주세요.
            </p>

            <div className="result-list">

              {Object.entries(dutyTable).length === 0 ? (
                <p>입력된 근무가 없습니다.</p>
              ) : (
                Object.entries(dutyTable).map(
                  ([date, duty]) => (
                    <div
                      className="result-row"
                      key={date}
                    >
                      <span>{date}</span>

                      <strong
                        className={`duty ${duty}`}
                      >
                        {duty}
                      </strong>
                    </div>
                  )
                )
              )}

            </div>

            <button onClick={() => setStep(3)}>
              듀티표 수정
            </button>
          </>
        )}

      </div>
    </div>
  )
}

export default App