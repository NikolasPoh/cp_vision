<template lang="pug">
.container-fluid
	.form-group.linkBack
		router-link(to="/")
			img.me-2(src="@/assets/images/back.svg")
			| Назад
	.companyPageMain.row
		.col-12.col-md-4
			.companyPageInfo
				h3 {{company.name}}
				.form-group
					label.boldText О компании
					p.companyPageDescription {{company.description}}
				.form-group
					label.boldText Сайт
					br
					a(:href="company.site") {{company.site}}
				.form-group
					label.boldText GROBAL_ID
					p.companyPageDescription {{company.id}}
		.col-12.col-md-8
			.companyPageMatch
				.matchHead
					h3 Данные о компании
					.notifWarn(v-if="company.id_rek_sub_ind.length || company.id_rek_tech_3.length") Исправьте несоответствия
				.form-group
					p Источник парсинга -
						a(:href="company.site") {{company.site}}
				.matchTitles.row
					.col-3 Исходные данные
					.col-3 Найденные несоответствия
					.col-3 Данные с парсера (Бета)
					.col-3 Статус
				.matchMistake
					VisitorCompanyMatchItem(@changeData="$_vision_company_index_savedChanges($event, 'id_ind')" :field="company.id_ind" :rekField="company.id_rek_sub_ind[0]" :parser="company.id_parser_sub_ind[0]" name="Отрасль")
					VisitorCompanyMatchItem(@changeData="$_vision_company_index_savedChanges($event, 'id_sub_ind')" :field="company.id_sub_ind" :rekField="company.id_rek_sub_ind[1]" :parser="company.id_parser_sub_ind[1]" name="Подотрасль")
					VisitorCompanyMatchItem(@changeData="$_vision_company_index_savedChanges('id_tech_1')" :field="company.id_tech_1" :rekField="company.id_rek_tech_3[0]" :parser="company.id_parser_tech_3[0]" name="Технология (1 уровень)")
					VisitorCompanyMatchItem(@changeData="$_vision_company_index_savedChanges" :field="company.id_tech_2" :rekField="company.id_rek_tech_3[1]" :parser="company.id_parser_tech_3[1]" name="Технология (2 уровень)")
					VisitorCompanyMatchItem(@changeData="$_vision_company_index_savedChanges" :field="company.id_tech_3" :rekField="company.id_rek_tech_3[2]" :parser="company.id_parser_tech_3[2]" name="Технология (3 уровень)")
			div
				button.btnSecondary Заменить все исходные данные на найденные
			.companyProducts
				.matchHead
					h3 Продукты компании
				VisitorCompanyCard(v-for="prod in products" :company="prod")


</template>

<script>
	import {defineAsyncComponent} from "vue";

	export default {
		data(){
			return{
				company: {
					id_rek_sub_ind: [],
					// id_rek_tech_3: [],
					id_parser_sub_ind: [],
					id_parser_tech_3: []
				},
				products: [],
			}
		},
		created() {
			this.$_vision_company_index_loadCompany()
		},
		components: {
			'VisitorCompanyMatchItem': defineAsyncComponent(() => import('@/components/company/VisitorCompanyMatchItem')),
			'VisitorCompanyCard': defineAsyncComponent(() => import('@/components/company/VisionCompanyCard')),
		},
		methods: {
			async $_vision_company_index_savedChanges(data, name){
				this.company[name] = data
				console.log(data, name)
				const id_pars_tech_3 = this.company.id_parser_tech_3.length ? this.company.id_parser_tech_3[2].id : null
				const id_pars_sub_ind = this.company.id_parser_sub_ind.length ? this.company.id_parser_sub_ind[1].id : null

				const formData = {
					id_ind: this.company.id_ind.id,
					id_sub_ind: this.company.id_sub_ind.id,
					id_tech_1: this.company.id_tech_1.id,
					id_tech_2: this.company.id_tech_2.id,
					id_tech_3: this.company.id_tech_3.id,
					id_rek_sub_ind: null,
					id_rek_tech_3: null,
					id_parser_sub_ind: id_pars_sub_ind,
					id_parser_tech_3: id_pars_tech_3
				}
				await this.$store.getters.request('PUT', 'company/' + this.$route.params.id, formData)
			},
			async $_vision_company_index_loadCompany(){
				const res = await this.$store.getters.request('GET', 'company/' + this.$route.params.id, {})
				if(!res.err){
					console.log(res)
					this.company = res.company
					this.products = res.products
				}
			}
		}
	}
</script>