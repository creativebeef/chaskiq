
import React, { Component } from 'react';
import styled from "styled-components"
import { Picker } from 'emoji-mart'
import {EmojiBlock} from "./styles/emojimart"

import {Selector, ResultSort, Rating} from "react-giphy-selector";

const EditorContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    min-height: 56px;
    max-height: 200px;
    border-top: 1px solid #e6e6e6;

`;

const EditorActions = styled.div`
  box-sizing: border-box;
  -webkit-box-pack: end;
  justify-content: flex-end;
  -webkit-box-align: center;
  align-items: center;
  display: flex;
  padding: 12px 1px;
`

const EditorWrapper = styled.div`
  /*height: 100px;
  display: flex;*/
  width: 80vw;
`

const Input = styled.textarea`
    box-sizing: border-box;
    position: absolute;
    bottom: 0px;
    left: 0;
    color: #000;
    resize: none;
    border: 0;
    padding: 18px 100px 20px 16px;
    width: 100%;
    height: 100%;
    font-family: "Helvetica Neue","Apple Color Emoji",Helvetica,Arial,sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.33;
    background-color: #fff;
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: left;
    outline: transparent;
    &:focus {
      background-color: #fff;
      -webkit-box-shadow: 0 0 100px 0 rgba(0,0,0,.1);
      box-shadow: 0 0 100px 0 rgba(0,0,0,.1);
    }
}
`

const EditorButtons = styled.div`
    position: absolute;
    top: 0;
    right: 21px;

    button.emoji {
      width: 18px;
      padding-left: 8px;
      padding-right: 8px;
    }

    button.send {
      width: 15px;
      padding-left: 8px;
      padding-right: 8px;
      top: 1px;
    }
  }
`


export default class UnicornEditor extends Component {

  constructor(props) {
    super(props)
    this.input = null
    this.state = { 
      text: '',
      emojiEnabled: false,
      giphyEnabled: false
    }
  }

  componentDidMount() {
  }

  //https://stackoverflow.com/questions/11076975/insert-text-into-textarea-at-cursor-position-javascript
  insertAtCursor = (myValue)=> {
    const myField = this.input
    //IE support
    if (document.selection) {
      myField.focus();
      sel = document.selection.createRange();
      sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      myField.value = myField.value.substring(0, startPos)
        + myValue
        + myField.value.substring(endPos, myField.value.length);
    } else {
      myField.value += myValue;
    }
  }

  onChange = (editorState) => {
    this.setState({
      text: editorState
    });
  };

  handleClick = (e) => {
    this.props.insertComment(this.input.value, () => {
      console.log("saved!")
      this.input.value = ""
    })
  }

  handleReturn = (e) => {
    if (e.key === "Enter") {
      this.handleClick(e)
      return
    }
  }

  handleFocus = (e) => {
    this.input.focus()
  }

  toggleEmojiClick = (e) => {
    e.preventDefault()
    this.toggleEmoji()
    this.setState({ emojiEnabled: !this.state.emojiEnabled })
  }

  toggleEmoji = (e)=>{
    this.setState({emojiEnabled: !this.state.emojiEnabled})
  }

  toggleGiphy = (e)=>{
    e.preventDefault()
    this.setState({ giphyEnabled: !this.state.giphyEnabled })
  }

  handleEmojiInsert = (e)=>{
    this.toggleEmoji()
    this.insertAtCursor(e.native)
  }

  render() {
    return (

      <EditorWrapper onClick={this.handleFocus}>
        <EditorContainer>

          {
            this.state.emojiEnabled ? 
              <EmojiBlock>
                <Picker set='emojione'
                  emojiSize={20}
                  emoji='' 
                  title="hey"
                  onSelect={this.handleEmojiInsert} />
              </EmojiBlock> : null 
          }

          {
            this.state.giphyEnabled ? 
            <EmojiBlock>
                <Selector
                  apiKey="97g39PuUZ6Q49VdTRBvMYXRoKZYd1ScZ"
                  onGifSelected={this.saveGif} 
                />
              </EmojiBlock> : null
          }

          <Input onKeyPress={this.handleReturn} 
            innerRef={comp => this.input = comp}>
            {/*<div id="editore" ref="editore"/>*/}
          </Input>
          <EditorButtons>
            <button className="emoji" onClick={this.toggleEmojiClick}>
              emojo
            </button>
            <button className="send" onClick={this.toggleGiphy}>
              giphy
            </button>
            <button className="send--">send</button>
          </EditorButtons>
        </EditorContainer>

      </EditorWrapper>


    );
  }
}