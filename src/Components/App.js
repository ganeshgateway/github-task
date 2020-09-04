import React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import Datepicker from './Datepicker/Datepicker';
import SearchInput from './SearchBar/SearchInput';
import ShowResult from './ShowData/ShowResult';
import { Button } from 'react-bootstrap';
import moment from 'moment'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchData: {},
      commits: [],
      pulls: [],
      contributor: [],
      issue: []
    }
  }

  dateChangeFormat = (str) => {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  onDatechangeHandler = (dateData) => {
    const { searchData } = this.state;
    searchData.sDate = this.dateChangeFormat(dateData.startDate);
    searchData.eDate = this.dateChangeFormat(dateData.endDate);
    this.setState({
      searchData: searchData
    })
  }

  onNamechangeHandler = (repoName) => {
    const { searchData } = this.state;
    this.state.searchData.repoName = repoName;
    this.setState({
      searchData: searchData
    })
  }

  // getRepoData = async () => {
  //   console.log("#####", this.state);
  //   const { repoName } = this.state.searchData;
  //   //console.log("Final state data is", this.state.searchData.repoName);
  //   const repositoryName = repoName;
  //   const url = `https://api.github.com/repos/gannear/${repositoryName}/commits`;
  //   const response = await fetch(url, {
  //     "method": "GET"
  //   })
  //   const result = await response.json()
  //   this.setState(
  //     {
  //       commits: result
  //     }
  //   )
  // }

  getRepoData = async () => {
    const { repoName } = this.state.searchData;
    const repositoryName = repoName;
    const url = `https://api.github.com/repos/gannear/${repositoryName}/pulls`;
    const response = await fetch(url, {
      "method": "GET"
    })

    const Data_list = await response.json();
    const pullData = [];
    for (let i = 0; i < Data_list.length; i++) {
      var date = new Date(Data_list[i]['updated_at']);
      var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
      var sDate = this.state.searchData.sDate;
      var eDate = this.state.searchData.eDate;
      if (dateString >= sDate && dateString <= eDate) {
        pullData.push({ 'Pull': Data_list[i]['body'] });
      }

    }

    this.setState({
      pulls: pullData
    })

    const issueUrl = `https://api.github.com/repos/gannear/${repositoryName}/issues`;
    fetch(issueUrl)
      .then(response => response.json())
      .then(data => this.setState({ issue: data }, () => {
        // this.state.issue.map(issues => {
        //   pullData.map(pull => {
        //     console.log(issues.title)
        //     pull.issues = issues.title;
        //   })
        // })
        let str = '';
        const processissues = this.state.issue.map(item => {
          const container = {};
          pullData.map(p => {
            console.log(p.Pull, item.body)
            if (p.pull == item.body) {

              str = str + "," + item.title;
              let strArra = str.split(',');
              strArra.shift();
              let newStr = strArra.join(',');
              container.issues = newStr;
            } else {
              container.issues = item.title;
              container.test = item.body;
            }
          })

          return container;

        })
        console.log("***1***", processissues);
        pullData.map((item, i) => Object.assign({}, item, processissues[i]));

        console.log("=======================", pullData);

      }));

    // const processissues = this.state.issue.map(item => {
    //   const container = {};
    //   let str = '';
    //   item.map(i => {
    //     container.issues = i.title;
    //   })
    //   return container;
    // })

    // pullData.map((item, i) => Object.assign({}, item, processissues[i]));


    const contributorUrl = `https://api.github.com/repos/gannear/${repositoryName}/contributors`;
    fetch(contributorUrl)
      .then(response => response.json())
      .then(data => this.setState({ contributor: data }, () => {
        pullData.map(pull => {
          pull.contributor = this.state.contributor[0].login;
        })
      }));

    console.log("pullData", pullData);

    function make_api_call(id) {
      const url = `https://api.github.com/repos/gannear/${repositoryName}/pulls/${id}/comments`;
      return fetch(url, {
        "method": "GET"
      }).then((response) => response.json()).then((data) => data);
    }

    async function processData() {
      let result;
      let promises = [];
      for (let i = 0; i < Data_list.length; i++) {
        promises.push(make_api_call(Data_list[i].number));
      }
      result = await Promise.all(promises);

      const processPullAndCommentData = result.map(item => {
        const container = {};
        let str = '';
        item.map(i => {
          str = str + "," + i.body;
          let strArra = str.split(',');
          strArra.shift();
          let newStr = strArra.join(',');
          container.comments = newStr;
        })
        return container;
      })

      let pullAndCommentData = pullData.map((item, i) => Object.assign({}, item, processPullAndCommentData[i]));

      for (let i = 0; i < Data_list.length; i++) {
        Data_list[i]['result'] = result[i];
      }
      return pullAndCommentData;
    }

    const generatePdf = async () => {
      const results = await processData();
      this.setState({
        pullDataWithComments: results,
        showPullDataWithComments: true,
        showCommits: false,
        pulls: results
      })
    }
    generatePdf();
  }


  render() {
    console.log("=======", this.state.contributor);
    const msg = 'Please enter public repository name'
    return (
      <div className="App">
        <Container>
          <div class="row">
            <div class="col-xs-6 col-md-4"><SearchInput nameChange={this.onNamechangeHandler} /></div>
            <div class=".col-md-6 .offset-md-3"><Datepicker dateChange={this.onDatechangeHandler} /></div>
            <div class="col-xs-2 col-md-2"><Button variant="success" onClick={this.getRepoData}>Search</Button></div>
          </div>
        </Container>
        {this.state.commits.message === 'Not Found' ? msg : ''}
        <ShowResult resultData={this.state.pulls} />
      </div>
    );
  }
}

export default App;
