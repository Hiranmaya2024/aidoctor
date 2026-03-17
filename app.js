let symptoms=[]
let diseases=[]
let medicines=[]
let interactions=[]

let detectedSymptoms=[]

async function loadData(){

symptoms = await fetch("data/symptoms.json").then(r=>r.json())
diseases = await fetch("data/diseases.json").then(r=>r.json())
medicines = await fetch("data/medicines.json").then(r=>r.json())
interactions = await fetch("data/interactions.json").then(r=>r.json())

}

loadData()

function interpretSymptoms(){

let text=document.getElementById("symptomText").value.toLowerCase()

detectedSymptoms=symptoms.filter(s=>text.includes(s))

document.getElementById("detected").innerHTML=detectedSymptoms.join(", ")

}

function diagnose(){

let scores=[]

diseases.forEach(d=>{

let score=0

d.symptoms.forEach(s=>{
if(detectedSymptoms.includes(s)){
score++
}
})

scores.push({disease,score})

})

scores.sort((a,b)=>b.score-a.score)

let best=scores[0].disease

let html="Diagnosis: "+best.name+""

html+="Prescription"

best.medicines.forEach(m=>{
html+=""+m+""
})

document.getElementById("result").innerHTML=html

checkInteractions(best.medicines)

}

function checkInteractions(drugs){

let warnings=[]

for(let i=0;i<drugs.length;i++){

for(let j=i+1;j<drugs.length;j++){

interactions.forEach(x=>{

if(
(x.a==drugs[i] && x.b==drugs[j]) ||
(x.a==drugs[j] && x.b==drugs[i])
){

warnings.push(x.warning)

}

})

}

}

if(warnings.length>0){

alert("Drug interaction warning:\n"+warnings.join("\n"))

}

}

function downloadPDF(){

const {jsPDF}=window.jspdf

const pdf=new jsPDF()

pdf.text(document.getElementById("result").innerText,10,10)

pdf.save("prescription.pdf")

}

function sendWhatsApp(){

let msg=encodeURIComponent(document.getElementById("result").innerText)

window.open("https://wa.me/?text="+msg)

}
