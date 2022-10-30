
const xlsx = require("node-xlsx");

module.exports = class Products{
	constructor(file,pool,xlsx) {
		this.pool=pool;
		this.file=file;
		this.xlsx=xlsx;
	}
	normalize(text){
		return text.replace("  "," ").trim().toLowerCase()
	}
	async loadFile(){
		const products = this.xlsx.parse(this.file);
		products[0].data.shift();
		products[0].data.shift();
		for(let p of products[0].data){
			await this.pool.query(`INSERT INTO products (id_company,id,name,okpd,description)
					VALUES (?,?,?,?,?)`,[p[0],p[1],p[2],JSON.stringify([p[3],p[4],p[5],p[6],p[7],p[8],p[9],p[10]]),p[11]])
		}

	}
	async start(listIndustries,listTechnology){
		await this.loadFile()
	}
}