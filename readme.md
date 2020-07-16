
## Approaches So Far: 

1. Parsing an email using products like zapier. <br />

        OR <br />

2. Make a software as cool as zapier acording to our needs. <br />

Part 1 is straightforward as given in the description and documentation by Zapier.<br />

For part 2, that is writing our own algorithm to extract details from email.<br />

### Progress in part 2:

#### Approach a
1.  Try to parse the html such that elements can be accessed through selectors (Trying cheerio for the same, extracting the table element).
2.  Convert the table element to json to parse the strings.
2.  Access these elements and match to get names.

Issues: 

accessing the exact elements

#### Approach b
1.  Based on the comments in the sample html (Not sure if these comments come up everytime with right information)

