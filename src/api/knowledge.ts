import { $delete, $post, $put } from '@/http/request'

// 获取知识库列表总数统计
export function httpPostKnowledgeBaseCount(params) {
  return $post('/broke/KnowledgeBase/count', params)
}

// 获取知识库列表
export function httpPostKnowledgeBaseList(params) {
  return $post('/broke/KnowledgeBase/list', params)
}

// 获取知识库列表
export function httpPutKnowledgeBaseSave(params) {
  return $put('/broke/KnowledgeBase/save', params)
}

// 知识库列表数据删除
export function httpDeleteKnowledgeBaseDelete(params) {
  return $delete('/broke/KnowledgeBase/delete', params)
}

// 获取知识库详情
export function httpPostKnowledgeBaseDetail(params) {
  return $post('/broke/KnowledgeBase/queryKnowledgeBaseById', params)
}
