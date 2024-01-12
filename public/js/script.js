const form=document.getElementById("upload-form");




form.addEventListener("submit",(e)=>{
e.preventDefault()

const formData=new FormData(form)

fetch("/upload",{
    method:"POST",
    body:formData
}).then((res)=>{
    if(!res.ok){
        throw new Error("network issue")
    }
    return res.blob()
}).then((blob)=>{
    console.log(blob)
})

})