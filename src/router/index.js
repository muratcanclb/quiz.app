import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage.vue'
import QuestionsContent from '@/components/QuestionsContent.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage
    },
    {
      path: '/questions',
      name: 'QuestionsContent',
      component: QuestionsContent
    }
  ]
})