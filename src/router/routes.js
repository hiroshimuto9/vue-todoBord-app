import TDBBoardView from '@/components/templates/TDBBoardView.vue'
import TDBLoginView from '@/components/templates/TDBLoginView.vue'
import TDBTaskDetailModal from '@/components/templates/TDBTaskDetailModal.vue'

export default [{
  path: '/',
  component: TDBBoardView,
  meta: { requireAuth: true },
},{
  path: '/login',
  component: TDBLoginView,
},{
  path: '/tasks/:id',
  component: TDBTaskDetailModal,
  meta: { requireAuth: true },
},{
  path: '*',
  redirect: '/',
}]