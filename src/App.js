import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';
import {SimpleSelect} from 'react-selectize';
import './App.css';

class App extends Component {
  state={
    data: {},
    country: "Estonia",
    countries: [],
    year: 2018,
    title: "",
    x: [],
    y: []
  }

  componentDidMount(){
    this.getData()
    this.getCountries()
  }
  getCountries(){
    axios.get(`http://api.population.io/1.0/countries/`)
      .then(res => {
        
      this.setState({countries: res.data.countries})
      })
    
    }

    
  
  getData(){
    fetch(`http://api.population.io/1.0/population/${this.state.year}/${this.state.country}/?format=json`)
      .then(response => response.json())
      .then((data) => {
        if(data.detail){
          console.log(data.detail)
          return;
        }
        this.setState({ data }, ()=>{
        this.dataToPlot()
      })}
    
    )
  }
  dataToPlot(){
    let x = []
    let y = []
    this.state.data.forEach(el=>{
      x.push(el.age)
      y.push(el.total)
    })
    this.setState({x, y})
    this.setState({title: this.state.country +", " +this.state.year})

  }
  updateYear(evt){
    this.setState({year: evt.value}, ()=> this.getData())
  }

  updateCountry(evt){
    if(!evt){
      return;
    }
    this.setState({country: evt.value}, ()=> this.getData());
  }
  render() {
    let countryOptionItems = this.state.countries.map((country, i) =>
                <option key={i} value={country}>{country}</option>
            );
    let yearOptionItems = [...Array(151)].map((el, i) => 
      <option key={i} value={"" + (i+1950) + ""}>{""+ (i+1950) + ""}</option>
    );      
    return <div className="App">

        <div className = "header"><h3>api.population.io</h3>Retrieve population tables for a given year and country. Returns tables for all ages from 0 to 100.</div>
         <Plot data={[{ y: this.state.y, type: "line" }]} layout={{ width: "100%", height: "100%", title: this.state.title }} />
        <div className="controls">
        <SimpleSelect placeholder="Change country" onValueChange={value => this.updateCountry(value)}>
         {countryOptionItems}
        </SimpleSelect>
        <SimpleSelect placeholder="Change year" onValueChange={value => this.updateYear(value)}>
          {yearOptionItems}
        </SimpleSelect>
        </div>
      </div>
  
  }
}

export default App;
