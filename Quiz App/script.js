//Access Elements
let spanCount = document.querySelector('.count span')
let bulletSpanContainer = document.querySelector(".spans")
let quizArea =document.querySelector('.quiz-area')
let answersArea = document.querySelector('.answers-area')
let btn = document.querySelector('.submit_button')
let bullets = document.querySelector('.bullets')
let resultArea = document.querySelector('.results')
let countdownArea = document.querySelector('.countdown')

//Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
let rightAnswerIndex = []

// Get Data From Json File And Convert It To Object
function getQuestions(){
    let myRequest = new XMLHttpRequest()
    myRequest.onreadystatechange = function (){
        if(this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText)
            // Question Number
            let qCount = questionsObject.length

            //Create Bullets Ans Set Question Count
            CreateBullets(qCount)

            //Add Question Data
            addQuestionData(questionsObject[currentIndex],qCount)

            //Start Countdown 
            countdown(15,qCount)

            //Click On Submit
            btn.addEventListener('click',() =>{
                
                //Get Right Answer
                let rightAnswer = questionsObject[currentIndex]['right_answer']

                //Increase Index
                currentIndex++

                //get right question
                checkAnswer(rightAnswer,qCount)

                //Remove Previous Question
                quizArea.innerHTML = ''
                answersArea.innerHTML = ''
                addQuestionData(questionsObject[currentIndex],qCount)

                //handle bullets classes
                handleBullets()

                //Star countDown For The Next Question
                clearInterval(countDownInterval)
                countdown(15,qCount)

                //show result

                showResult(qCount)

            })
        }
    }
    myRequest.open("GET","questions.json",true)
    myRequest.send()
}
getQuestions()

let CreateBullets = (num) =>{
    spanCount.innerHTML = num

    //create spans

    for (var i = 0; i < num ; i++){

        //create bullet
        let theBullet = document.createElement("span")

        if(i === 0){
            theBullet.className = 'on'
        }

        // Append Bullet To The Main Bullets
        bulletSpanContainer.appendChild(theBullet)

    }
}
function addQuestionData(obj,count){

    if(currentIndex < count){
        let questionTitle = document.createElement('h2')

        //create Question Text
        let questionText = document.createTextNode(obj['title'])

        questionTitle.appendChild(questionText)

        quizArea.appendChild(questionTitle)
        /* --------------- */
        // create the answers
        for(let i = 1 ; i <= 4; i++){
            //create div container
            let content = document.createElement('div')
            content.className = 'answer'
            
            //create input radio
            let input = document.createElement('input')
            input.type = 'radio'
            input.name = 'questions'
            input.id = `answer_${i}`
            input.dataset.answer = obj[`answer_${i}`]

            // Make First Input Selected
            if(i === 1){
                input.checked = true
            }

            //create label

            let label = document.createElement('label')
            label.htmlFor = `answer_${i}`

            label.innerHTML = obj[`answer_${i}`]

            //Append Element To Div
            content.appendChild(input)
            content.appendChild(label)

            //Append To Answers Area
            answersArea.appendChild(content)
        }
    }
    
}
function checkAnswer(rAnswer,count){
    let answers = document.getElementsByName('questions')
    
    let theChosenAnswer;
    answers.forEach(answer =>{
        answer.checked ? theChosenAnswer = answer.dataset.answer : theChosenAnswer;
    })

    if(rAnswer === theChosenAnswer){
        rightAnswers++
        
    }

}
function handleBullets(){
    let bulletsSpans = document.querySelectorAll('.bullets .spans span')
    let arrayOfSpans = Array.from(bulletsSpans)
    
    arrayOfSpans.forEach((span,index) =>{
        if(currentIndex === index){
            span.className = 'on'
            span.previousElementSibling.className = ''
        }
    })
}
function manyRemove(...ele){
    ele.forEach((e) =>{
        e.remove()
    })
}
function showResult(count){
    let result;
    if(currentIndex === count){
        manyRemove(quizArea,answersArea,btn,countdownArea)

        if(rightAnswers > count / 2 && rightAnswers < count){
            result = `<span class='good'>Good</span> ${rightAnswers} From ${count} Is Correct`
        }
        else if(rightAnswers === count){
            result = `<span class='perfect'>Perfect</span> ${rightAnswers} From ${count} Is Correct`
        }
        else{
            result = `<span class='bad'>Bad</span> ${rightAnswers} From ${count} Is Correct`
        }
        resultArea.innerHTML = result
    }
}

function countdown(duration, count){
    if(currentIndex < count){
        let minutes, seconds;
        countDownInterval = setInterval(() =>{
            minutes = parseInt(duration / 60)
            seconds = parseInt(duration % 60)

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countdownArea.innerHTML = `${minutes} : ${seconds}`

            if(--duration < 0){
                clearInterval(countDownInterval)
                btn.click()
            }
        },1000)
    }
}






























