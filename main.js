const submit = document.getElementById('submit')
const select = document.getElementById('company')
const place = document.getElementById('location')
const bike = document.getElementById('bike')

submit.addEventListener('click', function(e){
  e.preventDefault()
  // On selected option, takes the value from the city attribute and stores in the city variable
  let city = select.options[select.selectedIndex].getAttribute('city');
  // On selected option, takes the value from the country attribute and stores in the country variable
  var country = select.options[select.selectedIndex].getAttribute('country');
  // On selected option, takes the value from the value attribute and stores in the href variable
  let href = select.options[select.selectedIndex].value
  console.log(city, country)
  // function call for the other api endpoint of the company
  companyInfo(href)
  // function call for the weather api
  fetchWeather(city, country)
});

fetch('http://api.citybik.es/v2/networks')
.then(res => res.json())
.then( (response) => {
  console.log(response)
  // A for loop to iterate through our array
  for(let i = 0; i < response.networks.length; i++){
    // Local variable to hold company name
    let str = ''
    // Conditional: if the company name is empty (data type null)
    if(response.networks[i].company === null){
      // If true then we skip it by increasing i by 1 so we can continue to the next company
      i++
    }else if(response.networks[i].company.length){
      // if not a string, then we loop through array again for the values
      for(let j = 0; j < response.networks[i].company.length; j++){
        // Take the values of the second array and concanate to the str variable
        str += response.networks[i].company[j]
      }
    }
    // Creates a text node from the variable str
    let text = document.createTextNode(str)
    // Creates a option html tage
    let option = document.createElement('option')
    // Takes the text node created and append that to the option html created
    option.appendChild(text)
    // Set the value attribute of the option to hold the url of the company's station
    option.value = response.networks[i].href
    // Set a new attribute with the name city to hold the city value (ex. <option city="boston">Bike Company</option>)
    option.setAttribute('city', response.networks[i].location.city)
    // Set a new attribute with the name country to hold the country value (ex. <option country="us">Bike Company</option>)
    option.setAttribute('country', response.networks[i].location.country)
    // Takes the option html created and append it to the parent select in the html DOM
    select.append(option)
    // This process is repeated until we reach the end of the array represented by `response.networks.length` in our first for loop
  }
});

function fetchWeather(city, country){
  // local variable
  let temperature;
  // APIkey for weather api
  const apiKey = '&APPID=d22d6d0cc5056b78a46536498ed1eb75'
  // Fetch call for the weather api, passing in city, country and apikey as parameters
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}${apiKey}`)
  .then(res => res.json())
  .then((response) => {
    console.log(response)
    // Clears old text stored from previous call
    document.getElementsByTagName('p')[0].innerHTML = ''
    document.getElementsByTagName('p')[1].innerHTML = ''
    document.getElementsByTagName('p')[2].innerHTML = ''
    // Sets new text from the weather api to the Dom
    document.getElementsByTagName('p')[0].innerHTML = response.weather[0].main
    document.getElementsByTagName('p')[1].innerHTML = `Description: ${response.weather[0].description}`
    document.getElementsByTagName('p')[2].innerHTML = `The temp is ${( (response.main.temp - 273.15) * (9/5) + 32)}`
  })
}



function companyInfo(company){
  fetch('http://api.citybik.es' + company + '')
  .then(res => res.json())
  .then( (response) => {
    console.log(response)
    // for loop for the network stations
    for(let x = 0; x < response.network.stations.length; x++){
      // Conditional to check if the value in free_bikes is greater than 0 to append to the DOM
      if(response.network.stations[x].free_bikes > 0){
        // Create text nodes
        let name = document.createTextNode(response.network.stations[x].name)
        let bikes = document.createTextNode(response.network.stations[x].free_bikes)
        // Create td elements
        let tdLocation = document.createElement('td')
        let tdBikes = document.createElement('td')
        // Append text node to td elements
        tdLocation.appendChild(name)
        tdBikes.appendChild(bikes)
        // Append td nodes to the parent tr element in the DOM
        place.append(tdLocation)
        bike.append(tdBikes)
        // console.log(`Number of Free Bikes: ${response.network.stations[x].free_bikes}`)
        // console.log(`At Location: ${response.network.stations[x].name}`)
      }
    }
  })
}
