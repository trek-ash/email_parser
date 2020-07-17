Here is the full thought process which I have used so far to tackle the given problem statement. <br />

## Exploring the Problem Statement 

Based on the problem statement, following features are required <br />
1. Parser to extract information from the given email in HTML format.
2. The algorithm should be scalable and simple.

For parsing the email by one of our alogrithms, I have mentioned below the approaches I could come up with. 
<br />

## Brainstorming for the solution

Currently, I am focusing to provide the solution for the particular sample email template shared. My approach is to make it working for a particular template, and then we can try to scale to further email templates. <br />
To make the solution scalable, I could think of following: <br />
1. Since some of the organisations have their email template, and they replace data in their templates to send emails to clients, so handling the templates might help us to tackle a greater range of emails from an organisation.
2. To make it work for across different organisations templates, we might require inputs from the organisations or our representatives to point out the data and kind of data to extract from the email.
3. So this leads to providing an interface(like zapier) where the person can select the data and type of data from the given email, and we can use this to make references for further emails in that format.
4. When we represent the email in such interface, we can have our own elements or identifiers ( or comments) on the elements that will help us track the information for further templates. For e.g. While rendering email to the interface, we can add custom attributes to elements in the email. Once a person selects a word "Yash" as "Name" at a particular element. We can have an element around this text and give it attribute that reflects it is "Name". Also, our custom attributes on the parent element of this text will map the data which we have inside this parent element.( I can think of way to track the particular text as key based on the position of the word. Though we can try to improve on this if possible)
5. For further emails of the same template, we can map the kept information from the previous email and 
pre-highlight the texts to show to the user. If it's incorrrect, user can reselect the correct text for the data.

Having said that, my approaches for the given template is summarised below: <br />

## Approaches So Far 

1. Parsing an email using products like zapier. <br />
2. Make a software like zapier acording to our needs. <br />
3. Writing a program to handle the current template.

Part 1 is straightforward as given in the description and documentation by Zapier.<br />

For part 2, making solution close to the approach shared above in scalable solution<br />



### Progress in part 3:

#### Approach a
1. Convert the given HTML content to an array, with each line as an element in the array
2. Access each line to match for the comments
3. If any of the specified comments are matched, access the line which has the required detail
4. Extract the required information from this line.

##### Issue with this approach: 
1. Dependence on comments
2. Specifing the line statically


## Run the solution
Please follow given instructions to run the given solution: 
1. npm install
2. npm start
