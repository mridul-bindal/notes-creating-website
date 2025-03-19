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

app.get('/files/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata){
        res.render('show',{filename: req.params.filename, filedata:filedata});
    })
});//we use req.params wehn we want to access filename from '/files/:filename' that is anythin after the : tag 

app.post('/create', function (req, res) {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.text_area, function(_err){
        res.redirect('./')
    });
});
//we use post when we usually add something in the file dataset get is used only to read certain data or to get data 
app.get('/edit/content/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata){
        res.render('content',{filename: req.params.filename, filedata:filedata});
    })
});
app.post('/make', function(req, res){
    fs.writeFile(`./files/${req.body.filename}`, req.body.text_area, function(_err){
        res.redirect('./')
    });
})

app.post('/edit', function(req, res) {
    const oldPath = `./files/${req.body.prevname}`;
    const newPath = `./files/${req.body.newname}`;
    
    fs.rename(oldPath, newPath, function(err) {
        res.redirect('/');
    });
});
app.post('/delete/:filename', function(req, res) {
    const filePath = `./files/${req.params.filename}`;
    fs.unlink(filePath, function(err) {
        if (err) {
            console.error("Error deleting file:", err);
            return res.status(500).send("Error deleting file.");
        }
        res.redirect('/');
    });
});

app.listen(3000);