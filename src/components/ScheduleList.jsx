import { useEffect, useRef, useState } from 'react'
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

  const getTodayString = () => {
    const today = new Date()

    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const today = getTodayString()

  const findInitialIndex = () => {
    if (dates.length === 0) {
      return 0
    }

    const todayIndex = dates.indexOf(today)

    if (todayIndex !== -1) {
      return todayIndex
    }

    let closestIndex = 0

    dates.forEach((date, index) => {
      if (date <= today) {
        closestIndex = index
      }
    })

    return closestIndex
  }

  const [currentIndex, setCurrentIndex] = useState(
    findInitialIndex()
  )

  const [touchStartX, setTouchStartX] = useState(null)

  const [dragOffset, setDragOffset] = useState(0)

  const [isDragging, setIsDragging] = useState(false)

  const [slideDirection, setSlideDirection] = useState(null)

  const mouseStartX = useRef(null)

  /*
   * 듀티표가 변경되면 오늘 날짜를 다시 선택
   */
  useEffect(() => {
    if (dates.length === 0) {
      setCurrentIndex(0)
      return
    }

    const todayIndex = dates.indexOf(today)

    if (todayIndex !== -1) {
      setCurrentIndex(todayIndex)
    }
  }, [dutyTable])

  /*
   * 날짜 이동
   */
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

    setSlideDirection(
      amount > 0 ? 'next' : 'previous'
    )
  }

  /*
   * 날짜 표시
   */
  const formatDate = (date) => {
    if (!date) {
      return ''
    }

    const [, month, day] = date.split('-')

    return `${month}/${day}`
  }

  /*
   * 요일
   */
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

  /*
   * 모바일 터치 시작
   */
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX)
    setDragOffset(0)
    setIsDragging(true)
  }

  /*
   * 모바일 손가락 이동
   */
  const handleTouchMove = (e) => {
    if (touchStartX === null) {
      return
    }

    const currentX = e.touches[0].clientX
    const diff = currentX - touchStartX

    setDragOffset(diff)
  }

  /*
   * 모바일 터치 종료
   */
  const handleTouchEnd = () => {
    if (touchStartX === null) {
      return
    }

    const threshold = 70

    if (dragOffset <= -threshold) {
      moveDate(1)
    } else if (dragOffset >= threshold) {
      moveDate(-1)
    }

    setTouchStartX(null)
    setDragOffset(0)
    setIsDragging(false)
  }

  /*
   * PC 마우스 드래그 시작
   */
  const handleMouseDown = (e) => {
    e.preventDefault()

    mouseStartX.current = e.clientX

    setDragOffset(0)
    setIsDragging(true)
  }

  /*
   * PC 마우스 이동
   */
  const handleMouseMove = (e) => {
    if (mouseStartX.current === null) {
      return
    }

    const diff = e.clientX - mouseStartX.current

    setDragOffset(diff)
  }

  /*
   * PC 마우스 드래그 종료
   */
  const handleMouseUp = () => {
    if (mouseStartX.current === null) {
      return
    }

    const threshold = 70

    if (dragOffset <= -threshold) {
      moveDate(1)
    } else if (dragOffset >= threshold) {
      moveDate(-1)
    }

    mouseStartX.current = null

    setDragOffset(0)
    setIsDragging(false)
  }

  /*
   * 마우스가 카드 밖으로 나갔을 때
   */
  const handleMouseLeave = () => {
    if (mouseStartX.current !== null) {
      handleMouseUp()
    }
  }

  /*
   * 일정이 없는 경우
   */
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

          <button
            onClick={onBack}
            type="button"
          >
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

  const currentSchedule = createSchedule({
    duty: currentDuty,
    dutyTimes,
    prepareTime,
    sleepHours,
    sleepMinutes,
  })

  /*
   * 카드 이동 스타일
   */
  const cardStyle = {
    transform: `translateX(${dragOffset}px)`,
    transition: isDragging
      ? 'none'
      : 'transform 0.25s ease',
  }

  return (
    <div className="schedule-screen">

      <div className="schedule-box">

        <h1>생활 일정</h1>

        <p className="subtitle">
          듀티에 맞춰 자동으로 계산된 일정입니다.
        </p>

        {/* 날짜 영역 */}
        <div className="date-carousel">

          {/* 이전 */}
          <button
            className="date-arrow date-arrow-left"
            onClick={() => moveDate(-1)}
            disabled={currentIndex === 0}
            type="button"
          >
            ‹
          </button>

          {/* 이전 날짜 */}
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

          {/* 다음 날짜 */}
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

          {/* 다음 */}
          <button
            className="date-arrow date-arrow-right"
            onClick={() => moveDate(1)}
            disabled={currentIndex === dates.length - 1}
            type="button"
          >
            ›
          </button>

        </div>

        {/* 생활 일정 카드 */}
        <div
          className={`schedule-card-wrapper ${
            slideDirection === 'next'
              ? 'slide-next'
              : slideDirection === 'previous'
              ? 'slide-previous'
              : ''
          }`}
        >

          <div
            className={`schedule-card current-schedule ${
              isDragging ? 'dragging' : ''
            }`}
            style={cardStyle}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >

            {/* 카드 날짜 */}
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

            {/* 일정 */}
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

        </div>

        {/* 스와이프 안내 */}
        <p className="swipe-hint">
          ← 카드를 좌우로 밀어서 날짜를 변경하세요 →
        </p>

        <button
          onClick={onBack}
          type="button"
        >
          듀티표 수정
        </button>

      </div>

    </div>
  )
}

export default ScheduleList