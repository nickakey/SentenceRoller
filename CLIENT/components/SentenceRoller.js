import _ from "underscore";
import React from 'react';
import axios from "axios-jsonp-pro";
import SynonymSelector from "./SynonymSelector";
import styled, { css } from 'react-emotion';
import Button from "../reusableComponents/Button.js";
import DropDown from "../reusableComponents/DropDown.js";

const inlineBlock = css`
    display: inline-block;
`
const textAlignCenter = css`
    text-align: center;
`

const topRightButton = css`
    display: inline-block;
    position: absolute;
    left: 81%;
    top: 13%;
    width: 300px;    
`

const centeredContainer = css`
    /* basically anytime you want center, use position absolute, because html hates vertical stuff  */
    position: absolute;
    /* These top and left mean 50% FROM the parent element */
    top: 40%;
    left: 50%;

    /* without these, the far left side of this element would be at the 50% mark of the parent elemnet.
    WITh this translate, we shift the element 50% to the left, such that now it's actually centered */
    transform: translate(-50%, -50%);
`

const keyWords = css`
    display: inline-block;
    margin: 10px;
    margin-left: 20px;
    margin-right: 20px;
`

class SentenceRoller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        keyWords: props.keyWords,
        displaySynonymSelector: false,
        selectedKeyWord: null,
        synonyms: props.synonyms,
        selectedKeyWordIndex: null
    }
  }

  handleKeyWordClick(keyword, index){
      console.log("handle keyword click is firing");
      this.getSynonyms(keyword)
      .then((synonyms)=>{
        this.setState({
            synonymsOfSelectedKeyWord: synonyms, 
            selectedKeyWord: keyword, 
            displaySynonymSelector: true,
            selectedKeyWordIndex: index
        })
      })   
      .catch((err)=>{
          console.log("this is the err in handlekeyword click ", err)
        if(err.toString().includes("Request timed out")){alert("We could not find any synonyms for this word... Please try again")} else {
            alert("an error has occurred while fetching synonyms, please check your network connection and try again ");
        }
      })
  }

  handleSynonymClick(synonym){
      this.setState(
        (state)=>{state.keyWords[state.selectedKeyWordIndex] = synonym},
        ()=>{this.closeSynonymMenu()}
      )
  }

  closeSynonymMenu(){
    this.setState((state)=>{
        state.displaySynonymSelector = false;
        state.selectedKeyWord = null;
        state.synonymsOfSelectedKeyWord = [];
        state.selectedKeyWordIndex = null;
    })
}  

  render() {
    return (
        <div>
            <div className={centeredContainer}>
                    {this.state.displaySynonymSelector ? 
                        <SynonymSelector 
                            handleSynonymClick={this.handleSynonymClick.bind(this)}
                            synonyms={this.state.synonymsOfSelectedKeyWord} 
                            keyword={this.state.selectedKeyWord}
                            handleCloseMenu={this.closeSynonymMenu.bind(this)}
                        /> 
                        : ""
                    }
            
            <div className={textAlignCenter}>
                {this.state.keyWords.map((keyword, index)=>{
                    return <DropDown topItem={"TOP ITEM"} dropDownItems={["1", "2", "3"]}></DropDown>
                    // return <span className={keyWords} key={index} onClick={this.handleKeyWordClick.bind(this, keyword, index)}>{keyword}</span>
                })}
            </div>
            </div>
            <div className={css`${textAlignCenter} ${topRightButton}`}>
                <Button handleOnClick={this.props.handleNewSentence} text={"New Sentence"}></Button>
            </div>
        </div>
        )
    }
} 
export default SentenceRoller;


