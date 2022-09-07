/* Global Variables */
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = `&appid=108f97552d9714a5f57723ec9d0194a2&units=metric`;
const zipElement = document.getElementById("zip");
const feelingsElement = document.getElementById("feelings");

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth() + 1) +'/'+ d.getDate()+'/'+ d.getFullYear();

//Adding a click event to the generate button
document.getElementById("generate").addEventListener("click", handleClick);

/**
 * @param {string} baseURL the base url of the api to call the services of openWeatherMap api
 * @param {string} zipCode the zip code entered by the user
 * @param {string} key private personal key to access the api provided by openWeatherMap
 * @description an async function to implement get request on the client side
 */
const getTemperature = async (baseURL, zipCode, key) => {
    //make a call to the server
    const response = await fetch(baseURL + zipCode + key);
    //in case the call is fulfilled
    try {
        const weatherData = await response.json();
        // if request is successful return the data
        if(weatherData.cod === 200) {
            return weatherData;
        } else {
            //else throw an error carrying the error message in the response to be displayed to the user
            throw weatherData.message;
        }
    } catch (error) { //catch error if call is rejected
        alert(error);
    }
}

/**
 * @param {string} url the post route specified in the server.js file
 * @param {object} data an object that holds data to be posted {temperature, date, user feelings}
 * @description an async function to implement post request on the client side
 */
const postAllData = async (url = '', data = {}) => {
    //make a call to the server
    const response = await fetch (url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    });
    // if the call is fulfilled
    try {
        const postedData = await response.json();
        return postedData;
    } catch (error) { // in case of an error
        alert(error);
    }
}

/**
 * @description a function that targets the desired dom elements to update them dynamically with the desired info
 */
const updateUI = async () => {
    const response = await fetch("/getData");
    try {
        const data = await response.json();
        document.getElementById("date").innerHTML = "Date: " + data.date;
        document.getElementById("temp").innerHTML = "Temperature: " + data.temperature + " °C";
        document.getElementById("content").innerHTML = "Your feeling: " + data.userResponse;
    } catch(error) {
        alert(error);
    }
} 

/**
 * @param {event} event click event
 * @description a function that calls the necessary api calls after the user click on the generate button
 */
function handleClick (event) {
    const zipCode = zipElement.value;
    const feelings = feelingsElement.value;
    if(feelings && zipCode) {
        getTemperature(baseURL, zipCode, apiKey)
        .then((data) => {
            postAllData("/addData", {temperature: data.main.temp, date: newDate, feelings: feelings})
        })
        .then(() => {
            updateUI();
        })
    } else {
        // an alert message to notify the user that at least one field is empty
        alert("Please fill out both fields then click on the button");
    }
}