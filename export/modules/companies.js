module.exports = class Companies{
	constructor(file,pool,xlsx) {
		this.pool=pool;
		this.file=file;
		this.xlsx=xlsx;
	}
	normalize(text){
		return text.replace("  "," ").trim().toLowerCase()
	}
	async loadFile(){
		const companies = this.xlsx.parse(this.file);
		companies[0].data.shift();
		for(let company of companies[0].data){
			let data=company;
			if(Object.keys(this.listIndustries).includes(this.normalize(data[2])))data[2]=this.listIndustries[this.normalize(data[2])]
			if(Object.keys(this.listIndustries).includes(this.normalize(data[3])))data[3]=this.listIndustries[this.normalize(data[3])]
			if(Object.keys(this.listTechnology).includes(this.normalize(data[4])))data[4]=this.listTechnology[this.normalize(data[4])]
			if(Object.keys(this.listTechnology).includes(this.normalize(data[5])))data[5]=this.listTechnology[this.normalize(data[5])]
			if(Object.keys(this.listTechnology).includes(this.normalize(data[6])))data[6]=this.listTechnology[this.normalize(data[6])]
			if(data[5]==='Не указано')data[5]=0
			if(data[4]==='Не указано')data[4]=0
			if(data[6]==='Не указано')data[6]=0
			await this.pool.query(`INSERT INTO companies (id,name,id_ind,id_sub_ind,id_tech_1,id_tech_2,id_tech_3,site,description)
					VALUES (?)`,[data])
		}
	}
	async start(listIndustries,listTechnology){
		this.listIndustries=listIndustries
		this.listTechnology=listTechnology
		await this.loadFile()
	}
}