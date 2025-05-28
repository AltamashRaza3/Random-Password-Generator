const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#upperCase");
const lowerCaseCheck = document.querySelector("#lowerCase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*()-_=+[{]}\|:';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set Strength circle color to grey
setIndicator("#ccc");

//set passwordLength  --Use for Reflect password Length on UI
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

//setIndicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow= '0px 0px 12px 1px ${color}';
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 10); // Include 0-9
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function getSymbol() {
    const randomNumber = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNumber);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;
    if (upperCaseCheck.checked) hasUpper = true;
    if (lowerCaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

//Function to copy Text from clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (err) {
        copyMsg.innerHTML = "Failed to copy from clipboard";
    }
    //TO make copied span visible
    copyMsg.classList.add("active");
    //To hide copied span after sometime.
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
} 

function shufflePassword(array) {
    //Fisher-Yates Method:
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str= "";
    array.forEach((el)=> (str +=el));
    return str;
    // return array.join(''); // Join the array to form the password string
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkBox) => {
        if (checkBox.checked) {
            checkCount++;
        } 
    });
    //Special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount + 2;
        handleSlider(); // Update the slider to reflect the new password length
    }
}

allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

generateBtn.addEventListener("click", () => {
    //None of the checkboxes are selected
    if (checkCount == 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //Lets Start the Journey to find new Password:
    console.log("Starting the journey");
    //remove old Password
    password = "";

    let funArr = [];

    if (upperCaseCheck.checked) {
        funArr.push(generateUpperCase);
    }

    if (lowerCaseCheck.checked) {
        funArr.push(generateLowerCase);
    }

    if (numberCheck.checked) {
        funArr.push(generateRandomNumber);
    }

    if (symbolCheck.checked) {
        funArr.push(getSymbol);
    }

    //compulsory Addition
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    //remaining Addition
    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let randomIndex = getRandomInteger(0, funArr.length);
        password += funArr[randomIndex]();
    }

    console.log("before shuffle Password call");
    //Shuffle the Password:
    password = shufflePassword(Array.from(password));
    //show in UI:
    passwordDisplay.value = password;
    //Calculate strength of the password:
    calcStrength();
});
