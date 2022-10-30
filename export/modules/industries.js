const xlsx = require("node-xlsx");

module.exports = class Industries{
	constructor(file,fileList,pool,xlsx,listIndustries={}) {
		this.pool=pool;
		this.file=file;
		this.fileList=fileList;
		this.xlsx=xlsx;
	}
	normalize(text){
		return text.replace("  "," ").trim().toLowerCase()
	}
	async loadListFile(){
		const listIndustries = this.xlsx.parse(this.fileList);
		listIndustries[0].data.shift();
		listIndustries[0].data.shift();
		for (let industry of listIndustries[0].data){
			if(!Object.keys(this.listIndustries).includes(industry[0])){
				this.listIndustries[industry[0]]=[industry[1]]
			}else if(!this.listIndustries[industry[0]].includes(industry[1])){
				this.listIndustries[industry[0]].push(industry[1])
			}
		}
	}
	normalize(text){
		return text.replace("  "," ").trim().toLowerCase()
	}
	async loadListSQL(){
		let [rows]=await this.pool.query(`SELECT id,name,parent FROM list_industries`)
		rows=rows.reduce((p,c)=>{
			p[this.normalize(c.name)]=c.id
			return p
		},{})
		this.listIndustries=rows;
	}
	async loadFile(){
		const industriesProduct = xlsx.parse(this.file);
		industriesProduct[0].data.shift();
		for(let industry of industriesProduct[0].data){
			let data=industry
			if(Object.keys(this.listIndustries).includes(this.normalize(data[2])))data[2]=this.listIndustries[this.normalize(data[2])]
			if(Object.keys(this.listIndustries).includes(this.normalize(data[3])))data[3]=this.listIndustries[this.normalize(data[3])]
			await this.pool.query(`INSERT INTO product_industries (id_company,id_product,id_industry,id_sub_industry)
					VALUES (${data[0]},${data[1]},${data[2]},${data[3]})`)
		}

	}
	async saveList(){
		for (let industry of Object.keys(this.listIndustries)){
			const [req]=await this.pool.query(`INSERT INTO list_industries (name,parent)
				VALUES ('${industry}',0)`)
			for(let sub_industry of this.listIndustries[industry]){
				await this.pool.query(`INSERT INTO list_industries (name,parent)
					VALUES ('${sub_industry}',${req.insertId})`)
			}
		}
	}
	async start(){
		await this.loadListSQL()
		//await this.loadFile()
		//все что дальше для обновления БД
		//await this.loadListFile()
		//await this.saveList()
	}
}
