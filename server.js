const fs = require('fs');
const cheerio = require('cheerio');
const HtmlTableToJson = require('html-table-to-json');

fs.readFile('./sample_email.html',"utf-8", (err, data)=>{
    if(err)
        throw err;
    const email_content = data;

    handleEmailContent(email_content)
})

const handleEmailContent = (content) => {
    const $ = cheerio.load(content);
    const table_data = $("table:first-child").toString()
    table_data.replace("\n", " ")
    const jsontable = HtmlTableToJson.parse(table_data)
    let res = []
    let new_results = jsontable.results.filter(result=>{        
        return result.length!=0
    })
    new_results = new_results.map(data=>{
        data.forEach((text, key) => {
            for(let key of Object.keys(text))
            {   
                if(text[key].length>0){
                let name_match = text[key].match(/^Name*/g)
                
                if(name_match!=null)
                    res.push({name: text[key]})
                
                }
            }
        });
    })
    console.log(res)

}   