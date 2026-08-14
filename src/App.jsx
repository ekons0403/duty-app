import {useEffect,useState} from 'react'
import {supabase} from './supabase'
import Auth from './components/Auth'
import Settings from './components/Settings'
import DutyTimeSettings from './components/DutyTimeSettings'
import Calendar from './components/Calendar'
import ScheduleList from './components/ScheduleList'
import AccountPanel from './components/AccountPanel'
import {loadDutySchedules,saveDutySchedule,loadUserSettings,saveUserSettings,} from './services/dutyService'
import './styles/main.css'
import './App.css'

function App(){
  const [session,setSession]=useState(null)
  const [step,setStep]=useState(1)
  const [mealCount,setMealCount]=useState(2)
  const [prepareTime,setPrepareTime]=useState(1)
  const [sleepHours,setSleepHours]=useState(7)
  const [sleepMinutes,setSleepMinutes]=useState(30)

  const [dutyTimes,setDutyTimes]=useState({
    D:{start:'06:00',end:'15:00'},
    E:{start:'14:00',end:'23:00'},
    N:{start:'22:00',end:'07:00'}
  })

  const [currentDate,setCurrentDate]=useState(new Date())
  const [dutyTable,setDutyTable]=useState({})
  const [accountOpen,setAccountOpen]=useState(false)

  useEffect(()=>{
    const initialize=async()=>{
      const {data:{session}}=await supabase.auth.getSession()
      setSession(session)

      if(session){
        try{
          const schedules = await loadDutySchedules()
          setDutyTable(schedules)

          const settings = await loadUserSettings()

          if(settings){
            setMealCount(settings.mealCount)
            setPrepareTime(settings.prepareTime)
            setSleepHours(settings.sleepHours)
            setSleepMinutes(settings.sleepMinutes)
          }
        }catch(error){
          console.error('데이터 불러오기 실패:',error)
        }
      }
    }

    initialize()

    const {data:{subscription}}=supabase.auth.onAuthStateChange(
      (_event,session)=>{
        setSession(session)
      }
    )

    return()=>subscription.unsubscribe()
  },[])

  const handleLogin=async(email,password)=>{
    if(!email||!password)return alert('이메일과 비밀번호를 입력해주세요.')

    const {data,error}=await supabase.auth.signInWithPassword({email,password})

    if(error)return alert(error.message)

    setSession(data.session)

    try{
      const schedules = await loadDutySchedules()
      setDutyTable(schedules)

      const settings = await loadUserSettings()

      if(settings){
        setMealCount(settings.mealCount)
        setPrepareTime(settings.prepareTime)
        setSleepHours(settings.sleepHours)
        setSleepMinutes(settings.sleepMinutes)
      }
    }catch(error){
      console.error('데이터 불러오기 실패:',error)
    }

    setStep(1)
  }

  const handleSignUp=async(email,password)=>{
    if(!email||!password)return alert('이메일과 비밀번호를 입력해주세요.')
    if(password.length<6)return alert('비밀번호는 6자리 이상 입력해주세요.')

    const {error}=await supabase.auth.signUp({email,password})

    if(error)return alert(error.message)

    alert('회원가입 요청이 완료되었습니다.')
  }

  const handleLogout=async()=>{
    await supabase.auth.signOut()
    setSession(null)
    setDutyTable({})
    setAccountOpen(false)
    setStep(1)
  }

  const handleDutyTimeChange=(duty,type,value)=>{
    setDutyTimes(prev=>({
      ...prev,
      [duty]:{
        ...prev[duty],
        [type]:value
      }
    }))
  }

  const handleDutySelect=async(date,duty)=>{
    setDutyTable(prev=>({
      ...prev,
      [date]:duty
    }))

    try{
      await saveDutySchedule(date,duty)
    }catch(error){
      console.error('일정 저장 실패:',error)
      alert('일정 저장에 실패했습니다.')
    }
  }

  const handleMonthChange=amount=>{
    setCurrentDate(prev=>new Date(
      prev.getFullYear(),
      prev.getMonth()+amount,
      1
    ))
  }

  if(!session){
    return <Auth onLogin={handleLogin} onSignUp={handleSignUp}/>
  }

  const handleSettingsNext = async () => {
      try {
        await saveUserSettings({
          mealCount,
          prepareTime,
          sleepHours,
          sleepMinutes,
        })

        setStep(2)
      } catch(error) {
        console.error('생활 설정 저장 실패:', error)
        alert('생활 설정 저장에 실패했습니다.')
      }
    }

  return(
    <div className="app">
      <div className="card">
        <AccountPanel
          session={session}
          open={accountOpen}
          onClose={()=>setAccountOpen(!accountOpen)}
          onLogout={handleLogout}
          onNavigate={setStep}
        />

        {step===1&&(
          <Settings
            mealCount={mealCount}
            setMealCount={setMealCount}
            prepareTime={prepareTime}
            setPrepareTime={setPrepareTime}
            sleepHours={sleepHours}
            setSleepHours={setSleepHours}
            sleepMinutes={sleepMinutes}
            setSleepMinutes={setSleepMinutes}
            onNext={handleSettingsNext}
          />
        )}

        {step===2&&(
          <DutyTimeSettings
            dutyTimes={dutyTimes}
            onChange={handleDutyTimeChange}
            onNext={()=>setStep(3)}
            onBack={()=>setStep(1)}
          />
        )}

        {step===3&&(
          <Calendar
            currentDate={currentDate}
            dutyTable={dutyTable}
            onMonthChange={handleMonthChange}
            onDutySelect={handleDutySelect}
            onGenerate={()=>setStep(4)}
            onSettings={()=>setStep(2)}
          />
        )}

        {step===4&&(
          <ScheduleList
            dutyTable={dutyTable}
            dutyTimes={dutyTimes}
            mealCount={mealCount}
            prepareTime={prepareTime}
            sleepHours={sleepHours}
            sleepMinutes={sleepMinutes}
            onBack={()=>setStep(3)}
          />
        )}
      </div>
    </div>
  )
}

export default App