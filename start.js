const express = require('express');
const app = express();
const path= require('path');
const fs =require('fs');


app.set("view engine", "ejs")
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.use('/public', express.static('public')); //use contents of public foder statically 


app.get('/', function (_req, res) {
    fs.readdir(`./files`, function(_err, files){
        res.render("index", { files: files }); // <-- pass files here
    });
});

app.post('/create', function (req, res) {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.text_area, function(_err){
    res.redirect('./')
  });

});



app.listen(3000);

