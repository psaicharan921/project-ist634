import React , { useState , useEffect} from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import Select from 'react-select';


const options = [
  { value: 0 , label: 'Not Fraud' },
  { value: 1 , label: 'Fraud' }
];


export default function Piechart() {

  const [pieChart1,setPieChart1] = useState([]);

  const [option, setOption] = useState([]);

  const [selectedOptionValue, setSelectedOptionValue] = useState();

  const [pieChart2,setPieChart2] = useState([]);

  const [pieChart3,setPieChart3] = useState([]);

  const [selectedOptionValue1, setSelectedOptionValue1] = useState();

  const [pieChart4,setPieChart4] = useState([]);




  useEffect(() => {
    axios.get("http://localhost:5000/frauds").then((res) => {
     setPieChart1(res.data);
    }).catch((error) => console.log(error));

    axios.get("http://localhost:5000/vehiclemake").then((res) => {
      setOption(res.data.map((val) => ({value : val,label:val})));
     }).catch((error) => console.log(error));
 }, []);


 const handleChange = async (event) => {
  setSelectedOptionValue(event.value);
}

const handleChange1 = async (event) => {
  setSelectedOptionValue1(event.value);
}

const fetchresponse = async (val) => {
  try {
    console.log(val);
    const response = await axios.post('http://localhost:5000/fraudvehicleinsurances', { Vehicle : val });
    setPieChart2(response.data[0]);
    setPieChart3(response.data[1]);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const fetchresponse1 = async (val) => {
  try {
    console.log(val);
    const response = await axios.post('http://localhost:5000/insuranceamountpercentage', { Fraud : val });
    setPieChart4(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const handleSubmit=(e)=> {
  e.preventDefault();
  fetchresponse(selectedOptionValue);
}

const handleSubmit1=(e)=> {
  e.preventDefault();
  fetchresponse1(selectedOptionValue1);
}




//  const generateRandomColors = (count) => {
//   const colors = [];
//   for (let i = 0; i < count; i++) {
//     const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
//     colors.push(randomColor);
//   }
//   return colors;
// };

const pieChartColors = [ '#2ecc71','#e74c3c'];

const pieChartColors1 = [ '#2ecc71','#e74c3c', '#ecf0f1', '#2c3e50', '#2980b9', '#27ae60', '#f39c12', '#c0392b', '#3498db', '#9b59b6', '#e67e22', '#1abc9c', '#f1c40f', '#34495e'];



  return (
    <div className='page'>
      <div className='App-header'>Frauds Analyzer</div>
      <div className='charts1'>
        <div className='pie_chart'>
              <Pie
                data={{
                  labels: ["Not Fraud","Fraud"],
                  datasets: [
                    {
                      label: "Count",
                      data: pieChart1.map((data) => data.count),
                      backgroundColor:pieChartColors
                    },
                  ],
                }}
              />
           </div>
      </div>
      <div className='charts'>
          <h4> Pie Chart</h4>
          <Select 
            // defaultValue={selectedOption}
            onChange={handleChange1}
            options= {options}
            className="dropdown_menu"
          />
          <button className='chart_buttons' type="submit" onClick={handleSubmit1}>Submit</button>
        <div className='chart_container'>
          {
            pieChart4.length > 0  &&
            <div className='pie_chart2'>
                <Pie
                  data={{
                    labels: pieChart4.map((data) => String(data._id)),
                    datasets: [
                      {
                        label: "Percentage",
                        data: pieChart4.map((data) => data.percentage),
                        backgroundColor:pieChartColors1
                      },
                    ],
                  }}
                />
            </div>
          }
        </div>
      </div>
      <div className='charts'>
          <h4> Pie Chart</h4>
          <Select 
            // defaultValue={selectedOption}
            onChange={handleChange}
            options= {option}
            className="dropdown_menu"
          />
          <button className='chart_buttons' type="submit" onClick={handleSubmit}>Submit</button>
        <div className='chart_container'>
          {
            (pieChart2.length > 0 || pieChart3.length > 0) &&
            <div className='pie_chart1'>
                <Pie
                  data={{
                    labels: pieChart2.map((data, i) => String(data.Make)),
                    datasets: [
                      {
                        label: "Average",
                        data: pieChart2.map((data) => data.avg),
                        backgroundColor:pieChartColors1
                      },
                    ],
                  }}
                />
                <Pie
                  data={{
                    labels: pieChart3.map((data, i) => String(data.Make)),
                    datasets: [
                      {
                        label: "Average",
                        data: pieChart3.map((data) => data.avg),
                        backgroundColor:pieChartColors1
                      },
                    ],
                  }}
                />
            </div>
          }
        </div>
      </div>
    </div>
  )
}
