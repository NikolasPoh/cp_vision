<template lang="pug">
.container
	.d-flex.flex-wrap.w-100
		.form-group
			router-link.btnSecondary.w-100(to="/load") Загрузить данные
		.form-group
			router-link.btnSecondary.ms-2.w-100(to="/parser") Парсинг сайта
	.companySearch
		.form-group
			input.form-control(type="search" v-model="search" @change="$_vision_index_searchCompany" placeholder="Поиск по названию или ID")
	.contentTabs
		.contentTabMistake
			.companyResult
				.notifError Всего компаний с несоответствиями найдено: {{lengthDouble.duble}}
				.notifSuccess.ms-3 Всего компаний: {{lengthDouble.orig}}
			.companyListMain.row.g-2
				h1 Список компаний
				.companyListHead.row
					.companyTitleList.col-12.col-md-3 global_id
					.companyTitleList.col-12.col-md-8 Наименование поддержаной компании
				.companyList.col-12(v-for="comp in companies")
					VisitorCompanyCard(:company="comp" :double="true" v-if="comp.duble")
					VisitorCompanyCard(:company="comp" v-else)
				.companyList.col-12.text-center.mt-5(v-if="noSearch")
					h1 Поиск не дал результатов
		.contentTabMistake
			.companyResult.mt-5

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
				noSearch: false
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
						if(res.data.length){
							this.companies = this.companies.concat(res.data)
						} else this.noSearch = true
					}
				} else {
					this.noSearch = false
					this.lazyCount = 0
					this.companies = []
					this.$_vision_index_loadCompany()
				}

			}

		},
		components: {
			vSelect,
			'VisitorCompanyCard': defineAsyncComponent(() => import('@/components/company/VisionCompanyCard'))
		}
	}
</script>
