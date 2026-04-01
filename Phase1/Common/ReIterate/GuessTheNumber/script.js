const DOM = {
    userGuess: document.getElementById("user-guess"),
    submitBtn: document.getElementById("guess-submit"),
    feedback:  document.getElementById("feedback"),
    result:    document.getElementById("result"),
    attemptCont: document.getElementById("attempt-Cont"),
    resultCont: document.getElementById("result-container")
}

let gameState = {
    secret: Math.floor(Math.random()*100)+1,
    attempts: 0,
    max_attempts: 10,
    higher: 100,
    lower: 1,
    isMatch: false,
}

function handleGuess(){
    let guess = parseInt(DOM.userGuess.value, 10);

    if(isNaN(guess) || guess < 1 || guess > 100){
        window.alert("Please guess a value between 1 to 100")
        DOM.userGuess.focus();
    }

    gameState.attempts++;
    DOM.attemptCont.innerText =`Attempts: ${gameState.attempts}/${gameState.max_attempts}`;
    DOM.userGuess.value=' ';

    console.log(gameState)

    if(guess === gameState.secret){
        gameState.isMatch = true
        response(gameState)
        return;
    }

    let remain = gameState.max_attempts-gameState.attempts;

    if(remain<=0){
        gameState.isMatch=false
        response(gameState)
        return;
    }

    if(guess < gameState.secret){
        gameState.lower = Math.max(gameState.lower, guess+1);
        setFeedback(1,gameState);
    }else{
        gameState.higher = Math.min(gameState.higher, guess-1);
        setFeedback(0,gameState)
    }

    DOM.userGuess.focus();
}

function response(gameState){
    DOM.resultCont.removeAttribute("hidden");
    if(gameState.isMatch){
        DOM.result.textContent=`Yay!! You guess the correct number: ${gameState.secret}`
    }else{
        DOM.result.textContent="Noo!! you are out of guesses. BETTER LUCK NEXT TIME."
    }
}

function setFeedback(num, gameState){
    if(num === 1){
        DOM.feedback.innerText=`Too low guess higher, it lies between ${gameState.lower} and ${gameState.higher}`
    }else{
        DOM.feedback.innerText=`Too high guess lower, it lies between ${gameState.lower} and ${gameState.higher}`
    }
}

DOM.submitBtn.addEventListener('click', (e)=>{
    handleGuess();
})