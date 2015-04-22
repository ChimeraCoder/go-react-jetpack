///<reference path="./react/react.d.ts" />
///<reference path="./typed-react/typed-react.d.ts" />

import React = require("react");
import TypedReact = require("typed-react");

export interface CommentBoxProps {
    tickInterval?: number;
}

interface CommentBoxState {
    ticksElapsed: number; }

class CommentBox extends TypedReact.Component<CommentBoxProps, CommentBoxState> {
    private interval: number;

    getInitialState() {
        return {
            data: []
        };
    }

    render() {
        console.log(this);
        console.log("props");
        console.log(this.props)
        return (
            <div className="commentBox">
                Hello world! I am a commentbox
            </div>
        )
    }
}


var RCommentBox = TypedReact.createClass(CommentBox);

React.render(
        <RCommentBox/>,

        document.getElementById('content')
);
