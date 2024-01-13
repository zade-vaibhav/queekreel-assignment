const express=require("express")
const multer=require("multer")
const ffmpeg = require('fluent-ffmpeg');
const path=require("path")



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
   console.log(req.file)
   console.log(req.body.fillerRemove)
   res.send(req.body)

   const filePath=req.file.path;

   const fileName=req.file.originalname

   // Input audio file
const FilePath = filePath;

// Output audio file
const outputFilePath = Date.now()+fileName+".mp3";
console.log(outputFilePath)
// Filler word to be removed
const fillerWords=req.body.fillerRemove
const fillerWord = fillerWords.split(",");
console.log(fillerWord)

// Create a filter to remove the filler word
//  const filter= `arealmatch(s, '${fillerWord[0]}')`;
// const filter = fillerWord.map(word => `arealmatch(s, '${word}')`).join(',')
const filter = fillerWord.map(word => `areverse,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.${word}.ratio:file=-[aout], anull[in]`).join(';');
const command=ffmpeg(FilePath);


command.audioFilter(`silencedetect=n=-50:d=0.5`) // Optional: Add an audio filter to enhance silence detection
command.audioFilter('anullsrc=r=44100:cl=stereo')

command.on('start', () => {
    console.log('Trimming audio...');
  })
command.on('error',(err)=>{
    console.log("an error takes place : "+err.massage)
}).on("end",()=>{
    res.download(path.join(__dirname,"public/uploads",outputFilePath))
}).save(path.join(__dirname,"public/uploads",outputFilePath))







})

app.listen(5000,()=>{
    console.log('server is running')
})