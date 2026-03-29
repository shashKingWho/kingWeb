/* =========================================
CONFIG
========================================= */
/*
Central configuration so marketing team can
change WhatsApp number without touching code.
*/

const whatsappNumber = "9999999999"



/* =========================================
CARD BEHAVIOR (DESKTOP + MOBILE SUPPORT)
========================================= */

const cards = document.querySelectorAll(".card")

let activeCard = null

cards.forEach(card => {

const img = card.querySelector("img")
const desc = card.querySelector(".card-desc")


/* -------------------------
DESKTOP HOVER
------------------------- */

card.addEventListener("mouseenter", () => {

if(window.innerWidth > 768){

gsap.to(card,{flex:3,duration:.4})
gsap.to(img,{scale:1.2,filter:"grayscale(0%)"})
gsap.to(desc,{y:0})

}

})


card.addEventListener("mouseleave", () => {

if(window.innerWidth > 768){

gsap.to(card,{flex:1,duration:.4})
gsap.to(img,{scale:1,filter:"grayscale(100%)"})
gsap.to(desc,{y:"100%"})

}

})


/* -------------------------
MOBILE TAP
------------------------- */

card.addEventListener("click", () => {

if(window.innerWidth <= 768){

/* reset all cards */

cards.forEach(c => {

gsap.to(c,{flex:1,duration:.4})

gsap.to(c.querySelector("img"),{
scale:1,
filter:"grayscale(100%)"
})

gsap.to(c.querySelector(".card-desc"),{
y:"100%"
})

})


/* expand selected */

gsap.to(card,{flex:3,duration:.4})

gsap.to(img,{
scale:1.1,
filter:"grayscale(0%)"
})

gsap.to(desc,{
y:0
})


/* first tap expands only */

if(activeCard !== card){

activeCard = card
return

}

}


/* second tap opens form */

openForm(card.dataset.type)

})

})

// FORM

//
/* =========================================
LIVE QUOTE EVENT BINDING
========================================= */

const quoteInputs = [

"canvasSize",
"medium",
"delivery",
"purpose",
"budget"

]

quoteInputs.forEach(id => {

const el = document.getElementById(id)

if(!el) return

el.addEventListener("change", updatePricePreview)
el.addEventListener("input", updatePricePreview)

})


// Add a Safe Price Preview Renderer
/* =========================================
PRICE PREVIEW RENDER
========================================= */

function updatePricePreview(){

const preview = document.getElementById("pricePreview")
if(!preview) return

const price = calculatePrice()

if(price === 0){
preview.innerText = "₹0"
return
}

preview.innerText = "₹" + price.toLocaleString()

}



/* =========================================
FORM FLOW SWITCHING
========================================= */

let activeFlow = null

function openForm(type){

document.getElementById("formSection").style.display="block"

document.querySelectorAll(".formFlow")
.forEach(f => f.style.display="none")

if(type==="art"){

document.getElementById("artForm").style.display="block"
document.getElementById("inquiryType").value="Art Inquiry"

activeFlow="artForm"

}

if(type==="event"){

document.getElementById("eventForm").style.display="block"
document.getElementById("inquiryType").value="Event Appearance"

activeFlow="eventForm"

}

if(type==="brand"){

document.getElementById("brandForm").style.display="block"
document.getElementById("inquiryType").value="Brand Collaboration"

activeFlow="brandForm"

}


localStorage.setItem("activeFlow",activeFlow)

loadForm(activeFlow)

updatePricePreview()


//=========================================
//SMOOTH SCROLL TO FORM

gsap.to(window,{
duration:0.8,
scrollTo:{
y:formSection,
offsetY:40
},
ease:"power2.out"
})


}



/* =========================================
GIFT FIELD LOGIC
========================================= */

const purposeField = document.getElementById("purpose")

if(purposeField){

purposeField.addEventListener("change", function(){

const giftFields = document.getElementById("giftFields")

if(this.value === "Gift"){

giftFields.style.display="block"

}else{

giftFields.style.display="none"

}

})

}



// /*
// /* =========================================
// ART PRICE CALCULATOR
// ========================================= */

// function calculatePrice(){

// const size = document.getElementById("canvasSize").value
// const medium = document.getElementById("medium").value
// const delivery = document.getElementById("delivery").value

// let width = 0
// let height = 0

// if(size==="16x20"){width=16;height=20}
// if(size==="18x24"){width=18;height=24}
// if(size==="24x36"){width=24;height=36}
// if(size==="36x48"){width=36;height=48}

// const area = width * height

// const pricePerSqInch = 8

// let price = area * pricePerSqInch

// /* Medium cost */

// if(medium==="Oil") price += 500

// /* Delivery cost */

// if(delivery==="Shipping") price += 300
// if(delivery==="Local Delivery") price += 150

// return price

// }
// */
/* =========================================
ART PRICE CALCULATOR (WITH BUDGET LOGIC)
========================================= */

function calculatePrice(){

if(activeFlow !== "artForm") return 0

const size = document.getElementById("canvasSize")?.value || ""
const medium = document.getElementById("medium")?.value || ""
const delivery = document.getElementById("delivery")?.value || ""
const budget = document.getElementById("budget")?.value || ""


// Parse canvas size

let width = 0
let height = 0

if(size){
const parts = size.split("x")
width = Number(parts[0])
height = Number(parts[1])
}


// Base artwork pricing

const pricePerSqInch = 8
let price = width * height * pricePerSqInch


/* Medium complexity */

if(medium === "Oil") price += 50000
if(medium === "Watercolor") price += 20000


/* Delivery */

if(delivery === "Local Delivery") price += 700
if(delivery === "Shipping") price += 3000



/* =========================================
BUDGET ALIGNMENT LOGIC
========================================= */

let minBudget = 0
let maxBudget = Infinity

if(budget === "₹5k-10k"){
minBudget = 5000
maxBudget = 10000
}

if(budget === "₹10k-25k"){
minBudget = 10000
maxBudget = 25000
}

if(budget === "₹25k+"){
minBudget = 25000
maxBudget = Infinity
}


/* If below minimum → bump up */

if(price < minBudget){
price = minBudget
}

/* If above maximum → clamp */

if(price > maxBudget){
price = maxBudget
}


return price

}






// /* =========================================
// LIVE PRICE UPDATE
// ========================================= */

// const priceFields = ["canvasSize","medium","delivery"]

// priceFields.forEach(id => {

// const el = document.getElementById(id)

// if(el){

// el.addEventListener("change", () => {

// const price = calculatePrice()

// if(price === 0){
// preview.innerText = "₹0"
// return
// }


// document.getElementById("pricePreview").innerText = "₹" + price.toLocaleString()

// })

// }

// })



/* =========================================
LOCAL STORAGE AUTOSAVE
========================================= */

function saveForm(flow){

const inputs = document.querySelectorAll(`#${flow} input,#${flow} select,#${flow} textarea`)

const data = {}

inputs.forEach(el => {

data[el.id] = el.value

})

localStorage.setItem(flow, JSON.stringify(data))

}



function loadForm(flow){

const saved = JSON.parse(localStorage.getItem(flow))

if(!saved) return

Object.keys(saved).forEach(id => {

const el = document.getElementById(id)

if(el) el.value = saved[id]

})

}



/* AUTO SAVE ON CHANGE */

document.querySelectorAll("input,select,textarea")
.forEach(el => {

el.addEventListener("change", () => {

const flow = localStorage.getItem("activeFlow")

if(flow) saveForm(flow)

})

})



/* =========================================
VALIDATION
========================================= */

function validateFields(){

const name = document.getElementById("name").value
const phone = document.getElementById("phone").value

if(!name || !phone){

alert("Name and Phone are required")

return false

}

return true

}



/* =========================================
WHATSAPP MESSAGE GENERATOR
========================================= */

function sendToWhatsApp(){

if(!validateFields()) return

const name = document.getElementById("name").value
const company = document.getElementById("company").value
const phone = document.getElementById("phone").value
const email = document.getElementById("email").value

let message = "*Business Inquiry*\n\n"

message += "--- Client ---\n"
message += `Name: ${name}\n`
message += `Company: ${company}\n`
message += `Phone: ${phone}\n`
message += `Email: ${email}\n\n`



/* ART FLOW */

if(activeFlow==="artForm"){

const size = document.getElementById("canvasSize").value
const medium = document.getElementById("medium").value
const delivery = document.getElementById("delivery").value
const details = document.getElementById("artDetails").value

const price = calculatePrice()

message += "--- Art Inquiry ---\n"
message += `Canvas: ${size}\n`
message += `Medium: ${medium}\n`
message += `Delivery: ${delivery}\n`
message += `Estimated Price: ₹${price}\n`
message += `Details: ${details}\n`

}



/* EVENT FLOW */

if(activeFlow==="eventForm"){

const date = document.getElementById("eventDate").value
const location = document.getElementById("eventLocation").value
const budget = document.getElementById("eventBudget").value
const details = document.getElementById("eventDetails").value

message += "--- Event Appearance ---\n"
message += `Date: ${date}\n`
message += `Location: ${location}\n`
message += `Budget: ${budget}\n`
message += `Details: ${details}\n`

}



/* BRAND FLOW */

if(activeFlow==="brandForm"){

const campaign = document.getElementById("campaignName").value
const budget = document.getElementById("brandBudget").value
const details = document.getElementById("brandDetails").value

message += "--- Brand Collaboration ---\n"
message += `Campaign: ${campaign}\n`
message += `Budget: ${budget}\n`
message += `Details: ${details}\n`

}



const encoded = encodeURIComponent(message)

window.open(
`https://wa.me/${whatsappNumber}?text=${encoded}`,
"_blank"
)

}



/* =========================================
BACK TO TOP
========================================= */

const backToTop = document.getElementById("backToTop")

window.addEventListener("scroll", () => {

if(window.scrollY > 300){
backToTop.style.display="block"
}else{
backToTop.style.display="none"
}

})

backToTop.addEventListener("click", () => {

gsap.to(window,{
scrollTo:0,
duration:.7,
ease:"power2.out"
})

})