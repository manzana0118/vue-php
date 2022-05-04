import { createRouter, createWebHistory } from "vue-router";
import HomeView from '@/pages/HomeView.vue';
import CreateView from '@/pages/CreateView.vue';
import UpdateView from '@/pages/UpdateView.vue';
import ListView from '@/pages/ListView.vue';
import AboutView from '@/pages/AboutView.vue';
import DetailView from '@/pages/DetailView.vue';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/vue-php/',
            name: 'Home',
            component: HomeView
        },
        {
            path: '/vue-php/create',
            name: 'Create',
            component: CreateView
        },
        {
            path: '/vue-php/update/:id',
            name: 'Update',
            component: UpdateView
        },
        {
            path: '/vue-php/detail/:id',
            name: 'Detail',
            component: DetailView
        },
        {
            path: '/vue-php/list',
            name: 'List',
            component: ListView
        },
        {
            path: '/vue-php/about',
            name: 'About',
            component: AboutView
        }
    ],
});
export default router;