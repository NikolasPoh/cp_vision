const routes = [
	{path: '/', component: () => import('@/components/VisionIndex')},
	{path: '/company/:id', component: () => import('@/components/company/VisionCompanyIndex')},
	{path: '/load', component: () => import('@/components/VisionLoadFile')}
]

export default routes