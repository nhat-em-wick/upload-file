const express = require('express');
const multer = require('multer');
const path =require('path');
const ejs = require('ejs');
const { diskStorage } = require('multer');
const app = express();

const port = 3500;
app.set("view engine", "ejs");
app.use(express.static('./public'));

//set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
});
// set upload
const upload = multer({
    storage: storage,
    limits: {fileSize:1000000},
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);        
    }
}).single('myImg');

//check file
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mine
    const minetype = filetypes.test(file.mimetype)

    if(extname && minetype){
        return cb(null, true);
    }else{
        cb('Error: Image Only')
    }
}

app.post('/upload', function(req, res){
    upload(req, res, function(err) {
        if(err){
            res.render('index',{ msg: err })
        }else{
            if(req.file == undefined){
                res.render('index',{msg: 'Error: No File Selected'});
            }else{
                res.render('index',{ msg: 'File Uploaded!',
                file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});

app.get('/', function(req, res){
    res.render('index');
})

app.listen(port, function(){
    console.log(`Server on port ${port}`);
})