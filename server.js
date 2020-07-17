const fs = require('fs');
const cheerio = require('cheerio');
const HtmlTableToJson = require('html-table-to-json');

let name_pattern = /^Name*/g
let phone_email_ref_pattern = /Every minute counts, make contact as soon as possible/g;
let result_through_comments = []
let name_comment_pattern = /<!-- name -->/
let description_comment_pattern = /<!-- Showing request Description -->/
let listing_details_pattern = /<!-- SECTION: Listing details content -->/ 

fs.readFile('./sample_email.html',"utf-8", (err, data)=>{
    if(err)
        throw err;
    const email_content = data;
    // Not so good approach
    // handleEmailContentByConvertingToJSON(email_content);

    // A much better approach
    handleEmailContentUsingText(email_content);
})

const handleEmailContentByConvertingToJSON = (content) => {
    // converting the given HTML to DOM, to access elements efficiently
    const $ = cheerio.load(content);
    // selecting table elements 
    const table_data = $("table table table").toString()
    // removing empty lines
    table_data.replace("\n", " ")
    // Parising the table elements to json, to access contents inside the table
    const jsontable = HtmlTableToJson.parse(table_data)
    // filtering the empty rows
    let trimmed_results = jsontable.results.filter(result=>{        
        return result.length!=0
    })
    // 
    let res = getDetailsFromConvertedJSON(trimmed_results)
    console.log(res)
}   

const getDetailsFromConvertedJSON = (trimmed_results) => {

   
    let res = [];

    trimmed_results = trimmed_results.map((data, p_i)=>{
        data.forEach((text, i) => {
            // accessing table rows converted to Json
            for(let key of Object.keys(text))
            {   
                if(text[key].length>0){
                    // Regex Matching for name
                    let name_match = text[key].match(name_pattern)
                    // Regex Matching for contact ref , this will let us extract: address, beds and baths  
                    let email_and_phone_match = text[key].match(phone_email_ref_pattern)

                    // if name is found, push the trimmed name
                    if(name_match!=null)
                        res.push({name: text[key].substring(5)})
                    
                    // if email and phone ref is found, push the phone and email from next rows
                    if(email_and_phone_match!=null){
                        if(data[i+2][key])
                            res.push({email: data[i+2][key]})
                        if(data[i+1][key])
                            res.push({phone: data[i+1][key]})

                        // Accessing beds and baths from the contact ref
                        if(trimmed_results[p_i+1]){
                            // spliting on line break to get address
                            let address_bed_baths = trimmed_results[p_i+1][0][1].split("\n")
                            const address = address_bed_baths[0]
                            let beds_baths = address_bed_baths[2].trim()
                            const beds = beds_baths.split(" ")[1]
                            const baths = beds_baths.split(" ")[3]
                            res.push({beds}, {baths}, {address})
                        }
                    }

                }
            }
        });
    })

    return res;
}

const handleEmailContentUsingText = (content) => {
    // Convert the document to array with each line as an entry to array; remove empty lines; remove trailing spaces 
    const line_array = content.split("\n").filter(line_text=>line_text.length>0).map(text=>text.trim())
    // Parsing each line for the required content
    line_array.forEach((line, index)=>{
        extractRequiredInfo(line, index, line_array)
    })
    // results through comments now has the required details
    console.log(result_through_comments)
}
// Method to check for comments in a given line, and then access the correct line for the required details 
// @content: content of particular line
// @lineNo: current line number in the array
// @arrayRef: reference of array containing the whole document (to access lines for details based on the current comment occurence)
const extractRequiredInfo = (content, lineNo, arrayRef) => {
    let name_comment = content.match(name_comment_pattern);
    let description_comment = content.match(description_comment_pattern)
    let listing_details_comment = content.match(listing_details_pattern);

    if(name_comment){
        let name_line = arrayRef[lineNo+3]
        let name = name_line.substring(name_line.indexOf("<strong>")+ 8, name_line.indexOf("</strong>"))
        result_through_comments.push({name})
    }
    if(description_comment) {
        let phone_line = arrayRef[lineNo+10]
        let email_line = arrayRef[lineNo+17]
        let $phone = cheerio.load(phone_line)
        let $email = cheerio.load(email_line)
        let phone = $phone("a").text()
        let email = $email("a").text()
        result_through_comments.push({email}, {phone})
    }
    if(listing_details_comment) {
        let address_line = arrayRef[lineNo+19]
        let beds_baths_line = arrayRef[lineNo+21]

        let $address = cheerio.load(address_line)
        let $beds_baths = cheerio.load(beds_baths_line)

        let address = $address("strong a").text()
        let beds_baths = $beds_baths("strong").text()
        let beds = beds_baths[0]
        let baths = beds_baths[1]
        result_through_comments.push({beds}, {baths},{address})
    }



}