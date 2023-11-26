import React from 'react';
import { useNavigate } from "react-router-dom";

export default function Analysis () {

  const navigate = useNavigate();
  
  const handleClick = (val) =>{
    console.log(val)
    const butoon_value = val.target.value;

    if (butoon_value === "Accident Analyzer") {
      navigate('/analysis/barchart')
    } else {
      navigate('/analysis/piechart')
    }
    
  }

  return (
    <div className='page'>
      <div className='App-header'>Analyzer</div>
      <div className='button_container'>
        <input type="button" value="Accident Analyzer" onClick={handleClick} className='route_buttons'/>
        <input type="button" value="Frauds Analyzer" onClick={handleClick} className='route_buttons'/>
      </div>
    </div>
  )
}
