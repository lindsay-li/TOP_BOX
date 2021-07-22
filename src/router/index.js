import Vue from 'vue'
import Router from 'vue-router'
const index = ()=>import('@/view/index')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/index'
    },
    {
      path: '/index',
      name:'index',
      component:index
    },
    {
      path:'/rule',
      name:'rule',
      component:()=>import('@/view/rule')
    },
    {
      path:'/myprize',
      name:'myprize',
      component:()=>import('@/view/myprize')
    },
    {
      path:'/game',
      name:'game',
      component:()=>import('@/view/game')
    }
  ]
})
