const mysql = require('mysql2/promise');
const pool = mysql.createPool({
	host: 'ochfonkunem.beget.app',
	user: 'default-db',
	database: 'default-db',
	password:'m2Y2BjzDL%ky',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});
const natural = require('natural');
const tokenizer = new natural.AggressiveTokenizerRu();
const classifier = new natural.BayesClassifier(natural.PorterStemmerRu);
const normalize=(text)=>{
	const words=tokenizer.tokenize(text.toLowerCase()).filter(w=>w.length>3).map(w=>natural.PorterStemmerRu.stem(w))//нормализую(убираю оканчания привожу в именительный падеж убираю короткие слова)
	return [...new Set(words)]//убираю дубли
}
const arrayCookingIndustries=async ()=>{
	let [rows]=await pool.query(`SELECT P.name AS pname,P.description AS pdescription, C.name,C.id_sub_ind,C.id_tech_3,C.description FROM products P
		INNER JOIN companies C ON C.id=P.id_company
 		group by P.name,P.description`)
	let max=0
	const sub_int_count=rows.reduce((p,c)=>{
		if(!Object.keys(p).includes(""+c.id_sub_ind)) p[""+c.id_sub_ind]=1
		else p[""+c.id_sub_ind]++
		if(p[""+c.id_sub_ind]>max) max=p[""+c.id_sub_ind]
		return p
	},{})
	return rows.reduce((p,c)=>{
		const description=normalize(c.pdescription+" "+c.description).join(" ")
		if(!Object.keys(p).includes(""+c.id_sub_ind)) p[""+c.id_sub_ind]=[description]
		else p[""+c.id_sub_ind].push(description)
		const step=Math.floor(max/sub_int_count[""+c.id_sub_ind])-1;
		for(let i=0;i<step;i++){
			p[""+c.id_sub_ind].push(description)
		}
		return p
	},{})
}

const startTrainIndustries = async ()=>{
	const rows=await arrayCookingIndustries()
	for(let index in rows){
		for (let row of rows[index]){
			classifier.addDocument(row, index);
		}
	}
	classifier.train();
	classifier.save('classifierIndustries.json', function(err, classifier) {
		console.log("classifier обучен")
	});
}
const arrayCookingTechnology=async ()=>{
	let [rows]=await pool.query(`SELECT P.name AS pname,P.description AS pdescription, C.name,C.id_sub_ind,C.id_tech_3,C.description FROM products P
		INNER JOIN companies C ON C.id=P.id_company
 		group by P.name,P.description`)
	let max=0
	const sub_tech_count=rows.reduce((p,c)=>{
		if(!Object.keys(p).includes(""+c.id_tech_3)) p[""+c.id_tech_3]=1
		else p[""+c.id_tech_3]++
		if(p[""+c.id_tech_3]>max) max=p[""+c.id_tech_3]
		return p
	},{})
	return rows.reduce((p,c)=>{
		const description=normalize(c.pdescription+" "+c.description).join(" ")
		if(!Object.keys(p).includes(""+c.id_tech_3)) p[""+c.id_tech_3]=[description]
		else p[""+c.id_tech_3].push(description)
		const step=Math.floor(max/sub_tech_count[""+c.id_tech_3])-1;
		for(let i=0;i<step;i++){
			p[""+c.id_tech_3].push(description)
		}
		return p
	},{})
}
const startTrainTechnology = async ()=>{
	const rows=await arrayCookingTechnology()
	for(let index in rows){
		for (let row of rows[index]){
			classifier.addDocument(row, index);
		}
	}
	classifier.train();
	classifier.save('classifierTechnology.json', function(err, classifier) {
		console.log("classifier обучен")
	});
}
//startTrainIndustries()
//startTrainTechnology()


