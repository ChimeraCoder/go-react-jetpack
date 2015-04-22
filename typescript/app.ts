///<reference path="./react/react.d.ts" />
///<reference path="./typed-react/typed-react.d.ts" />
///<reference path="jquery/jquery.d.ts" />

import React = require("react");
import TypedReact = require("typed-react");

export interface CommentBoxProps {
    url : string
}

interface CommentBoxState {
    comments : comment[]
}

class CommentBox extends TypedReact.Component<CommentBoxProps, CommentBoxState> {
    private interval: number;

    getInitialState() {
        return {
            comments: []
        };
    }

    handleCommentSubmit(c : comment) : void {
        var comments = this.state.comments;
        var newComments = comments.concat(c);
        this.setState({comments: newComments});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: c,
            success: function(data){
                this.setState({comments: data});
            },
            error: function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    render() {
        console.log(this);
        console.log("props");
        console.log(this.props)
        return (
            <div className="commentBox">
                Hello world! I am a commentbox
                <RCommentForm onCommentSubmit={this.handleCommentSubmit} />
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

export interface CommentFormProps {
    onCommentSubmit : (c : comment) => void
}

export interface CommentFormState {
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


class CommentForm extends TypedReact.Component<CommentFormProps, CommentFormState>{
    refs: any

    handleSubmit(e : Event){
        e.preventDefault();
        var author = React.findDOMNode(this.refs.author)["value"].trim();
        var text = React.findDOMNode(this.refs.text)["value"].trim();
        if(!text || !author){
            return;
        }
        this.props.onCommentSubmit(new comment(author, text));
        React.findDOMNode(this.refs.author)["value"] = '';
        React.findDOMNode(this.refs.text)["value"] = '';
        return; 
    }


    render(){
        return (
                <form className="commentForm" onSubmit={this.handleSubmit} >
                    <input type="text" placeholder="Your name" ref="author" />
                    <input type="text" placeholder="Say something..." ref="text"/>
                    <input type="submit" value="Post" />
                </form>
        )
    }
}




var RCommentBox = TypedReact.createClass(CommentBox);

var RCommentList = TypedReact.createClass(CommentList);
 
var RCommentForm = TypedReact.createClass(CommentForm);

var testComments = [
    new comment("asdf", "Mr. Foo"),
    new comment("qwer", "Ms. Bar"),
]

React.render(
        <RCommentBox url="comments.json" />,

        document.getElementById('content')
);
