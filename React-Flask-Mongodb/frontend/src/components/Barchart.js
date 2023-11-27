import React , { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Chart } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const options = [
  { value: '$Year', label: 'Year' },
  { value: '$Month', label: 'Month' }
];

const options1 = [
  { value: '$accident.Accident_Area_Type', label: 'Accident Area Type' },
  { value: '$accident.Accident_Area', label: 'Accident Place' }
];

const options2 = [
  { value: 'Sedan', label: 'Sedan' },
  { value: 'Sport', label: 'Sport' },
  { value: 'Utility', label: 'Utility' }
];

export default function Barchart() {

  const [selectedOption, setSelectedOption] = useState();

  const [selectedOptionValue, setSelectedOptionValue] = useState();

  const [barChart1,setBarChart1] = useState([]);

  const [selectedOptionLabel, setSelectedOptionLabel] = useState();

  const [selectedOption1, setSelectedOption1] = useState();

  const [selectedOptionValue1, setSelectedOptionValue1] = useState();

  const [barChart2,setBarChart2] = useState([]);

  const [selectedOptionLabel1, setSelectedOptionLabel1] = useState();

  const [option, setOption] = useState([]);

  const [selectedOptionValue2, setSelectedOptionValue2] = useState();

  const [option1, setOption1] = useState([]);

  const [selectedOptionValue3, setSelectedOptionValue3] = useState();

  const [barChart3,setBarChart3] = useState([]);

  const [selectedOptionValue4, setSelectedOptionValue4] = useState();

  const [barChart4Labels,setBarChart4Labels] = useState([]);

  const [barChart4MaleData,setBarChart4MaleData] = useState([]);

  const [barChart4FemaleData,setBarChart4FemaleData] = useState([]);


  useEffect(() => {
    axios.get("http://localhost:5000/vehiclemake").then((res) => {
     setOption(res.data.map((val) => ({value : val,label:val})));
    }).catch((error) => console.log(error));
 }, []);


  const handleChange = (event) => {
    setSelectedOption(event.label)
    setSelectedOptionValue(event.value)
  }

  const handleChange1 = (event) => {
    setSelectedOption1(event.label)
    setSelectedOptionValue1(event.value)
  }

  const handleChange2 = async (event) => {
    setSelectedOptionValue2(event.value);
    const response = await axios.post('http://localhost:5000/vehiclecategory', { vehicle: event.value });
    setOption1(response.data.map((val) => ({value:val,label:val})))
  }

  const handleChange3 = async (event) => {
    setSelectedOptionValue3(event.value);
  }

  
  const handleChange4 = async (event) => {
   setSelectedOptionValue4(event.value);
  }

  const fetchresponse = async (val) => {
    try {
      console.log(val);
      const response = await axios.post('http://localhost:5000/numberofinsurances', { option: val });
      setBarChart1(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchresponse1 = async (val) => {
    try {
      console.log(val);
      const response = await axios.post('http://localhost:5000/numberofaccidents', {  accident : val});
      setBarChart2(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchresponse2 = async (val) => {
    try {
      console.log(val);
      const response = await axios.post('http://localhost:5000/vehicleaccidents', { vehicle: val });
      setBarChart3(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchresponse3 = async (val) => {
    try {
      const response = await axios.post('http://localhost:5000/vehcilecategorygender', { Category : val });
      chartInfo(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const chartInfo = (val) => {
    try {

        const maleLabels = val[0].map((data) => data._id);
        const femaleLabels = val[1].map((data) => data._id);
        const allLabels = [...new Set(maleLabels.concat(femaleLabels))];

        setBarChart4Labels(allLabels);

        const maleData = [];
        const femaleData = [];

        for (let i = 0; i < allLabels.length; i++) {

            const label = allLabels[i];
            const maleDataPoint = val[0].find((data) => data._id === label);
            const femaleDataPoint = val[1].find((data) => data._id === label);

            if (maleDataPoint) {
              maleData.push(maleDataPoint.count);
            } else {
                maleData.push(0);
            }

            if (femaleDataPoint) {
              femaleData.push(femaleDataPoint.count);
          } else {
              femaleData.push(0);
          }
        }

        setBarChart4MaleData(maleData);
        setBarChart4FemaleData(femaleData);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
  
  const handleSubmit=(e)=> {
    e.preventDefault();
    fetchresponse(selectedOptionValue);
    setSelectedOptionLabel(selectedOption)
  }

  const handleSubmit1=(e)=> {
    e.preventDefault();
    fetchresponse1(selectedOptionValue1);
    setSelectedOptionLabel1(selectedOption1)
  }

  const handleSubmit2=(e)=> {
    e.preventDefault();
    fetchresponse2([selectedOptionValue2,selectedOptionValue3])
  }

  const handleSubmit3=(e)=> {
    e.preventDefault();
    fetchresponse3(selectedOptionValue4)
  }



  return (
    <div className='page'>
      <div className='App-header'>Barcharts</div>
      <div>
        <div className='charts'>
          <h4>Bar Chart Analyzer based on Year or Month</h4>
          <Select 
            onChange={handleChange}
            options={options}
            className="dropdown_menu"
          />
          <button className='chart_buttons' type="submit" onClick={handleSubmit}>Submit</button>
          <div className='chart_container'>
          {
            barChart1.length > 0 &&
            <div className='bar_chart'>
              <Bar
                data={{
                  labels: barChart1.map((data, i) => String(data._id)),
                  datasets: [
                    {
                      label: String(selectedOptionLabel),
                      data: barChart1.map((data) => data.count),
                      backgroundColor: '#3498db',
                      borderColor: '#3498db',
                      borderWidth: 1,
                      borderRadius: 5
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: 'black',
                        font: {
                          weight: 'bold', 
                        },
                      },
                    },
                    y: {
                      beginAtZero: true,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: 'black',
                        font: {
                          weight: 'bold',
                        },
                      },
                    },
                  },
                }}
              />
           </div>
          }
          </div>
        </div>
        <div className='charts'>
          <h4>Bar Chart Analyzer based on Accident Area or Accident Place</h4>
          <Select 
            onChange={handleChange1}
            options={options1}
            className="dropdown_menu"
          />
          <button className='chart_buttons' type="submit" onClick={handleSubmit1}>Submit</button>
          <div className='chart_container'>
          {
            barChart2.length > 0 &&
            <div className='bar_chart'>
              <Bar
                data={{
                  labels: barChart2.map((data, i) => String(data._id)),
                  datasets: [
                    {
                      label: String(selectedOptionLabel1),
                      data: barChart2.map((data) => data.count),
                      backgroundColor: '#3498db',
                      borderColor: '#3498db',
                      borderWidth: 1,
                      borderRadius: 5
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: 'black',
                        font: {
                          weight: 'bold', 
                        },
                      },
                    },
                    y: {
                      beginAtZero: true,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: 'black',
                        font: {
                          weight: 'bold',
                        },
                      },
                    },
                  },
                }}
              />
           </div>
          }
          </div>
        </div>
        <div className='charts'>
          <h4>Bar Chart Analyzer based on Vehicle Make and Vehicle Category</h4>
          <div className='dropdowns_container'>
            <Select 
              onChange={handleChange2}
              options={option}
              className="dropdown_menu"
            />
            <Select 
              onChange={handleChange3}
              options={option1}
              className="dropdown_menu"
            />
          </div>
          <button className='chart_buttons' type="submit" onClick={handleSubmit2}>Submit</button>
          <div className='chart_container'>
          {
            barChart3.length > 0 &&
            <div className='bar_chart'>
              <Bar
                data={{
                  labels: barChart3.map((data, i) => String(data._id)),
                  datasets: [
                    {
                      label: 'Vehicle Accidents',
                      data: barChart3.map((data) => data.count),
                      backgroundColor: '#3498db',
                      borderColor: '#3498db',
                      borderWidth: 1,
                      borderRadius: 5
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: 'black',
                        font: {
                          weight: 'bold', 
                        },
                      },
                    },
                    y: {
                      beginAtZero: true,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: 'black',
                        font: {
                          weight: 'bold',
                        },
                      },
                    },
                  },
                }}
              />
           </div>
          }
          </div>
        </div>
        <div className='charts'>
          <h4>Bar Chart Analyzer based on Vehicle Category based on Gender</h4>
          <Select 
            onChange={handleChange4}
            options={options2}
            className="dropdown_menu"
          />
          <button className='chart_buttons' type="submit" onClick={handleSubmit3}>Submit</button>
          <div className='chart_container'>
          {
            barChart4Labels.length > 0 &&
            <div className='bar_chart1'>
              <Bar
                data={{
                  labels: barChart4Labels,
                  datasets: [
                    {
                      label: "Male",
                      data: barChart4MaleData,
                      backgroundColor: '#3498db',
                      borderColor: '#3498db',
                      borderWidth: 1,
                      borderRadius: 5
                    },
                    {
                      label: "Female",
                      data: barChart4FemaleData,
                      backgroundColor: 'yellow',
                      borderColor: 'yellow',
                      borderWidth: 1,
                      borderRadius: 5
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: 'black',
                        font: {
                          weight: 'bold', 
                        },
                      },
                    },
                    y: {
                      beginAtZero: true,
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: 'black',
                        font: {
                          weight: 'bold',
                        },
                      },
                    },
                  },
                }}
              />
           </div> 
          } 
          </div>
        </div>
      </div>
    </div>
  )
}
