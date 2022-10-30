<template lang="pug">
.container
	.form-group.linkBack
		router-link(to="/")
			img.me-2(src="@/assets/images/back.svg")
			| Главная
	.row
		.col-12.d-flex.justify-content-center
			.loadMain
				h3 Загрузить файл
				p Формат файла .xlsx
				a.btn.w-100.text-center.mb-3(href="/CompanyExample.xlsx" download) Скачать пример файла
				label.btnSecondary.w-100.text-center(for="fileLoad") Загрузить файл
				input.d-none#fileLoad(type="file" @change="$_vision_load_getFile")
		.d-flex.justify-content-center.mt-5(v-if="spinner")
			.spinner-border.text-light
		div(v-if="result.load")
			h3.mb-3.mt-5 Полученный результат
			.loadResult
				.row
					.col-4.d-flex.text-center.flex-column
						h5 Найдено компаний
						p {{result.all}}
					.col-4.d-flex.text-center.flex-column
						h5 Верных отраслей ({{Math.floor(result.countTrueIndustries * 100 / result.all)}} %)
						p {{result.countTrueIndustries}}
					.col-4.d-flex.text-center.flex-column
						h5 Верных технологий ({{Math.floor(result.countTrueTechnology * 100 / result.all )}} %)
						p {{result.countTrueTechnology}}

</template>

<script>
	export default {
		data(){
			return{
				file: '',
				spinner: false,
				result: {
					load: false,
					all: 0,
					countTrueIndustries: 0,
					countTrueTechnology: 0
				}
			}
		},
		methods: {
			async $_vision_load_getFile(e){
				this.spinner = true
				this.result.load = false
				this.file = e.target.files
				const formData = new FormData()
				formData.append('file', this.file[0])
				const res = await this.$store.getters.request('POST', 'load', formData)
				if(!res.err){
					this.result = {
						load: true,
						all: res.countAll,
						countTrueIndustries: res.countTrueIndustries,
						countTrueTechnology: res.countTrueTechnology
					}
				}
				this.spinner = false
			}
		}
	}
</script>