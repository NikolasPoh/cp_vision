const xlsx = require("node-xlsx");

module.exports = class Technology{
	constructor(file,fileList,pool,xlsx,listTechnology={}) {
		this.pool=pool;
		this.file=file;
		this.fileList=fileList;
		this.xlsx=xlsx;
	}
	async loadListFile(){
		const listTechnology = this.xlsx.parse(this.fileList);
		listTechnology[0].data.shift();
		listTechnology[0].data.shift();
		for (let technology of listTechnology[0].data){
			if(technology[1]){
				if(!Object.keys(this.listTechnology).includes(technology[1])){
					this.listTechnology[technology[1]]={}
					this.listTechnology[technology[1]][technology[3]]=[technology[5]]
				}else if(!Object.keys(this.listTechnology[technology[1]]).includes(technology[3])){
					this.listTechnology[technology[1]][technology[3]]=[technology[5]]
				}else if(!this.listTechnology[technology[1]][technology[3]].includes(technology[5])){
					this.listTechnology[technology[1]][technology[3]].push(technology[5])
				}
			}
		}
	}
	normalize(text){
		return text.replace("  "," ").trim().toLowerCase()
	}
	async loadListSQL(){
		let [rows]=await this.pool.query(`SELECT id,name,parent FROM list_technology`)
		rows=rows.reduce((p,c)=>{
			p[this.normalize(c.name)]=c.id
			return p
		},{})
		this.listTechnology=rows;
	}
	async loadFile(){
		const technologyProduct = xlsx.parse(this.file);
		technologyProduct[0].data.shift();
		for(let technology of technologyProduct[0].data){
			let data=technology
			if(Object.keys(this.listTechnology).includes(this.normalize(data[2])))data[2]=this.listTechnology[this.normalize(data[2])]
			if(Object.keys(this.listTechnology).includes(this.normalize(data[3])))data[3]=this.listTechnology[this.normalize(data[3])]
			if(Object.keys(this.listTechnology).includes(this.normalize(data[4])))data[4]=this.listTechnology[this.normalize(data[4])]
			await this.pool.query(`INSERT INTO product_technology (id_company,id_product,id_technology1,id_technology2,id_technology3)
					VALUES (${data[0]},${data[1]},${data[2]},${data[3]},${data[4]})`)
		}

	}
	async saveList(){

		for (let technology1 of Object.keys(this.listTechnology)){
			const [reqT1]=await this.pool.query(`INSERT INTO list_technology (name,parent)
				VALUES ('${technology1}',0)`)
			for (let technology2 of Object.keys(this.listTechnology[technology1])){
				const [reqT2]=await this.pool.query(`INSERT INTO list_technology (name,parent)
					VALUES ('${technology2}',${reqT1.insertId})`)
				for(let technology3 of this.listTechnology[technology1][technology2]){
					await this.pool.query(`INSERT INTO list_technology (name,parent)
						VALUES ('${technology3}',${reqT2.insertId})`)
				}
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
