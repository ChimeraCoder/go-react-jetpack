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

class comment {
    text : string
    author : string

    constructor(text, author){
        this.text = text;
        this.author = author;
    }
}

export interface CommentListProps {
    comments : comment[]
}

export interface CommentListState {
}

class CommentList extends TypedReact.Component<CommentListProps, CommentListState>{


    render() {
        var commentNodes = this.props.comments.map(function(comment){
            return (
                <div>
                    Comment is {comment.author}
                    text is {comment.text}
                </div>
            )
        });

        return (
                <div className="commentList">
                    {commentNodes}
                </div>
        )
            

    }
}


var RCommentBox = TypedReact.createClass(CommentBox);

var RCommentList = TypedReact.createClass(CommentList);

var testComments = [
    new comment("asdf", "Mr. Foo"),
    new comment("qwer", "Ms. Bar"),
]

React.render(
        <RCommentList comments={testComments}/>,

        document.getElementById('content')
);
