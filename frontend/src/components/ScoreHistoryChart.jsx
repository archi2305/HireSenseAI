useEffect(()=>{
 axios.get(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/score-history`)
   .then(res => setData(res.data))
},[])