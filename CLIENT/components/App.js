import { synonymsFormatter } from "../utilities";
import SentenceRoller from "./SentenceRoller";
import KeyWordInputWindow from "./KeyWordInputWindow";
import LoadingScreen from "./LoadingScreen.js";
import React from 'react';
import styled, { css } from 'react-emotion';
import { injectGlobal } from 'emotion';
import axios from "axios-jsonp-pro";

injectGlobal`
  * {
    @import url('https://fonts.googleapis.com/css?family=Work+Sans');
    font-family: 'Work Sans', sans-serif;
    box-sizing: border-box;    
    margin: 0px;
    padding: 0px;
    color: black;
  }
`

const background = css`
    background-image: linear-gradient(
        to right bottom,
        rgba(220, 76, 76, 0.8),
        rgba(190, 105, 60, 0.71)),
        url("https://images.pexels.com/photos/264635/pexels-photo-264635.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940");
    height: 100vh;
    width: 100vw;
    background-size: cover;
    background-position: center;
    clip-path: polygon(0 10%, 100% 10%, 100% 90%, 0 90% );
`


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      keyWords: [],
      synonyms: {0: [], 1: [], 2: [], 3: []},
      synonymsFetched: false,
      numberOfWordSlots: 4,
      loading: false,
    };
  }

  isFirstRender(){
    return this.state.keyWords.length === 0
  }

  handleKeyWordChange(index, value){
    this.setState((state)=>{
      state.keyWords[index] = value;
      console.log(this.state)
      return state;
    })
  }

  getSynonyms(keyWords){
    return new Promise((resolve, reject)=>{
      console.log("we in here! ", keyWords)
      const allRequestPromises = keyWords.map((keyword)=>{
        return axios.jsonp(`http://thesaurus.altervista.org/thesaurus/v1?word=${keyword}&language=en_US&output=json&key=yj7S3AHHSC5OTOF3rJhK`, 
                  {timeout: 2500}
              )
      });
      Promise.all(allRequestPromises)
      .then((results)=>{
        const formattedSynonyms = synonymsFormatter(results)
        resolve(formattedSynonyms);
      })
      .catch((err)=>{
        console.log("this is the errr ", err);
        reject(err);
      })
    })



    // return new Promise((resolve, reject)=>{
    //   axios.jsonp(`http://thesaurus.altervista.org/thesaurus/v1?word=${keyword}&language=en_US&output=json&key=yj7S3AHHSC5OTOF3rJhK`, 
    //       {timeout: 2500}
    //   )
    //   .then(({response})=>{
    //       console.log("this is the response... " ,response)
    
    //       resolve(formattedSynonyms);
    //   })
    //   .catch((err)=>{
    //       console.log("this is the err in it's fullness .... ", err)
    //       reject(err);
    //   })
    // })
  }

  handleKeyWordSubmit(){
    if(this.state.keyWords.length > 0){
      console.log("this.state.keyWords ", this.state.keyWords)
      this.setState({loading: true});
      this.getSynonyms(this.state.keyWords)
      .then((synonyms)=>{
        this.setState({synonymsFetched: true, synonyms: synonyms, loading: false})
      })
    } else {
      alert("Enter at least 1 keyword before submitting")
    }
  }

  handleNewSentence(){
    this.setState({
      keyWords: [],
      synonyms: {0: [], 1: [], 2: [], 3: []},
      synonymsFetched: false,
      numberOfWordSlots: 4,
    })
  }

  addNewWordSlot(){
    this.setState((state)=>{state.numberOfWordSlots++; return state})
  }

  render() {
    if(this.state.loading){
      return (
        <div className={background}>
          {/* <div> */}
          <LoadingScreen/>
          {/* </div> */}
        </div>
      ) 
    }
    if(this.state.synonymsFetched){
      return (
        <span>
          <div className={background}></div>
          <div >
            <SentenceRoller 
              keyWords={this.state.keyWords}
              handleNewSentence={this.handleNewSentence.bind(this)}
            />
          </div>
        </span>
      )   
    } else {
      return (
        <span>
          <div className={background}></div>
          <div>
            <KeyWordInputWindow 
              handleChange={this.handleKeyWordChange.bind(this)}
              handleSubmit={this.handleKeyWordSubmit.bind(this)}
              addNewWordSlot={this.addNewWordSlot.bind(this)}
              numberOfWordSlots={this.state.numberOfWordSlots}
            />
          </div>
        </span>
      )
    }
  } 
}
export default App;
