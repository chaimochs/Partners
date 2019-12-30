// Define REST function
const httpClient = (Url, callback) => {
  //This is necessary to avoid CORS error
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
  let xhr = new XMLHttpRequest();
     xhr.onreadystatechange = () => { 
          if(xhr.readyState == 4 && xhr.status == 200)
              callback(xhr.responseText);
      }
      xhr.open("GET", proxyurl + Url); 
      xhr.send();
  }
  
  //Converts degrees to radians
  const toRadians = (degrees) => {
    return degrees * (Math.PI/180);
  }
  
  // Function checks whether location is within x km of <In this case, London>
  const checkMaxKm = (max, lat1, lon1, lat2, lon2) => {
  const maxDistance = 100000 //Km converted to meters  
  const earthRadius = 6371e3; 
  let la1 = toRadians(lat1),
      la2 = toRadians(lat2),
      diffLong = toRadians(lon2 - lon1);
  let d = Math.acos( Math.sin(la1)*Math.sin(la2) + Math.cos(la1)*Math.cos(la2) * Math.cos(diffLong) ) * earthRadius;
  if(d <= maxDistance) {
    return true
    } else {
      return false
      };
  }

      const latLondon = 51.515419, lonLondon = -0.141099;
      const Url = 'https://success.spidergap.com/partners.json';
      // Actual GET request and data manipulation
      httpClient(Url, res => {
        //Inserts the server response into the html
        document.getElementById('partners').innerHTML =
        '<h3 style="color: blue;">Customers with offices within 100 KM of Central London</h3>' + 
        //Checks the response for companies that have offices within 100km of London
          JSON.parse(res).filter(z => z.offices.some(c => checkMaxKm(100, c.coordinates.split(",")[0],c.coordinates.split(",")[1], latLondon, lonLondon)))
          //In alphabetical order
          .sort()
          //parses the data
          .map(d => 
           `<table>
              <tr>
                <th>${d.organization}</th>
              </tr>
              <tr>
              <!-- Adds the offices within 100km of London to the html-->
                  ${d.offices.map(e => checkMaxKm(
                      100,
                      e.coordinates.split(",")[0],
                      e.coordinates.split(",")[1], 
                      latLondon, 
                      lonLondon)  ? 
                    `<tr>
                    <td>
                    ${e.address}
                    </td>
                    </tr>
                    ` : 
                    null)}
              </tr>
            </table>`
          )
      })