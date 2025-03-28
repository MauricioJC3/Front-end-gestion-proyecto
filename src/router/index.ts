import Login from "@/modules/Auth/pages/loginPages.vue";
import { useAuthStore } from "@/modules/Auth/stores/auth";
import ProjectsAll from "@/modules/gestion_proyectos/pages/ProjectAllPages.vue";
import ProjectTags from "@/modules/gestion_proyectos/pages/ProjectTagsPages.vue";
import Projects from "@/modules/gestion_proyectos/pages/ProjectsPages.vue";
import Tasks from "@/modules/gestion_proyectos/pages/TasksPages.vue";
import pruebaPages from "@/modules/gestion_proyectos/pages/pruebaPages.vue";
import Cars from "@/views/CarsView.vue";
import Dashboard from "@/views/DashboardPages.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{ path: "/", component: Cars, name: "home" },
	{ path: "/login", component: Login, name: "Login" },
	{ path: "/cars", component: Cars, name: "Cars" },
	{
		path: "/dashboard",
		component: Dashboard,
		name: "Dashboard",
		meta: { requiresAuth: true }, // Ruta protegida
	},
	{
		path: "/projects",
		component: Projects,
		name: "Projects",
		meta: { requiresAuth: true },
	},
	{
		path: "/tags",
		component: ProjectTags,
		name: "Tags",
		meta: { requiresAuth: true },
	},
	{
		path: "/tasks",
		component: Tasks,
		name: "tasks",
		meta: { requiresAuth: true },
	},
	{
		path: "/projects/all",
		component: ProjectsAll,
		name: "projects-all",
		meta: { requiresAuth: true },
	},
	{
		path: "/prueba",
		component: pruebaPages,
		name: "prueba",
		meta: { requiresAuth: true },
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

// ✅ **Protección de rutas**
router.beforeEach((to, from, next) => {
	const auth = useAuthStore();

	if (to.meta.requiresAuth && !auth.token) {
		next("/"); // Redirigir al login si no está autenticado
	} else {
		next();
	}
});

export default router;
