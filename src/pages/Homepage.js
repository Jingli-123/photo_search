import React, { useState, useEffect } from 'react'
import Search from '../components/Search';
import Picture from '../components/Picture';
import { config }from '../config'

const Homepage = () => {
  const [input, setInput] = useState("");
  let [data, setData] = useState(null);
  let [page, setPage] = useState(1);
  const auth = config.API_KEY
  const initialURL = "https://api.pexels.com/v1/curated?page=1&per_page=15";
  const searchURL = `https://api.pexels.com/v1/search?query=${input}&per_page=15&page=1`;
  //fetch data from pexels api 
  const search = async (url) => {
    setPage(2)
    const dataFetch = await fetch(url,{
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: auth,
      }
    });
    let parseData = await dataFetch.json(); 
    setData(parseData.photos);
  }

  //load more picture
  const morePicture = async() => {
    let newURL;
    if (input === ""){
      newURL = `https://api.pexels.com/v1/curated?page=${page}&per_page=15`;
    } else {
      newURL = `https://api.pexels.com/v1/search?query=${input}&per_page=15&page=${page}`;
    }
    setPage(page+1);
    const dataFetch = await fetch(newURL,{
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: auth,
      }
    });
    let parseData = await dataFetch.json(); 
    setData(data.concat(parseData.photos));
  }
    
  

  // fetch data when the page loading up
  useEffect(() => {
    search(initialURL);
  }, []);

  useEffect(() => {
    if (input === "") {
      search(initialURL);
    } else {
      search(searchURL);
    }
  }, [input]);
    
  return (
    <div style={{minHeight: "100vh"}}>
    <Search search={() => {search(searchURL)}} setInput={setInput}/>
    <div className='pictures'>
      {data && data.map(d =>{ 
        return <Picture data={d} />
      })}
    </div>
    <div className='morePicture'>
      <button onClick={morePicture}>Load More</button>
    </div>
    </div>
  )
}

export default Homepage