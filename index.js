const pdfDoc = require("pdfkit")
const fs = require("fs")
const doc = new pdfDoc();
const textract = require("textract")
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path");
const mammoth = require("mammoth");
const multer = require("multer")

//adds 1 page by default
// if we want more use doc.addPage()
var storage = multer.diskStorage({
    //dest is whre the file will be stored
    destination: function (request, file, callback) {
        callback(null, './uploads/')
    },
    filename: function (request, file, callback) {
        callback(null, 'uploaded')
    }
}); 
var upload = multer({ storage : storage })
const app = express();

app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({extended:true}))

app.get("/",function(req,res){
    res.render(__dirname+"/home.html")
})


app.get("/upload", function(req,res){
    res.render(__dirname+"/index.html")
})
var text
//use promise to wait for it to complete
app.post("/upload", upload.single("myFile"), async function(req,res){
    let result = await mammoth.extractRawText({path:req.file.path})
    text= result.value

    doc.pipe(fs.createWriteStream("converted.pdf"))

    doc
        .fontSize(14)
        .text(text,100,100)
        
    doc.end()
    res.sendFile(__dirname+"/converted.pdf")  
})  

   




app.listen(3000)




//cannot use fs, coz docx files are not UTF8 encrytped
// fs.readFile("test.docx", "utf8", function(err,data){
//     if(err){
//         console.log(err)
//     }else{
//         console.log(data)
//     }
// })