import React from 'react'

function  HeatmapCalender ({startDate, endDate, dataValues} : {startDate : any, endDate : any, dataValues : any}) {

    let startingDate : any = new Date(startDate)
    let endingDate : any = new Date(endDate);
    const daysInMonth = Math.ceil((endingDate - startingDate) / (1000 * 60 * 60 * 24)) + 1;
    const calenderGrid = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(startingDate);
        date.setDate(startingDate.getDate() + i)
        return date.toISOString().slice(0, 10);
    })

    const highestValue = dataValues?.reduce((a : any, b : any) => Math.max(a, b.count), -Infinity)

    const getIntensity = (activityCount : any) => {
        return highestValue !== 0 ? Number(activityCount / highestValue) : 0;
    }
    const getColorFromIntensity = (intensity : any) => {
        const colorCodes = ['#FFEEEE', '#FFCCCC', '#FFAAAA', '#FF8888', '#FF6666', '#FF4444'];
        const colorIndex = Math.min(Math.floor((intensity * colorCodes.length)), colorCodes.length - 1)
        // console.log(colorIndex, ' color index here')
        return colorCodes[colorIndex]
    }
  return (
    <div className='grid grid-flow-col gap-1' style={{gridTemplateRows: 'repeat(7, minmax(0, 1fr)'}}>
        {calenderGrid.map((day, index)=>{
            const activityCount = dataValues.find((item : any)=> item.date === day)?.count || 0;
            const intensity = getIntensity(activityCount);
            const color = getColorFromIntensity(intensity)
            return <div key={index} className='w-4 h-4 rounded cursor-pointer bg-gray-400' title={`${activityCount} Posts on ${day}`} style={{backgroundColor: `${activityCount == 0 ? "#ffffff10" : String(color)}`}}></div>
        })}
    </div>
  )
}

export default HeatmapCalender