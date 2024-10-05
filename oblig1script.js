/* 
              WEATHER UPDATES
*/
const coordinates =[
  {lat: 59.913868, long: 10.752245, city:'Oslo'},
  {lat: 60.79574,  long: 10.69155,  city: 'Gjøvik'},
  {lat: 60.246028, long: 9.356566,  city:'Eggedal'},
  {lat: 48.85341,  long: 2.3488,    city: 'Paris'},
  {lat: 52.52437,  long: 13.41053,  city: 'Berlin'},
  {lat: 35.6895,   long: 139.6917,  city: 'Tokyo'}

];

async function fetchWeather(lat, long) {
const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`);
if (!response.ok) {
  throw new Error("Error with the status: " + response.status);
}
return response.json();
}



async function displayWeather(){
  const cont = document.getElementById('weather-container');


    cont.innerHTML = "";  // Fjerner alt i første load



    for (const coord of coordinates){
     try {
    // Fetch the weather data for each city
      const weatherData = await fetchWeather(coord.lat, coord.long);

      if (weatherData && weatherData.current_weather) {
       const { temperature, windspeed, winddirection, weathercode } =
        weatherData.current_weather;


       const article = document.createElement("article");

       const temp = document.createElement("h1");
       temp.innerText = `Temperature: ${temperature}°C`;
       const city = document.createElement('h2');
       city.innerText = coord.city;
       const info = document.createElement("p");
       info.innerText = `Wind: ${windspeed} km/h, Direction: ${winddirection}°, Weather Code: ${weathercode}`;

  
        article.appendChild(city);
        article.appendChild(temp);
        article.appendChild(info);
        cont.appendChild(article);

      } else{
       console.error(`Weather data for ${coord.city} not found`);
      }
    }catch (error) {
      console.error(`Failed to fetch weather data for ${coord.city}:`, error);
    }
  }
}

displayWeather();

/* 
              "ABOUT US""
*/



let start = 0;  // Start fra ID 0
const limit = 3;  // Antall poster av gangen
let isLoading = false;  // For å unngå flere fetches samtidig
let allPostsLoaded = false;  // Slutte å fetche når det er tomt/ ikke flere poster


function fetchHomeData() {
    if (isLoading || allPostsLoaded) return;  // Fetcher ikke hvis den loader eller alle er loaded



    // Fetch posts from the API with pagination
    fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`)
    .then((response) => {
      if (!response.ok) {
          throw new Error("Error with the status: " + response.status);
      }
      return response.json();
  })
        .then((posts) => {


          let container = document.getElementById("main-container");

          if (start === 0) {
            container.innerHTML = "";  // Fjerner alt i første load
        }

            if (posts.length === 0) {
                allPostsLoaded = true;  // Hvis den ikke returnerer flere poster, så reg det som at alle er postet
                return;
            }
            for (post of posts) {
                const article = document.createElement("article");
                const id = document.createElement("h1");
                id.textContent = `ID: ${post.id}`;
                const title = document.createElement("h2");
                title.textContent = post.title;
                const body = document.createElement("p");
                body.textContent = post.body;
                
                article.appendChild(id);
                article.appendChild(title);
                article.appendChild(body);
                container.appendChild(article);
            
          }
            start += limit;  // Oppdaterer batch/id-nummer underveis
          })
          .finally(() => {
            isLoading = false;  // Reset loading state
          });

}


// Funksjon for å sjekke når vi er på bunnen av siden
function checkScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // Hvis på bunnen:
    if (scrollTop + clientHeight >= scrollHeight - 1) {
        fetchHomeData();  // Fetch more posts
    }
}

// Event listener for scrolling
window.addEventListener('scroll', checkScroll);

fetchHomeData();