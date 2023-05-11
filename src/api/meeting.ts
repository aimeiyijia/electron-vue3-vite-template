import { $post } from '@/http/request'

export function httpPostJointJudgeMeeting(params) {
  return $post('/joint/meeting/list', params)
}
