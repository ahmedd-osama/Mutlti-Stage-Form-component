let nextBtn = document.getElementById("next-btn");
let confirmBtn = document.getElementById("confirm-btn");
let backBtn = document.getElementById("back-btn");
let steps = document.querySelectorAll(".changable .step");
let allNavElements = document.querySelectorAll("nav .step");
let allSteps = document.querySelectorAll(".user-input .changable .step")
let currentStep = 1;
let allPlans = document.querySelectorAll(".user-input .step-2 .plan-card");
let planToggleBtn = document.querySelector(".user-input .step-2 .toggle");
let allAddons = document.querySelectorAll (".step-3 .add-ons .add");
let allAddonsCheckboxs = document.querySelectorAll (".step-3 .add-ons .add input");
// form data
let planType = "arcade";
let planPrice = 9;
let planDuration = 1;


function activateNav(step){
    if ( !(step > allNavElements.length) && step > 0){
        allNavElements.forEach((ele)=>{
            ele.classList.remove("active");
            if(ele.getAttribute("data-step") == step){
                ele.classList.add("active")
            }
        })
    }
}
function adjustBtns(){
    if(currentStep == 1){
        backBtn.style.display = "none";
    }
    if(currentStep > 1){
        backBtn.style.display = "block";
    }
    if(currentStep == allNavElements.length){
        confirmBtn.style.display = "block";
        nextBtn.style.display = "none";
    }
    if (currentStep < allNavElements.length){
        confirmBtn.style.display = "none";
        nextBtn.style.display = "block";
    }
}
adjustBtns();
activateNav(currentStep);
function checkInput(){
    let name = document.getElementById("name-input");
    let email = document.getElementById("email-input");
    let phone = document.getElementById("phone-input");
    let checkStatus = true
    let allErrorContainers = document.querySelectorAll('.input-error');
    allErrorContainers.forEach((error)=> error.innerHTML = "")
    if (name.value === ''){
        sendEror("name");
        checkStatus = false;
    }
    if(!email.checkValidity()){
        sendEror("email", "Please Type A Valid Email Adress");
        checkStatus = false;
    }
    if(email.value === ''){
        sendEror("email");
        checkStatus = false;
    }
    if (phone.value === ''){
        sendEror("phone");
        checkStatus = false;
    }
    return checkStatus
    
}
function sendEror(input, message = 'This Field Is Required'){
    let errorContainer = document.querySelector(`.user-input .error-${input}`);
    errorContainer.innerHTML = message
}
function goToStep(stepNum = currentStep){
    if ( !(stepNum > allSteps.length) && stepNum > 0){
        allSteps.forEach((step)=>{
            step.style.display = "none";
            if (step.getAttribute("data-step") == stepNum){
                step.style.display = "flex";
                if (stepNum > currentStep){
                    currentStep++
                }else if (stepNum < currentStep){
                    currentStep--
                }
            }
            });
    }
}
function goBack(){
    if (currentStep > 1){
        currentStep--;
    }
    goToStep(currentStep);
}
function updateInvoice(){
    let totalPrice ;
    // updating add-ons 
    document.querySelector(".step-4 .add-ons").innerHTML = ""
    allAddons.forEach((add)=>{
        if (add.classList.contains("checked")){
            // adding to total price 
            if (totalPrice){
                totalPrice = totalPrice + parseInt(add.getAttribute("data-add-price"))*planDuration
            }else{
                totalPrice = parseInt(add.getAttribute("data-add-price"))*planDuration
            }
            // updating the invoice 
            let newAddOn = document.createElement("div");
            newAddOn.classList.add("add");
            newAddOn.innerHTML = `
            <p class="sup-text"> ${add.getAttribute("data-add")}</p>
            <p class="price">+$${add.getAttribute("data-add-price")*planDuration}/ <span class="unite">month</span></p>
            `
            document.querySelector(".step-4 .add-ons").appendChild(newAddOn)
        }
    })
    // updating plan type 
    document.querySelector(".user-input .invoice .plan-name .name").innerHTML = planType;
    // updating time unite 
    let unite = document.querySelectorAll(".user-input .unite");
    if (planDuration == 1){
        unite.forEach((uni)=>{
            uni.innerHTML="Month"
        })
    }else if (planDuration == 10){
        unite.forEach((uni)=>{
            uni.innerHTML="year"
        })
    }
    // updating plan price 
    document.getElementById("plan-price").innerHTML = planPrice * planDuration
    if (totalPrice){
        totalPrice = totalPrice + planPrice * planDuration
    }else{
        totalPrice =  planPrice * planDuration
    }
    // updating total price
    document.querySelector(".step-4 .total .total-price .total-price").innerHTML = totalPrice;
}
updateInvoice()
// next button 
nextBtn.addEventListener('click', (event)=>{
    event.preventDefault();
    if ( checkInput()){
        goToStep(currentStep+1);
        activateNav(currentStep);
        adjustBtns();
    }
});
// back button 
backBtn.addEventListener('click', (event)=>{
    event.preventDefault();
    goBack();
    activateNav(currentStep);
    adjustBtns();
});
// plans selection 
allPlans.forEach((plan)=>{
    plan.addEventListener("click", (event)=>{
        allPlans.forEach((plan)=> plan.classList.remove("active"))
        event.currentTarget.classList.add("active")
        planType = event.currentTarget.getAttribute("data-plan")
        planPrice = event.currentTarget.getAttribute("data-plan-price")
        updateInvoice()
    })
})
// plans yearly or monthly selection 
planToggleBtn.addEventListener("click", (event)=>{
    if (event.currentTarget.parentElement.classList.contains("monthly")){
        event.currentTarget.parentElement.classList.replace('monthly', 'yearly');
        planDuration = 10
        document.querySelector(".user-input .plans").classList.replace('monthly', 'yearly');
        document.querySelector(".user-input .step-3 .add-ons").classList.replace('monthly', 'yearly');
    }else{
        event.currentTarget.parentElement.classList.replace('yearly', 'monthly');
        document.querySelector(".user-input .plans").classList.replace('yearly', 'monthly');
        document.querySelector(".user-input .step-3 .add-ons").classList.replace('yearly', 'monthly');
        planDuration = 1
    }
    updateInvoice()

})
// Add-ons selection
allAddonsCheckboxs.forEach((btn)=>{
    btn.addEventListener("click", (event)=>{
        event.currentTarget.parentElement.classList.toggle("checked");
        updateInvoice()
    })
});
allAddons.forEach((ele)=>{
    ele.addEventListener("click", (event)=>{
        event.currentTarget.querySelector("input").click()
    })
});
// confirm button 
confirmBtn.addEventListener("click", (event)=>{
    event.preventDefault();
    steps.forEach((step)=>{
        step.remove();
    });
    document.querySelector(".thank-you").style.display = "flex";
    document.querySelector(".user-input .form-nav").style.display = "none";
});