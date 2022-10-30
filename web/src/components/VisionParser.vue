<template lang="pug">
.container
	.form-group.linkBack
		router-link(to="/")
			img.me-2(src="@/assets/images/back.svg")
			| Главная
	.row
		.col-12.d-flex.justify-content-center
			.loadMain
				h3 Спарсить сайт
				p Получить данные с сайта в виде таблицы
				label.form-label(for="linkPars") Ссылка на сайт (url)
				input.form-control#linkPars(type="text" v-model="link" placeholder="https://example.com/")
				button.btnSecondary.w-100.mt-3(@click="$_vision_load_toParseSite") Отправить
		.d-flex.justify-content-center.mt-5(v-if="spinner")
			.spinner-border.text-light
		div(v-if="result.load")
			h3.mb-3.mt-5 Полученный результат
			.loadResultParse
				.form-group
					h3 Полученное описание
					p {{result.html}}
				.form-group
					h3 Определённые отрасли
					p
						ul
							li(v-for="item in result.industries") ID: {{item.id}} --- {{item.name}}
				.form-group
					h3 Определённые технологии
					p
						ul
							li(v-for="item in result.tehnology") ID: {{item.id}} --- {{item.name}}
</template>

<script>
export default {
	data(){
		return{
			link: '',
			spinner: false,
			result: {
				load: false,
				html: '',
				industries: '',
				tehnology: ''
			}
		}
	},
	methods: {
		async $_vision_load_toParseSite(){
			this.spinner = true
			this.result = {
				load: false,
				html: '',
				industries:'',
				tehnology: ''
			}
			const res = await this.$store.getters.request('POST', 'parser', {url: this.link})
			if(!res.err){
				this.result = {
					load: true,
					html: res.html,
					industries: res.arrI,
					tehnology: res.arrT
				}
			}
		}
	}
}
</script>