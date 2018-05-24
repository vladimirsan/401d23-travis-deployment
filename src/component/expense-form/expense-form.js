import React from 'react';
import PropTypes from 'prop-types';

const emptyState = {
  title: '',
  price: 0,
};

class ExpenseForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.props.expense ? this.props.expense : emptyState;
    //-------------------------------------------------------------
    // Binding Handlers
    //-------------------------------------------------------------
    const memberFunctions = Object.getOwnPropertyNames(ExpenseForm.prototype);
    memberFunctions.forEach((functionName) => {
      if (functionName.startsWith('handle')) {
        this[functionName] = this[functionName].bind(this);
      }
    });
  }
  //-------------------------------------------------------------
  // Member Functions
  //-------------------------------------------------------------
  handleSubmit(event) {
    event.preventDefault();
    this.props.handleComplete(this.state);
    // this.setState({
    //   title: '',
    //   price: 0,
    // });
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  //-------------------------------------------------------------
  // Hooks
  //-------------------------------------------------------------
  // static getDerivedStateFromProps(nextProps) {
  //   // if (nextProps.expense) {
  //   //   return nextProps.expense;
  //   // }
  //   // return {};
  // }

  render() {
    const buttonText = this.props.expense ? 'Update' : 'Create';
    return (
      <form className='expense-form' onSubmit={this.handleSubmit}>
        <input
          type='text'
          name='title'
          placeholder='title'
          value={this.state.title}
          onChange={this.handleChange}
          />
        <input
          type='number'
          name='price'
          placeholder='price'
          step='any'
          value={this.state.price}
          onChange={this.handleChange}
        />
        <button type='submit'> {buttonText} </button>
      </form>
    );
  }
}

ExpenseForm.propTypes = {
  expense: PropTypes.object,
  handleComplete: PropTypes.func,
};

export default ExpenseForm;
