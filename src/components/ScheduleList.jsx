import { useEffect, useState } from 'react'
import { createSchedule } from '../utils/schedule'
import '../styles/schedule.css'

function ScheduleList({
  dutyTable,
  dutyTimes,
  prepareTime,
  sleepHours,
  sleepMinutes,
  onBack,
}) {
  const dates = Object.keys(dutyTable).sort()

  // 오늘 날짜를 YYYY-MM-DD 형식으로 생성
  const getTodayString = () => {
    const today = new Date()

    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const today = getTodayString()

  // 오늘 날짜의 index
  const todayIndex = dates.indexOf(today)

  // 오늘이 없으면 가장 가까운 날짜 선택
  const getInitialIndex = () => {
    if (todayIndex !== -1) {
      return todayIndex
    }

    if (dates.length === 0) {
      return 0
    }

    // 오늘보다 이전인 가장 가까운 날짜 찾기
    let closestIndex = 0

    dates.forEach((date, index) => {
      if (date <= today) {
        closestIndex = index
      }
    })

    return closestIndex
  }

  const [currentIndex, setCurrentIndex] = useState(
    getInitialIndex()
  )

  const [touchStartX, setTouchStartX] = useState(null)

  // dutyTable이 변경되면 오늘 날짜를 다시 중앙으로
  useEffect(() => {
    if (dates.length === 0) {
      setCurrentIndex(0)
      return
    }

    const newTodayIndex = dates.indexOf(today)

    if (newTodayIndex !== -1) {
      setCurrentIndex(newTodayIndex)
    }
  }, [dutyTable])

  // 날짜 이동
  const moveDate = (amount) => {
    setCurrentIndex((prev) => {
      const next = prev + amount

      if (next < 0) {
        return 0
      }

      if (next >= dates.length) {
        return dates.length - 1
      }

      return next
    })
  }

  // PC 가로 휠
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) < 10) {
      return
    }

    if (e.deltaX > 30) {
      moveDate(1)
    }

    if (e.deltaX < -30) {
      moveDate(-1)
    }
  }

  // 모바일 스와이프 시작
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX)
  }

  // 모바일 스와이프 종료
  const handleTouchEnd = (e) => {
    if (touchStartX === null) {
      return
    }

    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX

    // 50px 이상 움직였을 때만 이동
    if (Math.abs(diff) >= 50) {
      if (diff > 0) {
        // 왼쪽으로 스와이프 → 다음 날짜
        moveDate(1)
      } else {
        // 오른쪽으로 스와이프 → 이전 날짜
        moveDate(-1)
      }
    }

    setTouchStartX(null)
  }

  // 날짜 표시
  const formatDate = (date) => {
    if (!date) {
      return ''
    }

    const [, month, day] = date.split('-')

    return `${month}/${day}`
  }

  // 요일
  const getDayName = (date) => {
    if (!date) {
      return ''
    }

    const day = new Date(`${date}T00:00:00`).getDay()

    const names = [
      '일',
      '월',
      '화',
      '수',
      '목',
      '금',
      '토',
    ]

    return names[day]
  }

  // 일정이 없는 경우
  if (dates.length === 0) {
    return (
      <div className="schedule-screen">
        <div className="schedule-box">

          <h1>생활 일정</h1>

          <p className="subtitle">
            듀티에 맞춰 자동으로 계산된 일정입니다.
          </p>

          <p className="empty-message">
            입력된 근무가 없습니다.
          </p>

          <button onClick={onBack}>
            듀티표 수정
          </button>

        </div>
      </div>
    )
  }

  const currentDate = dates[currentIndex]
  const currentDuty = dutyTable[currentDate]

  const previousDate =
    dates[currentIndex - 1] || null

  const nextDate =
    dates[currentIndex + 1] || null

  // 현재 날짜의 생활 일정 계산
  const currentSchedule = createSchedule({
    duty: currentDuty,
    dutyTimes,
    prepareTime,
    sleepHours,
    sleepMinutes,
  })

  return (
    <div className="schedule-screen">

      <div className="schedule-box">

        <h1>생활 일정</h1>

        <p className="subtitle">
          듀티에 맞춰 자동으로 계산된 일정입니다.
        </p>

        {/* 날짜 캐러셀 */}
        <div
          className="date-carousel"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

          {/* 이전 버튼 */}
          <button
            className="date-arrow date-arrow-left"
            onClick={() => moveDate(-1)}
            disabled={currentIndex === 0}
            type="button"
          >
            ‹
          </button>

          {/* 어제 / 이전 날짜 */}
          <div className="date-side date-previous">

            {previousDate && (
              <>
                <span className="side-date">
                  {formatDate(previousDate)}
                </span>

                <span className="side-day">
                  {getDayName(previousDate)}요일
                </span>

                <span
                  className={`side-duty duty ${dutyTable[previousDate]}`}
                >
                  {dutyTable[previousDate]}
                </span>
              </>
            )}

          </div>

          {/* 현재 날짜 */}
          <div className="date-center">

            <span className="today-label">
              {currentDate === today
                ? '오늘'
                : `${getDayName(currentDate)}요일`}
            </span>

            <strong className="center-date">
              {formatDate(currentDate)}
            </strong>

            <span
              className={`current-duty duty ${currentDuty}`}
            >
              {currentDuty}
            </span>

          </div>

          {/* 내일 / 다음 날짜 */}
          <div className="date-side date-next">

            {nextDate && (
              <>
                <span className="side-date">
                  {formatDate(nextDate)}
                </span>

                <span className="side-day">
                  {getDayName(nextDate)}요일
                </span>

                <span
                  className={`side-duty duty ${dutyTable[nextDate]}`}
                >
                  {dutyTable[nextDate]}
                </span>
              </>
            )}

          </div>

          {/* 다음 버튼 */}
          <button
            className="date-arrow date-arrow-right"
            onClick={() => moveDate(1)}
            disabled={currentIndex === dates.length - 1}
            type="button"
          >
            ›
          </button>

        </div>

        {/* 현재 날짜 일정 */}
        <div
          className="schedule-card current-schedule"
          key={currentDate}
        >

          <div className="schedule-date">

            <strong>
              {currentDate}
            </strong>

            <span
              className={`duty ${currentDuty}`}
            >
              {currentDuty}
            </span>

          </div>

          <div className="schedule-items">

            {currentSchedule.map((item, index) => (

              <div
                className="schedule-item"
                key={index}
              >

                <span className="schedule-icon">
                  {item.type === 'sleep'
                    ? '😴'
                    : item.type === 'meal'
                    ? '🍚'
                    : item.type === 'prepare'
                    ? '🚿'
                    : '🏥'}
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

        <button onClick={onBack} type="button">
          듀티표 수정
        </button>

      </div>

    </div>
  )
}

export default ScheduleList