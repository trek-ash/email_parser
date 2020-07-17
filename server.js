const fs = require('fs');
const cheerio = require('cheerio');

let result_through_comments = []
let name_comment_pattern = /<!-- name -->/
let description_comment_pattern = /<!-- Showing request Description -->/
let listing_details_pattern = /<!-- SECTION: Listing details content -->/ 

fs.readFile('./sample_email.html',"utf-8", (err, data)=>{
    if(err)
        throw err;
    const email_content = data;

    handleEmailContentUsingText(email_content);
})

// Function to convert the given html content to array,
//  splitting it by line and then accessing each line for the required patterns
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

// Function to check for comments in a given line, and then access the correct line for the required details 
// @content: content of particular line
// @lineNo: current line number in the array
// @arrayRef: reference of array containing the whole document (to access lines for details based on the current comment occurence)
const extractRequiredInfo = (content, lineNo, arrayRef) => {
    let name_comment = content.match(name_comment_pattern);
    let description_comment = content.match(description_comment_pattern)
    let listing_details_comment = content.match(listing_details_pattern);
    // On name comment matched
    if(name_comment){
        let name_line = arrayRef[lineNo+3]

        // Using cheerio to access the HTML sub elements efficiently
        let $name = cheerio.load(name_line)

        let name = $name("strong").text()
        result_through_comments.push({name})
    }
    // On description comment matched
    if(description_comment) {
        let phone_line = arrayRef[lineNo+10]
        let email_line = arrayRef[lineNo+17]

        // Using cheerio to access the HTML sub elements efficiently
        let $phone = cheerio.load(phone_line)
        let $email = cheerio.load(email_line)
        
        let phone = $phone("a").text()
        let email = $email("a").text()
        result_through_comments.push({email}, {phone})
    }
    // On listing details comment match
    if(listing_details_comment) {
        let address_line = arrayRef[lineNo+19]
        let beds_baths_line = arrayRef[lineNo+21]

        // Using cheerio to access the HTML sub elements efficiently
        let $address = cheerio.load(address_line)
        let $beds_baths = cheerio.load(beds_baths_line)

        let address = $address("strong a").text()
        let beds_baths = $beds_baths("strong").text()
        let beds = beds_baths[0]
        let baths = beds_baths[1]
        result_through_comments.push({beds}, {baths},{address})
    }



}