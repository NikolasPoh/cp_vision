const xlsx = require('node-xlsx');
const mysql = require('mysql2/promise');
const Industries=require('./modules/industries')
const Technology=require('./modules/technology')
const Companies=require('./modules/companies')
const Products=require('./modules/product')
const pool = mysql.createPool({
	host: '62.113.100.29',
	user: 'convert',
	database: 'default-db',
	password:'Convert123ME!2',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

const industries=new Industries('./dataset/industries.xlsx','./dataset/listIndustries.xlsx',pool,xlsx)
const technology=new Technology('./dataset/technology.xlsx','./dataset/listTechnology.xlsx',pool,xlsx)
const companies=new Companies('./dataset/company.xlsx',pool,xlsx)
const products=new Products('./dataset/product.xlsx',pool,xlsx)

const start=async ()=>{
	await industries.start()
	await technology.start()
	//await companies.start(industries.listIndustries,technology.listTechnology)
	//await products.start(industries.listIndustries,technology.listTechnology)
}
start()

