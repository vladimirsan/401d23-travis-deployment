import React from 'react';
import ExpenseForm from '../expense-form/expense-form';
import ExpenseItem from '../expense-item/expense-item';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expenses: [],
    };
    //-------------------------------------------------------------
    // Binding Handlers
    //-------------------------------------------------------------
    const memberFunctions = Object.getOwnPropertyNames(Dashboard.prototype);
    memberFunctions.forEach((functionName) => {
      if (functionName.startsWith('handle')) {
        this[functionName] = this[functionName].bind(this);
      }
    });
  }
  //------------------------------------------------------------
  // Member Functions
  //------------------------------------------------------------
  handleAddExpense(expense) {
    expense.createdOn = new Date();
    expense.id = Math.random();
    expense.editing = false;

    this.setState((previousState) => {
      return { expenses: [...previousState.expenses, expense] };
    });
  }

  handleRemoveExpense(expenseToRemove) {
    this.setState(previousState => ({
      expenses: previousState.expenses.filter(expense => expense.id !== expenseToRemove.id),
    }));
  }

  handleUpdateExpense(expenseToUpdate) {
    this.setState((previousState) => {
      const updatedExpenses = previousState.expenses.map(expense =>
        (expense.id === expenseToUpdate.id ? expenseToUpdate : expense));

      return { expenses: updatedExpenses };
    });
  }
  //------------------------------------------------------------
  // Hooks
  //------------------------------------------------------------
  render() {
    const totalPrice = this.state.expenses.reduce((result, expense) => {
      return result + Number(expense.price);
    }, 0);

    return (
     <div className='dashboard'>
      <h1>I am a Dashboard!</h1>
      <ExpenseForm handleComplete={this.handleAddExpense} />
      <ul>
        {
          this.state.expenses.map((expense, index) =>
            <li key={index}>
              <ExpenseItem
                expense={expense}
                handleRemoveExpense={this.handleRemoveExpense}
                handleUpdateExpense={this.handleUpdateExpense}
              />
            </li>)
        }
      </ul>
      <p>The total price is : ${totalPrice}</p>
     </div>
    );
  }
}

export default Dashboard;
