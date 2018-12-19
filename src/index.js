const apiURL = 'http://localhost:3000/pups'
const dogBar = document.getElementById('dog-bar')
const dogSummaryContainer = document.getElementById('dog-info')
const goodDogFilterButton = document.getElementById('good-dog-filter')
let allDogs
let currentDog

function getDogs () {
  fetch(apiURL)
    .then(response => response.json())
    .then(json => {
      showDogs(json)
      allDogs = json
      console.log(json)
    })
}

function showDogs (json) {
  for (const dog of json) {
    showOneDog(dog)
  }
}

function showOneDog (dog) {
  let dogSpan = document.createElement('span')
  dogSpan.innerText = dog.name
  dogSpan.setAttribute('data-id', `${dog.id}`)
  dogBar.appendChild(dogSpan)
  dogSpan.addEventListener('click', showDogInfo)
}

function showDogInfo (event) {
  currentDog = allDogs[event.target.dataset.id - 1]
  dogSummaryContainer.innerHTML = `
    <img src='${currentDog.image}'>
    <h2>${currentDog.name}</h2>
    <button type='button' data-id='${currentDog.id}'></button>
    `
  let toggleGoodBadButton = dogSummaryContainer.querySelector('button')
  if (currentDog.isGoodDog) {
    toggleGoodBadButton.innerText = 'Good dog!'
  } else {
    toggleGoodBadButton.innerText = 'Bad dog!'
  }
  toggleGoodBadButton.addEventListener('click', toggleDogGoodBad)
}
function toggleDogGoodBad (event) {
  console.log('woof')
  let isGood = () => {
    if (currentDog.isGoodDog) {
      return false
    } else {
      return true
    }
  }

  fetch(apiURL + '/' + currentDog.id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ isGoodDog: isGood() })
  })
    .then(event.target.innerText === 'Good dog!' ? event.target.innerText = 'Bad dog!' : event.target.innerText = 'Good dog!')
    .then(currentDog.isGoodDog = isGood())
}

function toggleGoodDogFilter (event) {
  const dogSpans = document.querySelectorAll('span')
  if (event.target.innerText.includes('OFF')) {
    event.target.innerText = 'Filter good dogs: ON'
    for (const dogSpan of dogSpans) {
      if (allDogs[dogSpan.dataset.id - 1].isGoodDog === true) {
        console.log('I am a good dog')
        dogSpan.style.display = 'none'
      }
    }
  } else {
    event.target.innerText = 'Filter good dogs: OFF'
    for (const dogSpan of dogSpans) {
      dogSpan.style.display = ''
    }
  }
}

goodDogFilterButton.addEventListener('click', toggleGoodDogFilter)
getDogs()
