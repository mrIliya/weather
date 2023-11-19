const getDayOfTheWeek=(date)=>{
    const day = new Date(date).toLocaleDateString('en-EN', { weekday: 'long' }) 
    return day
}

export default getDayOfTheWeek