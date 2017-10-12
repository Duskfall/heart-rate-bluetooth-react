import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            data : []
        }
    }
    componentDidMount() {

        var host = window.document.location.host.replace(/:.*/, '');
        var ws = new WebSocket('ws://' + host + ':8080');
        ws.onmessage = (event) => {
            //updateStats(JSON.parse(event.data));
            this.setState({
                data: JSON.parse(event.data)
            })
        };
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <h3>Bluetooth devices</h3>
                <br/>
                <ul className="list-group">
                    {this.state.data.map((hrm) =>
                    <li className="list-group-item">
                        <span className="vendor">{hrm.name}</span> :
                        <span className={`heartrate ${hrm.heartRate > 120 && hrm.heartRate < 160 ? `blue` : hrm.heartRate >= 160 && hrm.heartRate < 180 ? `green` : hrm.heartRate >= 180 ? `red` : ""}`}>{hrm.heartRate}</span>
                    </li>
                    )}
                </ul>
            </div>
        );
    }
}

export default App;
