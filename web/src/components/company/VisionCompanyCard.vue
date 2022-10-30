<template lang="pug">
.companyCardMain(v-if="double")
	.companyCard.collapsed.row(data-bs-toggle="collapse" :data-bs-target="'#collapse-1-'+company.id")
		.companyId.col-12.col-md-3
		.companyName.col-11.col-md-8 {{company.name}}
			b.redColor(v-if="company.rek_sub || company.rek_tech")  (Есть несоответствия)
			b.redColor  (Найдены дубликаты)
		.col-1.arrowCollapse
			img(src="@/assets/images/arrowCollapse.svg")
	hr
	.collapse(:id="'collapse-1-'+company.id")
		.companyCardMatched.row
			.companyId.col-12.col-md-3 ID: {{company.id}}
			.companyName.col-9.col-md-6 {{company.name}}
			.col-3.col-md-3.d-flex.justify-content-end.align-content-center
				b.showMore
					router-link(:to="'/company/'+company.id") Подробнее
				img.arrowLink(src="@/assets/images/arrowLink.svg")
		.companyCardMatched.row(v-for="double in company.duble.split(',')")
			.companyId.col-12.col-md-3 ID: {{double}}
			.companyName.col-9.col-md-6 {{company.name}}
			.col-3.col-md-3.d-flex.justify-content-end.align-content-center
				b.showMore
					router-link(:to="'/company/'+double") Подробнее
				img.arrowLink(src="@/assets/images/arrowLink.svg")
		hr
.companyCardMain(v-else)
	.companyCardMatched.row
		.companyId.col-12.col-md-3 ID: {{company.id}}
		.companyName.col-9.col-md-6 {{company.name}}
			b.redColor(v-if="company.rek_sub || company.rek_tech")  (Есть несоответствия)
		.col-3.col-md-3.d-flex.justify-content-end.align-content-center
			b.showMore
				router-link(:to="'/company/'+company.id" v-if="!company.id_company") Подробнее
				router-link(:to="'/product/'+company.id" v-else) Подробнее
			img.arrowLink(src="@/assets/images/arrowLink.svg")
	hr
</template>

<script>
	export default {
		props: {
			name: String,
			company: Object,
			double: {
				type: Boolean,
				default: false
			},
		}
	}
</script>