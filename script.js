const inputSlider= document.querySelector("[data-lengthSlider]");
const lengthDisplay= document.querySelector("[data-lengthnumber]");
const passwordDisplay= document.querySelector("[data-passwordDisplay]");
const copyBtn= document.querySelector("[data-copy]");
const copyMsg= document.querySelector("[data-copyMsg]");
const uppercaseCheck= document.querySelector("#uppercase");
const lowercaseCheck= document.querySelector("#lowercase");
const numbersCheck= document.querySelector("#numbers");
const symbolsCheck= document.querySelector("#symbols");
const indicator= document.querySelector("[data-indicator]");
const generateBtn= document.querySelector(".generateButton");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-=+{[}]|\:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
// circle color
setIndicator("#ccc");

//set passworld length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

// strength indicator color change
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow 
    indicator.style.boxShadow =`0px 0px 12px 1px ${color}`;
}

// random value generator
function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

// Get Random number
function generateRandomNumber() {
    return getRndInteger(0,9);
}
// Get Random Lowercase
function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
// Get Random Uppercase
function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
} 
// Get Random Symbol
function generateSymbol(){
    const randNum =getRndInteger(0 , symbols.length);
    return symbols[randNum];// return symbols.charAt(randNum);
}

// Strength Calculation
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasSym = false;
    let hasNum = false;
    if( uppercaseCheck.checked) 
    hasUpper=true;
    if( lowercaseCheck.checked) 
    hasLower=true;
    if( numbersCheck.checked) 
    hasNum=true;
    if( symbolsCheck.checked) 
    hasSym=true;

    if( hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8)
    {
        setIndicator("#0f0");
    }
    else if( (hasLower || hasUpper ) && (hasNum || hasSym) && passwordLength >=6 )
    {
        setIndicator("#ff0");
    }
    else
    {
        setIndicator("#f00");
    }
}

// Copying to clipboard
async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied" ;
    }
    catch(e){
        copyMsg.innerText="Failed";
    } 
    // to make copied msg visible
    copyMsg.classList.add("active");
    // to make copied invisible afte 2 second
    setTimeout( ()=> {
        copyMsg.classList.remove("active");
    },2000);
}
 

// Function to Shuffle password
function shufflePassword(array)
{
     // Fischer Yates Method
     for( let i = array.length - 1 ; i > 0 ; i--)
     {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] =temp;
     }
     let str= "";
     array.forEach((el) => (str += el));
     return str;
}
// ADDING EVENT LISTENER

function handleCheckBoxChange() {
    checkCount=0;
    allCheckBox.forEach( (checkbox)=> {
        if( checkbox.checked)
        checkCount++;
    });
    if( passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}


//Adding event listener on Checkbox to maintain checkcount
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);   
});

//Mapping slider movement with password length
inputSlider.addEventListener('input',(head)=>{
    passwordLength = head.target.value;
    handleSlider();
}
)

//Copy button event listener
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
})
// Generating Password
generateBtn.addEventListener('click', () => {
    if(checkCount == 0)
    return;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    // finding password
    password = "";
    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    //Must added character
    for( let i = 0 ; i < funcArr.length ; i++)
    {
        password += funcArr[i]();
    }
    // Remaining random characters
    for( let i = 0 ; i<passwordLength-funcArr.length;i++)
    {
        let randIndex = getRndInteger( 0 , funcArr.length);
        password += funcArr[randIndex]();
    }
    password = shufflePassword(Array.from(password));
    passwordDisplay.value=password;
    calcStrength();
});



 