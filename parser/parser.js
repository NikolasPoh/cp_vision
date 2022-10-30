import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';
import natural from "natural";
import mysql from 'mysql2/promise';
const pool = mysql.createPool({
    host: '62.113.100.29',
    user: 'convert',
    database: 'default-db',
    password:'Convert123ME!2',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

await Actor.init()
let titleAll=[]

const crawler = new PlaywrightCrawler({
    async requestHandler({ request, page, enqueueLinks }) {
        const body = await page.innerText('body')
        titleAll.push(body)
        await enqueueLinks();
    },
    maxRequestsPerCrawl: 1,
});
const start=async ()=>{
    let [rows]=await pool.query(`SELECT id,id_sub_ind,id_tech_3,site FROM companies WHERE ISNULL(id_parser_tech_3) OR id_parser_tech_3=90`)
    for(let row of rows){
        titleAll=[]
        await crawler.run([row.site]);
        const tokenizer = new natural.AggressiveTokenizerRu();
        const normalize=(text)=>{
            const words=tokenizer.tokenize(text.toLowerCase()).filter(w=>w.length>3).map(w=>natural.PorterStemmerRu.stem(w))//нормализую(убираю оканчания привожу в именительный падеж убираю короткие слова)
            return [...new Set(words)]//убираю дубли
        }
        await new Promise((res)=>{
            natural.BayesClassifier.load('../nlp/classifierIndustries.json', natural.PorterStemmerRu, async function(err, classifier) {
                const description=normalize(titleAll.join(" ")).join(" ")
                const rec=classifier.classify(description)
                if(row.id_sub_ind!==rec*1){
                    await pool.query(`UPDATE companies
                        SET id_parser_sub_ind = ${rec} WHERE id=${row.id}`)
                }
                res();
        })})
        await new Promise((res)=>{
            natural.BayesClassifier.load('../nlp/classifierTechnology.json', natural.PorterStemmerRu, async function(err, classifier) {
                const description=normalize(titleAll.join(" ")).join(" ")
                const rec=classifier.classify(description)
                if(row.id_tech_3!==rec*1){
                    await pool.query(`UPDATE companies
					    SET id_parser_tech_3 = ${rec} WHERE id=${row.id}`)
                }
                res();
            })
        })
    }
    await Actor.exit();
}
await start()




