import { AppConfig } from '@/configs/AppConfig'
import http from '../utils/http'

export const GetnavigationTrackApi = (
  route: string,
  dep: string,
  arr: string
) => {
  return http.get(AppConfig.api + '/get/navigation/track', {
    params: {
      route: route,
      dep: dep,
      arr: arr
    },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    timeout: 10000
  })
}

export const GetFlightTrackApi = (flightCall: string, userCall: string) => {
  return http.get<{
    Data: string[]
  }>(AppConfig.api + '/flight/track', {
    params: {
      flightCall: flightCall,
      userCall: userCall
    },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    timeout: 10000
  })
}
