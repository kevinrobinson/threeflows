import React from 'react';
import _ from 'lodash';

import {allQuestions} from '../questions.js';
import {allStudents} from '../../data/virtual_school.js';
import {withStudents, withLearningObjectiveAndIndicator} from '../transformations.jsx';
import * as Routes from '../../routes.js';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import AutoComplete from 'material-ui/AutoComplete';
import Dialog from 'material-ui/Dialog';
import {ListItem} from 'material-ui/List';

import FaceIcon from 'material-ui/svg-icons/action/face';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import AddIcon from 'material-ui/svg-icons/content/add';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

export default React.createClass({
  displayName: 'EditQuestionPage',

  propTypes: {
    questionId: React.PropTypes.string.isRequired
  },

  getInitialState() {
    const {questionId} = this.props;
    const question = withLearningObjectiveAndIndicator(_.find(withStudents(allQuestions), question => question.id.toString()===questionId));
    var goodExamplesText = '';
    _.forEach(question.examples, example => {goodExamplesText += (goodExamplesText === '' ? '' : '\n\n') + example;});
    var badExamplesText = '';
    _.forEach(question.nonExamples, example => {badExamplesText += (badExamplesText === '' ? '' : '\n\n') + example;});
    return ({
      originalQuestion: question,
      questionText: question.text,
      studentText: '',
      students: _.has(question, 'students') ? question.students : [],
      selectedStudent: null,
      goodExamplesText,
      badExamplesText
    });
  },

  returnToQuestions(){
    Routes.navigate(Routes.messagePopupAuthorQuestionsPath());
  },

  onQuestionTextChange(event, value){
    this.setState({questionText: value});
  },

  addAutoStudent(name, value){
    this.addStudent(name);
  },

  addStudent(name=undefined){
    const studentName = typeof name !== 'string' ? this.state.studentText : name;
    const student = _.find(allStudents, student => student.name.toLowerCase() === studentName.toLowerCase());
    const alreadyAdded =  student !== undefined && _.find(this.state.students, newStudent => newStudent.id === student.id) !== undefined;
    if(student !== undefined && !alreadyAdded){
      this.setState({students: this.state.students.concat(student)});
    }
  },

  removeStudent(studentId){
    return function(){
      this.setState({students: _.remove(_.clone(this.state.students), student => student.id !== studentId)});
    }.bind(this);
  },

  selectStudent(studentId){
    return function(){
      this.setState({selectedStudent: studentId});
    }.bind(this);
  },

  onStudentTextChange(searchText, dataSource){
    this.setState({studentText: searchText});
  },

  isStudentSelectionValid(selection){
    if(selection === '') return true;
    if(_.find(allStudents, student => student.name.toLowerCase() === selection.toLowerCase()) === undefined) return false;
    if(_.find(this.state.students, student => student.name.toLowerCase() === selection.toLowerCase()) !== undefined) return false;
    return true;
  },

  onGoodExamplesChange(event, text){
    this.setState({goodExamplesText: text});
    this.getExamples();
  },

  onBadExamplesChange(event, text){
    this.setState({badExamplesText: text});
    this.getExamples();
  },

  getExamples(){
    const {goodExamplesText, badExamplesText} = this.state;
    var goodExamples = goodExamplesText.split('\n\n');
    var badExamples = badExamplesText.split('\n\n');
    goodExamples = goodExamples.map(example => example.trim());
    badExamples = badExamples.map(example => example.trim());
    _.remove(goodExamples, example => example == '');
    _.remove(badExamples, example => example == '');
  },

  render(){
    const selectedStudent = _.find(allStudents, student => student.id === this.state.selectedStudent);

    return (
      <div>
        <AppBar 
          title={`Editing Question #${this.props.questionId}`}
          iconElementLeft={<IconButton onTouchTap={this.returnToQuestions}><ArrowBackIcon /></IconButton>}
          />
        <div style={styles.container}>
          <Paper style={styles.sectionContainer}>
            <div style={styles.sectionTitle}>Question Text</div>
            <Divider />
            <div style={styles.originalQuestionTitle}>Original Question Text</div>
            <div style={styles.originalQuestionText}>{this.state.originalQuestion.text}</div>
            <TextField 
              id='new-text'
              value={this.state.questionText}
              fullWidth={true}
              multiLine={true}
              onChange={this.onQuestionTextChange}
              floatingLabelText='Type out the question text here.'/>
          </Paper>
          <Paper style={styles.sectionContainer}>
            <div style={styles.sectionTitle}>Involved Students</div>
            <Divider />
            <div style={styles.studentButtonSection}>
              {this.state.students.map(student => {
                return <ListItem
                  style={styles.studentButton}
                  key={"student-" + student.id}
                  primaryText={student.name} 
                  onTouchTap={this.selectStudent(student.id)}
                  leftIcon={<FaceIcon />}
                  rightIconButton={<IconButton onTouchTap={this.removeStudent(student.id)}><CloseIcon /></IconButton>}/>;
              })}
            </div>
            <div style={styles.studentTextSection}>
              <AutoComplete
                id='student-selection'
                searchText={this.state.studentText}
                onUpdateInput={this.onStudentTextChange}
                onNewRequest={this.addAutoStudent}
                hintText="Type a student's name..."
                errorText={this.isStudentSelectionValid(this.state.studentText) ? '' : ' '}
                fullWidth={true}
                dataSource={_.filter(allStudents, student => this.isStudentSelectionValid(student.name)).map(student => student.name)}
                filter={AutoComplete.fuzzyFilter}
                maxSearchResults={4}
               />
               <IconButton onTouchTap={this.addStudent}><AddIcon/></IconButton>
            </div>
          </Paper> 
          {selectedStudent !== null && selectedStudent !== undefined &&
            <Dialog
              title={selectedStudent.name}
              open={selectedStudent !== null}
              actions={[
                <FlatButton 
                  label="Close"
                  onTouchTap={function(){this.setState({selectedStudent: null});}.bind(this)}/>,
                <FlatButton 
                  label="Remove"
                  onTouchTap={function(){
                    this.removeStudent(this.state.selectedStudent)(); 
                    this.setState({selectedStudent: null});}.bind(this)}/>
              ]}
              onRequestClose={function(){this.setState({selectedStudent: null});}.bind(this)}>
              <div style={styles.studentAttribute}>{`${selectedStudent.grade} ${selectedStudent.gender}, ${selectedStudent.race}`}</div>
              {selectedStudent.behavior && <div style={styles.studentAttribute}>{selectedStudent.behavior}</div>}
              {selectedStudent.ell && <div style={styles.studentAttribute}>{selectedStudent.ell}</div>}
              {selectedStudent.learningDisabilities && <div style={styles.studentAttribute}>{selectedStudent.learningDisabilities}</div>}
              {selectedStudent.academicPerformance && <div style={styles.studentAttribute}>{selectedStudent.academicPerformance}</div>}
              {selectedStudent.interests && <div style={styles.studentAttribute}>{selectedStudent.interests}</div>}
              {selectedStudent.familyBackground && <div style={styles.studentAttribute}>{selectedStudent.familyBackground}</div>}
              {selectedStudent.ses && <div style={styles.studentAttribute}>{selectedStudent.ses}</div>}
            </Dialog>
          }
          <Paper style={styles.sectionContainer}>
            <div style={styles.sectionTitle}>Good Examples</div>
            <Divider />
            <TextField
              id="good-examples"
              style={styles.examplesTextArea}
              floatingLabelText="Separate different examples with a new line"
              floatingLabelFixed={true}
              textareaStyle={styles.examplesTextAreaInner}
              multiLine={true}
              value={this.state.goodExamplesText}
              underlineShow={false}
              onChange={this.onGoodExamplesChange}/>
          </Paper>
          <Paper style={styles.sectionContainer}>
            <div style={styles.sectionTitle}>Bad Examples</div>
            <Divider />
            <TextField
              id="bad-examples"
              style={styles.examplesTextArea}
              floatingLabelText="Separate different examples with a new line"
              floatingLabelFixed={true}
              textareaStyle={styles.examplesTextAreaInner}
              multiLine={true}
              value={this.state.badExamplesText}
              underlineShow={false}
              onChange={this.onBadExamplesChange}/>
          </Paper>
        </div>
      </div>
      );
  }
});

const styles = {
  container: {
    margin: 10,
    marginBottom: 1000
  },
  sectionContainer: {
    margin: 5,
    padding: 10,
    fontSize: 14
  },
  sectionTitle: {
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold'
  },
  originalQuestionTitle: {
    marginTop: 10,
    fontSize: 14,
  },
  originalQuestionText: {
    padding: 10,
    paddingTop: 5
  },
  studentButtonSection: {
    padding: 10,
  },
  studentButton: {
    padding: 0,
    width: '100%',
    fontSize: 14,
  },
  studentTextSection: {
    display: 'flex',
    flexDirection: 'row'
  },
  studentAttribute: {
    fontSize: 14,
    marginTop: 2
  },
  examplesTextArea: {
    width: '100%'
  },
  examplesTextAreaInner: {
    border: '1px solid #eee',
    rows: 2,
    padding: 5,
    fontSize: 14 
  }
};