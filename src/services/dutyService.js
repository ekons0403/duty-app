// src/services/dutyService.js

import { supabase } from '../supabase'

// 현재 로그인한 사용자 가져오기
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

// 사용자의 듀티표 불러오기
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

// 듀티 저장
export const saveDutySchedule = async (
  date,
  duty
) => {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('로그인이 필요합니다.')
  }

  // 해당 날짜에 기존 데이터가 있는지 확인
  const { data: existing, error: findError } =
    await supabase
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