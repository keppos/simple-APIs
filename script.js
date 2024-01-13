// Test jquery

$(document).ready(function () {
  $("#go-to-settings").click(function () {
    $("html, body").animate(
      {
        scrollTop: $(".settings").offset().top,
      },
      500
    )
  })
})

// Hämta IP adress från ipify API
fetch("https://api.ipify.org?format=json")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("ip-address").textContent = data.ip

    // Hämta plats från ipapi API
    fetch(`https://ipapi.co/${data.ip}/json/`)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById(
          "location"
        ).textContent = `${data.city}, ${data.region}, ${data.country}`
      })
      .catch((error) => {
        console.error("Unable to fetch location", error)
      })
  })
  .catch((error) => {
    console.error("Unable to fetch IP address", error)
  })

// Dagens skämt
const jokeUrl = "https://official-joke-api.appspot.com/random_joke"

async function getJoke() {
  try {
    const response = await fetch(jokeUrl)
    const joke = await response.json()
    return joke
  } catch (error) {
    console.log(error)
  }
}

function displayJoke(joke) {
  const jokeEl = document.querySelector("#joke")
  jokeEl.textContent = `${joke.setup} ${joke.punchline}`
}

// Hämtar en slumpmässig vits när sidan laddas
getJoke().then((joke) => {
  displayJoke(joke)
})

// Error i consolen, var tvungen att göra så html sidan laddar in före scriptet körs
document.addEventListener("DOMContentLoaded", () => {
  const activityElem = document.getElementById("activity")

  async function getActivity() {
    const response = await fetch("https://www.boredapi.com/api/activity")
    const data = await response.json()
    const activity = data.activity
    activityElem.textContent = activity
  }

  getActivity()
})

// Få svar från OpenAI
function getAnswer() {
  const question = $("#question").val()
  const apiKey = $("#openaiapikey").val() // få värdet från api input field
  const url = `https://openai-ama-api-fw-teaching.rahtiapp.fi/?api_key=${apiKey}`
  const data = JSON.stringify(question)

  $.ajax({
    url: url,
    type: "POST",
    data: data,
    contentType: "application/json",
    success: function (data) {
      const answer = data.answer
      $("#answer").html(answer)
      $("#error-message").hide()
    },
    error: function (error) {
      console.error(error)
      $("#answer").html("") // ta bort answer ifall det är ett error
      $("#error-message").show() // visa error meddelande
    },
  })
}

// Weather
// Kollar ifall API finns i localStorage
function getWeather() {
  const weatherApiKey = $("#weatherapikey").val() // få värdet från api input field

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const iconUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
        const weatherInfo = `
          <p>${data.name}, ${data.sys.country}</p>
          <p>${data.main.temp} &deg;C</p>
          <p>${data.weather[0].description}</p>
          <img src="${iconUrl}" alt="${data.weather[0].description}" />
        `

        document.getElementById("weather-info").innerHTML = weatherInfo
      })
      // Error meddelande
      .catch((error) => {
        console.log(error)
        document.getElementById("weather-info").innerHTML =
          "<p>Something went wrong. Please enter a valid API Key in settings...</p>"
      })
  })
}

// Får användare via apin till selectorn i formuläret
async function getUsers() {
  const resp = await fetch("http://localhost:8349/users")
  const respJson = await resp.json()

  console.log(respJson)
  const users = respJson
  // Skapar en tom options sträng
  let options = ""

  // Loopar igenom users arrayen och skapar ett alternativ för varje user
  for (const user of users) {
    options += `
        <option value="${user.id}">
            ${user.username}
        </option>
        `
  }
  document.querySelector("#user").innerHTML += options
}
getUsers()

async function getCategories() {
  const resp = await fetch("http://localhost:8349/categories")
  const respJson = await resp.json()

  console.log(respJson)
  const categories = respJson
  // Skapar en tom options sträng
  let options = ""

  // Loopar igenom cateogries arrayen
  for (const category of categories) {
    options += `
        <option value="${category.id}">
            ${category.category_name}
        </option>
        `
  }
  document.querySelector("#category").innerHTML += options
}
getCategories()

// Funktion för att skapa en ny todo
async function createTodo() {
  const todo = {
    id: 1,
    user_id: 1,
    category_id: document.querySelector("#category"),
    title: document.querySelector("#title"),
    done: 1,
    due_date: Number(document.querySelector("#due-date")).value,
  }

  console.log(todo)
  const resp = await fetch("http://localhost:8349/todo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  })

  const respJSON = await resp.json()
  document.querySelector("#message").innerHTML = `
                ToDo added.
            `
  getTodos()
  console.log(respJSON)
}
