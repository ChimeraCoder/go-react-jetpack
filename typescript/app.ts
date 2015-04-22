///<reference path="./react/react.d.ts" />
///<reference path="./typed-react/typed-react.d.ts" />

import React = require("react");
import TypedReact = require("typed-react");

export interface TimerProps {
    tickInterval?: number;
}

interface TimerState {
    ticksElapsed: number; }

class Timer extends TypedReact.Component<TimerProps, TimerState> {
    private interval: number;

    getInitialState() {
        return {
            ticksElapsed: 0
        };
    }

    tick() {
        this.setState({
            ticksElapsed: this.state.ticksElapsed + 1
        });
    }

    componentDidMount() {
        if(!this.props.tickInterval){
            this.props.tickInterval = 500
        }
        this.interval = setInterval(this.tick, this.props.tickInterval);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        console.log(this);
        console.log("props");
        console.log(this.props)
        return React.DOM.div(null, "Ticks Elapsed: ", this.state.ticksElapsed);
    }
}


var RTimer = TypedReact.createClass(Timer);

React.render(
        <RTimer tickInterval={300} />,

        document.getElementById('content')
);
