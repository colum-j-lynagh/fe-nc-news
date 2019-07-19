import React from 'react';
import { getCommentsByArticleId } from './api';
import CommentAdder from './CommentAdder';
import { deleteComment } from './api';
import VoterComponent from './VoterComponent';
import Sorter from './Sorter';
import './comments.css';

class Comments extends React.Component {
  state = { comments: [], sort: 'created_at' };
  render() {
    return (
      <>
        <CommentAdder article_id={this.props.article_id} addComment={this.addComment} username={this.props.username} />
        <Sorter setSort={this.setSort} type="comments" />
        {this.state.comments.map(comment => {
          return (
            <section className="commentsectiontag" key={comment.comment_id}>
              <VoterComponent type="comment" votes={comment.votes} id={comment.comment_id} />
              <div className="cardsdisplay">
                <h6>
                  Comment posted by {comment.author} on {new Date(comment.created_at).toString().slice(0, 21)}
                </h6>
                <h5 className="commentbody">{comment.body}</h5>
                {this.props.username === comment.author && <button onClick={() => this.handleDelete(comment.comment_id)}>Delete Comment</button>}
              </div>
            </section>
          );
        })}
      </>
    );
  }
  componentDidMount() {
    getCommentsByArticleId(this.props.article_id).then(comments => {
      this.setState({ comments });
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.sort !== this.state.sort) {
      getCommentsByArticleId(this.props.article_id, this.state.sort).then(comments => {
        this.setState({ comments });
      });
    }
  }

  addComment = commentToAdd => {
    this.setState(({ comments }) => {
      return { comments: [commentToAdd, ...comments] };
    });
  };

  handleDelete = comment_id => {
    deleteComment(comment_id); // error state
    this.setState({ comments: this.state.comments.filter(comment => comment.comment_id !== comment_id) });
  };

  setSort = event => {
    const { value } = event.target;
    this.setState({ sort: value });
  };
}

export default Comments;
