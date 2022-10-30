const Joi = require('joi');
const natural = require('natural');
const xlsx = require("node-xlsx");
const tokenizer = new natural.AggressiveTokenizerRu();
const normalize=(text)=>{
    const words=tokenizer.tokenize(text.toLowerCase()).filter(w=>w.length>3).map(w=>natural.PorterStemmerRu.stem(w))//нормализую (убираю оканчания привожу в именительный падеж убираю короткие слова)
    return [...new Set(words)]//убираю дубли
}
exports.plugin = {
    name: 'table',
    version: '0.0.1',
    register: async (server,configs) => {
        const {pool} = configs;
        server.route({
            method: 'GET',
            path: '/technology/{id}',
            options: {
                async handler(req) {
                    try {
                        const {id}=req.params
                        const [data] = await pool.query(`SELECT * FROM list_technology WHERE id>${id} LIMIT 20`);
                        return {err:false, data}
                    } catch (err) {
                        console.log(err)
                        return {err:true}
                    }
                },
                description: 'Получение датасета технологий',
                tags: ['api','table'],
                validate:{
                    params: Joi.object({
                        id:Joi.number().required()
                    })
                }
            }
        });
        server.route({
            method: 'GET',
            path: '/industries/{id}',
            options: {
                async handler(req) {
                    try {
                        const {id}=req.params
                        const [data] = await pool.query(`SELECT * FROM list_industries WHERE id>${id} LIMIT 20`);
                        return {err:false, data}
                    } catch (err) {
                        console.log(err)
                        return {err:true}
                    }
                },
                description: 'Получение датасета отраслей',
                tags: ['api','table'],
                validate:{
                    params: Joi.object({
                        id:Joi.number().required()
                    })
                }
            }
        });
        server.route({
            method: 'GET',
            path: '/company/all/{id}',
            options: {
                async handler(req) {
                    try {
                        const {id}=req.params
                        const [data] = await pool.query(`SELECT C.id,C.name,
                            (SELECT GROUP_CONCAT(S.id) FROM companies S WHERE S.name=C.name AND S.is_duplicated=1) AS duble
                            FROM companies C WHERE C.id>${id} AND C.is_duplicated<>1 LIMIT 20`);
                        return {err:false, data}
                    } catch (err) {
                        console.log(err)
                        return {err:true}
                    }
                },
                description: 'Получение датасета компаний, ид дублей',
                tags: ['api','table'],
                validate:{
                    params: Joi.object({
                        id:Joi.number().required()
                    })
                }
            }
        });
        server.route({
            method: 'GET',
            path: '/company/count',
            options: {
                async handler(req) {
                    try {
                        const [[[{orig}]],[[{duble}]]]=await Promise.all([
                            pool.query(`SELECT COUNT(id) AS orig FROM companies WHERE is_duplicated=0`),
                            pool.query(`SELECT COUNT(id) AS duble FROM companies WHERE is_duplicated=1`)
                        ])
                        return {err:false, count:{orig, duble}}
                    } catch (err) {
                        console.log(err)
                        return {err:true}
                    }
                },
                description: 'Получение общего числа компаний',
                tags: ['api','table'],
                auth:false
            }
        });
        server.route({
            method: 'GET',
            path: '/company/{id}',
            options: {
                async handler(req) {
                    try {
                        const {id}=req.params;
                        let [[company]] = await pool.query(`SELECT * FROM companies WHERE id=${id}`);
                        const [[ind],[tech],[products]] =await Promise.all([
                            pool.query(`SELECT * FROM list_industries`),
                            pool.query(`SELECT * FROM list_technology`),
                            pool.query(`SELECT * FROM products WHERE id_company=${id}`)
                        ]);
                        const check_id_parent=(id,ar,array=[])=>{
                            for(let i of ar){
                                if(i.id===id) {
                                    array.push(i)
                                    if(i.parent!==0)array=array.concat(check_id_parent(i.parent,ar))
                                    break
                                }
                            }
                            return array
                        }
                        ind.forEach(i=>{
                            if(i.id===company.id_ind) company.id_ind=i;
                            if(i.id===company.id_sub_ind) company.id_sub_ind=i;
                        })
                        company.id_rek_sub_ind=check_id_parent(company.id_rek_sub_ind,ind).sort((a,b)=>a.parent-b.parent)
                        company.id_rek_tech_3=check_id_parent(company.id_rek_tech_3,tech).sort((a,b)=>a.parent-b.parent)
                        company.id_parser_sub_ind=check_id_parent(company.id_parser_sub_ind,ind).sort((a,b)=>a.parent-b.parent)
                        company.id_parser_tech_3=check_id_parent(company.id_parser_tech_3,tech).sort((a,b)=>a.parent-b.parent)
                        tech.forEach(t=>{
                            if(t.id===company.id_tech_1) company.id_tech_1=t;
                            if(t.id===company.id_tech_2) company.id_tech_2=t;
                            if(t.id===company.id_tech_3) company.id_tech_3=t;
                        })
                        return {err:false, company, products}
                    } catch (err) {
                        console.log(err)
                        return {err:true}
                    }
                },
                description: 'Получение датасета компании с рекомендованными данными',
                tags: ['api','table'],
                validate:{
                    params: Joi.object({
                        id:Joi.number().required()
                    })
                }
            }
        });
        server.route({
            method: 'POST',
            path: '/company/{id}',
            options: {
                async handler(req) {
                    try {
                        const {id}=req.params;
                        const {search}=req.payload;
                        const [data] = await pool.query(`SELECT C.id,C.name,(SELECT GROUP_CONCAT(S.id) FROM companies S 
                            WHERE S.name=C.name AND S.is_duplicated=1) AS duble FROM companies C 
                            WHERE C.id>${id} AND C.is_duplicated<>1 AND (C.id='${search}' OR C.name LIKE '%${search}%') LIMIT 20`);
                        return {err:false, data}
                    } catch (err) {
                        console.log(err)
                        return {err:true}
                    }
                },
                description: 'Поиск компаний по ид и имени',
                tags: ['api','table'],
                validate:{
                    params: Joi.object({
                        id:Joi.number().required()
                    }),
                    payload: Joi.object({
                        search:Joi.string().required()
                    })
                }
            }
        });
        server.route({
            method: 'PUT',
            path: '/company/{id}',
            options: {
                async handler(req) {
                    try {
                        const {id}=req.params;
                        const {id_ind,id_sub_ind,id_tech_1,id_tech_2,id_tech_3,id_rek_sub_ind,
                            id_rek_tech_3,id_parser_sub_ind,id_parser_tech_3}=req.payload;
                        await pool.query(`UPDATE companies SET id_ind=?,id_sub_ind=?,id_tech_1=?,id_tech_2=?,id_tech_3=?,id_rek_sub_ind=?,
                            id_rek_tech_3=?,id_parser_sub_ind=?,id_parser_tech_3=? WHERE id=?`,[id_ind,id_sub_ind,id_tech_1,id_tech_2,id_tech_3,id_rek_sub_ind,
                            id_rek_tech_3,id_parser_sub_ind,id_parser_tech_3,id]);
                        return {err:false}
                    } catch (err) {
                        console.log(err)
                        return {err:true}
                    }
                },
                description: 'Изменение данных компании',
                tags: ['api','table'],
                validate:{
                    params: Joi.object({
                        id:Joi.number().required()
                    }),
                    payload: Joi.object({
                        id_ind:Joi.number().required(),
                        id_sub_ind:Joi.number().required(),
                        id_tech_1:Joi.number().required(),
                        id_tech_2:Joi.number().required(),
                        id_tech_3:Joi.number().required(),
                        id_rek_sub_ind:Joi.number().required().allow(null),
                        id_rek_tech_3:Joi.number().required().allow(null),
                        id_parser_sub_ind:Joi.number().required().allow(null),
                        id_parser_tech_3:Joi.number().required().allow(null)
                    })
                }
            }
        });
        server.route({
            method: 'POST',
            path: '/load',
            options: {
                async handler(req) {
                    const {file} = req.payload
                    let countTrueIndustries=0
                    let countTrueTechnology=0
                    const companies = xlsx.parse(file);
                    companies[0].data.shift();
                    const [[ind],[tech]] =await Promise.all([
                        pool.query(`SELECT * FROM list_industries`),
                        pool.query(`SELECT * FROM list_technology`),
                    ]);
                    for(let company of companies[0].data){
                        let data=Object.assign({},company);
                        if(data[2]){
                            company[2]=normalize(company[2]).join(" ")
                            company[3]=normalize(company[3]).join(" ")
                            company[4]=normalize(company[4]).join(" ")
                            company[5]=normalize(company[5]).join(" ")
                            company[6]=normalize(company[6]).join(" ")
                            ind.forEach(i=>{
                                name=normalize(i.name).join(" ")
                                if(name===company[2]) data[2]=i.id;
                                if(name===company[3]) data[3]=i.id;
                            })
                            tech.forEach(t=>{
                                name=normalize(t.name).join(" ")
                                if(name===company[4]) data[4]=t.id;
                                if(name===company[5]) data[5]=t.id;
                                if(name===company[6]) data[6]=t.id;
                            })
                            await new Promise((res)=>{
                                natural.BayesClassifier.load('../nlp/classifierIndustries.json', natural.PorterStemmerRu, function(err, classifier) {
                                    const description=normalize(data[8]).join(" ")
                                    const rec=classifier.classify(description)
                                    if(rec*1===data[3]*1) countTrueIndustries++
                                    res()
                                });
                            })
                            await new Promise((res)=>{
                                natural.BayesClassifier.load('../nlp/classifierTechnology.json', natural.PorterStemmerRu, function(err, classifier) {
                                    const description=normalize(data[8]).join(" ")
                                    const rec=classifier.classify(description)
                                    if(rec*1===data[6]*1) countTrueTechnology++
                                    res()
                                });
                            })
                        }
                    }
                return {err:false,countAll:companies[0].data.length,countTrueIndustries,countTrueTechnology}
            },
            description: 'Загрузка и обработка файла',
            tags: ['api','table'],
            payload: {
                maxBytes: 20971520000,
                output: 'data',
                parse: true,
                multipart: true
            }
        }
    })
}
}