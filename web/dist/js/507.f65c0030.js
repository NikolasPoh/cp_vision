"use strict";(self["webpackChunkweb"]=self["webpackChunkweb"]||[]).push([[507],{1585:function(e,t,a){a.r(t),a.d(t,{default:function(){return j}});var s=a(3396),l=a(7139),i=a.p+"img/check.5a3ea9c2.svg",c=a.p+"img/cancel.6bdf6531.svg",r=a.p+"img/restore.92adbb00.svg";const o={class:"row matchItem"},n={class:"col-3"},d={class:"form-group"},_={class:"boldText"},m={class:"col-3"},h={class:"form-group"},u={class:"col-3"},p={class:"form-group position-relative"},g={class:"greyColor"},v={class:"col-3"},f={class:"matchControls"},k={class:"d-flex"},D={key:0,class:"d-flex"},b=(0,s._)("img",{src:i},null,-1),y=[b],F=(0,s._)("img",{src:c},null,-1),w=[F],$={key:1,class:"d-flex ms-2"};function C(e,t,a,i,c,b){return(0,s.wg)(),(0,s.iD)("div",o,[(0,s._)("div",n,[(0,s._)("div",d,[(0,s._)("label",_,(0,l.zw)(a.name),1),(0,s._)("p",{class:"greyColor",ref:"oldData"},(0,l.zw)(c.localField.name),513)])]),(0,s._)("div",m,[(0,s._)("div",h,[(0,s._)("p",{class:"greyColor",ref:"newData"},(0,l.zw)(c.localRekField.name?c.localRekField.name:c.localField.name),513)])]),(0,s._)("div",u,[(0,s._)("div",p,[(0,s._)("p",g,(0,l.zw)(a.parser.name),1)])]),(0,s._)("div",v,[(0,s._)("div",f,[(0,s._)("ul",k,[(0,s._)("li",{class:(0,l.C_)(["finalStatus",c.result.status])},(0,l.zw)(c.result.text),3),"error"===c.result.status?((0,s.wg)(),(0,s.iD)("div",D,[(0,s._)("button",{class:"btnCheck",title:"Заменить на исходные данные",onClick:t[0]||(t[0]=e=>b.$_vision_company_match_item_changeData(1))},y),(0,s._)("button",{class:"btnCancel",title:"Заменить на найденные данные",onClick:t[1]||(t[1]=e=>b.$_vision_company_match_item_changeData(0))},w)])):"check"===c.result.status?((0,s.wg)(),(0,s.iD)("div",$,[(0,s._)("img",{src:r,onClick:t[2]||(t[2]=(...e)=>b.$_vision_company_match_item_restoreData&&b.$_vision_company_match_item_restoreData(...e))})])):(0,s.kq)("",!0)])])])])}var x={emits:["changeData"],props:{field:{type:Object,default(){return{name:"",id:0}}},rekField:{type:Object,default(){return{name:"",id:0}}},parser:{type:Object,default(){return{name:"",id:0}}},name:String},data(){return{result:{status:"good",text:"Всё в порядке"},savedData:{},localField:this.$props.field,localRekField:this.$props.rekField}},created(){this.$_vision_company_match_item_findResult()},methods:{$_vision_company_match_item_restoreData(){},$_vision_company_match_item_changeData(e){e?(this.$emit("changeData",this.localRekField),this.localRekField=null,this.$refs.oldData.classList.add("change")):(this.$emit("changeData",this.localField),this.localField=this.localRekField,this.localRekField=null),this.result.status="check",this.result.text="Изменено",this.$emit("changeData")},$_vision_company_match_item_findResult(){this.rekField.id?this.rekField.id!==this.field.id&&(this.result.status="error",this.result.text="Несоответствие"):(this.result.status="good",this.result.text="Всё в порядке")}}},R=a(89);const z=(0,R.Z)(x,[["render",C]]);var j=z}}]);
//# sourceMappingURL=507.f65c0030.js.map