const express=require("express")
const multer=require("multer")
const ffmpeg = require('fluent-ffmpeg');




const app=express();

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/uploads/")
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+".mp3")
    }
})

const upload=multer({storage:storage})

app.use(express.static('public'))

app.get("/",(req,res)=>{
    res.sendFile("index.html")
})

app.post("/upload",upload.single('file'),(req,res)=>{
   console.log(req.file.path)
   console.log(req.body.fillerRemove)
   res.send(req.body)

})

app.listen(5000,()=>{
    console.log('server is running')
})