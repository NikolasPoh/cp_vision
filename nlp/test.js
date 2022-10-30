const mysql = require('mysql2/promise');
const pool = mysql.createPool({
	host: '62.113.100.29',
	user: 'convert',
	database: 'default-db',
	password:'Convert123ME!2',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});
const natural = require('natural');
const tokenizer = new natural.AggressiveTokenizerRu();
const normalize=(text)=>{
	const words=tokenizer.tokenize(text.toLowerCase()).filter(w=>w.length>3).map(w=>natural.PorterStemmerRu.stem(w))//нормализую(убираю оканчания привожу в именительный падеж убираю короткие слова)
	return [...new Set(words)]//убираю дубли
}

const start = async ()=>{
	let [rows]=await pool.query(`SELECT C.id,P.name AS pname,P.description AS pdescription, C.name,C.id_sub_ind,C.id_tech_3,C.description FROM products P
		INNER JOIN companies C ON C.id=P.id_company
 		group by P.name,P.description`)
	/*natural.BayesClassifier.load('classifierIndustries.json', natural.PorterStemmerRu, async function(err, classifier) {
		let countTrue=0
		for(let row of rows){
			const description=normalize(row.pdescription+" "+row.description).join(" ")
			const rec=classifier.classify(description)
			if(rec*1===row.id_sub_ind) countTrue++
			else{
				await pool.query(`UPDATE companies
					SET id_rek_sub_ind = ${rec} WHERE id=${row.id}`)
			}
		}
		console.log(Math.floor(countTrue/rows.length*100)+"%")
	});*/
	/*natural.BayesClassifier.load('classifierTechnology.json', natural.PorterStemmerRu, async function(err, classifier) {
		let countTrue=0
		for(let row of rows){
			const description=normalize(row.pdescription+" "+row.description).join(" ")
			const rec=classifier.classify(description)
			if(rec*1===row.id_tech_3) countTrue++
			else{
				await pool.query(`UPDATE companies
					SET id_rek_tech_3 = ${rec} WHERE id=${row.id}`)
			}
		}
		console.log(Math.floor(countTrue/rows.length*100)+"%")
	});*/
}
start()



