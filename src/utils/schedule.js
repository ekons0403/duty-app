// 시간을 분으로 변환
export const timeToMinutes=(time)=>{
  const [hour,minute]=time.split(':').map(Number)
  return hour*60+minute
}

// 분을 시간으로 변환
export const minutesToTime=(minutes)=>{
  minutes=((minutes%1440)+1440)%1440
  const hour=Math.floor(minutes/60)
  const minute=minutes%60
  return `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`
}

// 듀티에 따른 일정 생성
export const createSchedule=({
  duty,
  dutyTimes,
  prepareTime,
  sleepHours,
  sleepMinutes,
})=>{
  // OFF
  if(duty==='OFF'||duty==='off'){
    return[
      {
        type:'sleep',
        title:'수면',
        start:'00:00',
        end:'07:30',
      },
      {
        type:'meal',
        title:'식사',
        start:'12:00',
        end:'12:30',
      },
      {
        type:'meal',
        title:'식사',
        start:'18:00',
        end:'18:30',
      },
    ]
  }

  const workStart=dutyTimes[duty].start
  const workEnd=dutyTimes[duty].end

  const workStartMinutes=timeToMinutes(workStart)

  let workEndMinutes=timeToMinutes(workEnd)

  // 야간근무처럼 다음날로 넘어가는 경우
  if(workEndMinutes<=workStartMinutes){
    workEndMinutes+=1440
  }

  const prepareMinutes=prepareTime*60
  const mealMinutes=30
  const totalSleepMinutes=sleepHours*60+sleepMinutes

  // 출근 준비
  const prepareStart=workStartMinutes-prepareMinutes

  // 출근 전 식사
  const beforeMealStart=prepareStart-mealMinutes

  // 퇴근 후 식사
  const afterMealStart=workEndMinutes+30
  const afterMealEnd=afterMealStart+mealMinutes

  // 수면
  const sleepEnd=beforeMealStart
  const sleepStart=sleepEnd-totalSleepMinutes

  return[
    {
      type:'sleep',
      title:'수면',
      start:minutesToTime(sleepStart),
      end:minutesToTime(sleepEnd),
    },
    {
      type:'meal',
      title:'출근 전 식사',
      start:minutesToTime(beforeMealStart),
      end:minutesToTime(prepareStart),
    },
    {
      type:'prepare',
      title:'출근 준비',
      start:minutesToTime(prepareStart),
      end:workStart,
    },
    {
      type:'work',
      title:'근무',
      start:workStart,
      end:workEnd,
    },
    {
      type:'meal',
      title:'퇴근 후 식사',
      start:minutesToTime(afterMealStart),
      end:minutesToTime(afterMealEnd),
    },
  ]
}