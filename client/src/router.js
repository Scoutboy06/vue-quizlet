import { createRouter, createWebHistory } from 'vue-router';
import CreateDeck from './views/CreateDeck.vue';

const routes = [
	{ path: '/', template: '<h1>Home</h1>' },
	{ path: '/decks', template: '<h1>Decks</h1>' },
	{ path: '/create', component: CreateDeck },
];


const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
