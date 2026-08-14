// 시간을 분으로 변환
export const timeToMinutes = (time) => {
  const [hour, minute] = time.split(':').map(Number)

  return hour * 60 + minute
}


// 분을 시간으로 변환
export const minutesToTime = (minutes) => {
  minutes = ((minutes % 1440) + 1440) % 1440

  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}


// 듀티에 따른 일정 생성
export const createSchedule = ({
  duty,
  dutyTimes,
  mealCount = 2,
  prepareTime = 1,
  sleepHours = 7,
  sleepMinutes = 30,
}) => {

  // -----------------------------
  // OFF
  // -----------------------------
  if (duty === 'OFF' || duty === 'off') {

    const totalSleepMinutes =
      Number(sleepHours) * 60 +
      Number(sleepMinutes)

    const schedule = []

    // OFF에서는 목표 수면시간을 기준으로 계산
    const sleepEnd = 7 * 60 + 30
    const sleepStart = sleepEnd - totalSleepMinutes

    schedule.push({
      type: 'sleep',
      title: '수면',
      start: minutesToTime(sleepStart),
      end: minutesToTime(sleepEnd),
    })


    // 식사 1회
    if (mealCount >= 1) {
      schedule.push({
        type: 'meal',
        title: '식사',
        start: '12:00',
        end: '12:30',
      })
    }


    // 식사 2회
    if (mealCount >= 2) {
      schedule.push({
        type: 'meal',
        title: '식사',
        start: '18:00',
        end: '18:30',
      })
    }


    // 식사 3회
    if (mealCount >= 3) {
      schedule.push({
        type: 'meal',
        title: '식사',
        start: '08:00',
        end: '08:30',
      })
    }


    return schedule
  }


  // -----------------------------
  // 근무시간
  // -----------------------------
  if (!dutyTimes || !dutyTimes[duty]) {
    return []
  }


  const workStart = dutyTimes[duty].start
  const workEnd = dutyTimes[duty].end


  const workStartMinutes =
    timeToMinutes(workStart)


  let workEndMinutes =
    timeToMinutes(workEnd)


  // 야간근무
  if (workEndMinutes <= workStartMinutes) {
    workEndMinutes += 1440
  }


  // -----------------------------
  // 설정값
  // -----------------------------
  const prepareMinutes =
    Number(prepareTime) * 60


  const totalSleepMinutes =
    Number(sleepHours) * 60 +
    Number(sleepMinutes)


  const mealMinutes = 30


  // -----------------------------
  // 출근 준비
  // -----------------------------
  const prepareStart =
    workStartMinutes - prepareMinutes


  // -----------------------------
  // 출근 전 식사
  // -----------------------------
  const beforeMealEnd =
    prepareStart


  const beforeMealStart =
    beforeMealEnd - mealMinutes


  // -----------------------------
  // 수면
  // -----------------------------
  const sleepEnd =
    beforeMealStart


  const sleepStart =
    sleepEnd - totalSleepMinutes


  // -----------------------------
  // 일정
  // -----------------------------
  const schedule = []


  // 수면
  schedule.push({
    type: 'sleep',
    title: '수면',
    start: minutesToTime(sleepStart),
    end: minutesToTime(sleepEnd),
  })


  // -----------------------------
  // 식사 횟수에 따른 일정
  // -----------------------------

  if (mealCount >= 1) {
    schedule.push({
      type: 'meal',
      title: '출근 전 식사',
      start: minutesToTime(beforeMealStart),
      end: minutesToTime(beforeMealEnd),
    })
  }


  // 출근 준비
  schedule.push({
    type: 'prepare',
    title: '출근 준비',
    start: minutesToTime(prepareStart),
    end: minutesToTime(workStartMinutes),
  })


  // 근무
  schedule.push({
    type: 'work',
    title: '근무',
    start: minutesToTime(workStartMinutes),
    end: minutesToTime(workEndMinutes),
  })


  // 퇴근 후 식사
  if (mealCount >= 2) {

    const afterMealStart =
      workEndMinutes + 30

    const afterMealEnd =
      afterMealStart + mealMinutes

    schedule.push({
      type: 'meal',
      title: '퇴근 후 식사',
      start: minutesToTime(afterMealStart),
      end: minutesToTime(afterMealEnd),
    })
  }


  // 세 끼
  if (mealCount >= 3) {

    const thirdMealStart =
      workEndMinutes + 120

    const thirdMealEnd =
      thirdMealStart + mealMinutes

    schedule.push({
      type: 'meal',
      title: '식사',
      start: minutesToTime(thirdMealStart),
      end: minutesToTime(thirdMealEnd),
    })
  }


  return schedule
}