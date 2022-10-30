<template lang="pug">
.container
	.form-group
		router-link.btn(to="/load") Загрузить данные
	.companySearch
		.form-group
			input.form-control(type="search" v-model="search" @change="$_vision_index_searchCompany" placeholder="Поиск по названию или ID")
	.companyTabs.row.gx-2
		.col-6
			button.btnSecondary.w-100(@click="tab=0") Компании с несоответствиями
		.col-6
			button.btnSecondary.w-100(@click="tab=1") Правильные компании
	.contentTabs
		.contentTabMistake(v-if="!tab")
			.companyResult
				.notifError Всего компаний с несоответствиями найдено: {{lengthDouble.duble}}
				//button.btnSecondary Исправить все записи
			.companyListMain.row.g-2
				h1 Список компаний
				.companyListHead.row
					.companyTitleList.col-12.col-md-3 global_id
					.companyTitleList.col-12.col-md-8 Наименование поддержаной компании
				.companyList.col-12(v-for="comp in companies")
					VisitorCompanyCard(:company="comp" :double="true" v-if="comp.duble")
		.contentTabMistake(v-if="tab")
			.companyResult.mt-5
				.notifSuccess Всего компаний: {{lengthDouble.orig}}
			.companyListMain.row.g-2
				h1 Список компаний
				.companyListHead.row
					.companyTitleList.col-12.col-md-3 global_id
					.companyTitleList.col-12.col-md-8 Наименование поддержаной компании
				.companyList.col-12(v-for="comp in companies")
					VisitorCompanyCard(:company="comp" v-if="!comp.duble")
	button.btn(@click="$_vision_index_loadCompany()") Загрузить ещё
</template>

<script>
	import {defineAsyncComponent} from "vue"
	import vSelect from 'vue-select'

	export default {
		data(){
			return{
				tab: 0,
				search: '',
				lengthDouble: {},
				companies: [],
				lazyCount: 0,
				lazyCountSearch: 0,
			}
		},
		mounted() {
			this.$_vision_index_getCountDoubleCompanies()
			this.$_vision_index_loadCompany()
		},
		methods:{
			async $_vision_index_getCountDoubleCompanies(){
				const res = await this.$store.getters.request('GET', 'company/count', {})
				if(!res.err){
					this.lengthDouble = res.count
					console.log(res)
				}
			},
			async $_vision_index_loadCompany(){
				const res = await this.$store.getters.request('GET', 'company/all/'+this.lazyCount, {})
				if(!res.err){
					this.lazyCount = res.data[res.data.length-1].id
					if(res.data.filter(item => item.duble !== null).length <= 0){
						this.$_vision_index_loadCompany()
					} else {
						this.companies = this.companies.concat(res.data)
					}
				}
			},
			async $_vision_index_searchCompany(){
				if(this.search){
					this.lazyCountSearch = 0
					this.companies = []
					const res = await this.$store.getters.request('POST', 'company/'+this.lazyCountSearch, {search: this.search})
					if(!res.err){
						// this.lazyCountSearch = res.data[res.data.length-1].id
						this.companies = this.companies.concat(res.data)
					}
				} else this.$_vision_index_loadCompany()

			}

		},
		components: {
			vSelect,
			'VisitorCompanyCard': defineAsyncComponent(() => import('@/components/company/VisionCompanyCard'))
		}
	}
</script>
