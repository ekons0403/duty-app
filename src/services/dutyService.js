// src/services/dutyService.js

import { supabase } from '../supabase'


// ========================================
// 현재 로그인한 사용자 가져오기
// ========================================

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('사용자 확인 실패:', error)
    return null
  }

  return user
}


// ========================================
// 사용자의 듀티표 불러오기
// ========================================

export const loadDutySchedules = async () => {
  const user = await getCurrentUser()

  if (!user) {
    return {}
  }

  const { data, error } = await supabase
    .from('duty_schedules')
    .select('date, duty')
    .eq('user_id', user.id)

  if (error) {
    console.error('듀티표 불러오기 실패:', error)
    throw error
  }

  const schedules = {}

  data.forEach((item) => {
    schedules[item.date] = item.duty
  })

  return schedules
}


// ========================================
// 듀티 저장
// ========================================

export const saveDutySchedule = async (date, duty) => {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('로그인이 필요합니다.')
  }

  const {
    data: existing,
    error: findError,
  } = await supabase
    .from('duty_schedules')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', date)
    .maybeSingle()

  if (findError) {
    throw findError
  }

  // 기존 데이터가 있으면 수정
  if (existing) {
    const { error } = await supabase
      .from('duty_schedules')
      .update({
        duty,
      })
      .eq('id', existing.id)

    if (error) {
      throw error
    }

    return
  }

  // 없으면 새로 저장
  const { error } = await supabase
    .from('duty_schedules')
    .insert({
      user_id: user.id,
      date,
      duty,
    })

  if (error) {
    throw error
  }
}


// ========================================
// 생활 설정 불러오기
// ========================================

export const loadUserSettings = async () => {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('user_settings')
    .select(
      'meal_count, prepare_time, sleep_hours, sleep_minutes'
    )
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('생활 설정 불러오기 실패:', error)
    throw error
  }

  if (!data) {
    return null
  }

  return {
    mealCount: data.meal_count,
    prepareTime: data.prepare_time,
    sleepHours: data.sleep_hours,
    sleepMinutes: data.sleep_minutes,
  }
}


// ========================================
// 생활 설정 저장
// ========================================

export const saveUserSettings = async ({
  mealCount,
  prepareTime,
  sleepHours,
  sleepMinutes,
}) => {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('로그인이 필요합니다.')
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert(
      {
        user_id: user.id,
        meal_count: mealCount,
        prepare_time: prepareTime,
        sleep_hours: sleepHours,
        sleep_minutes: sleepMinutes,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      }
    )

  if (error) {
    console.error('생활 설정 저장 실패:', error)
    throw error
  }
}