<template lang="pug">
.row.matchItem
	.col-12.col-md-12.col-lg-3
		.form-group
			label.boldText {{name}}
			p.greyColor(ref="oldData") {{localField.name}}
	.col-12.col-md-12.col-lg-3
		.form-group
			p.greyColor(ref="newData") {{ localRekField.name ? localRekField.name : localField.name}}
	.col-12.col-md-12.col-lg-3
		.form-group.position-relative
			p.greyColor {{parser.name}}
	.col-12.col-md-12.col-lg-3
		.matchControls
			ul.d-flex
				li.finalStatus(:class="result.status") {{result.text}}
				.d-flex(v-if="result.status==='error'")
					button.btnCheck(title="Заменить на исходные данные" @click="$_vision_company_match_item_changeData(1)")
						img(src="@/assets/images/check.svg")
					button.btnCancel(title="Заменить на найденные данные" @click="$_vision_company_match_item_changeData(0)")
						img(src="@/assets/images/cancel.svg")
				.d-flex.ms-2(v-else-if="result.status==='check'")
					img(src="@/assets/images/restore.svg" @click="$_vision_company_match_item_restoreData")
</template>

<script>
	export default {
		emits: ['changeData'],
		props: {
			field: {
				type: Object,
				default(){
					return {name:'', id:0}
				}
			},
			rekField: {
				type: Object,
				default(){
					return {name:'', id:0}
				}
			},
			parser: {
				type: Object,
				default(){
					return {name:'', id:0}
				}
			},
			name: String,
		},
		data(){
			return {
				result: {
					status: 'good',
					text: 'Всё в порядке'
				},
				savedData: {},
				localField: this.$props.field,
				localRekField: this.$props.rekField,
			}
		},
		created() {
			this.$_vision_company_match_item_findResult()
		},
		methods: {
			$_vision_company_match_item_restoreData(){

			},
			$_vision_company_match_item_changeData(type){
				if(type){
					this.$emit('changeData', this.localRekField)
					this.localRekField = null
					this.$refs.oldData.classList.add('change')
				} else {
					this.$emit('changeData', this.localField)
					this.localField = this.localRekField

					this.localRekField = null
				}
				this.result.status = 'check'
				this.result.text = 'Изменено'
				this.$emit('changeData')
			},
			$_vision_company_match_item_findResult(){
				if(!this.rekField.id){
					this.result.status = 'good'
					this.result.text = 'Всё в порядке'
				} else if(this.rekField.id !== this.field.id){
					this.result.status = 'error'
					this.result.text = 'Несоответствие'
				}
			}
		}
	}
</script>