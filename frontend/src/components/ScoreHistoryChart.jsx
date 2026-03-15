useEffect(()=>{
 axios.get("http://127.0.0.1:8000/score-history")
   .then(res => setData(res.data))
},[])