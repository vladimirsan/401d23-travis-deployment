import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal/modal';
import ExpenseForm from '../expense-form/expense-form';

class ExpenseItem extends React.Component {
  render() {
    const { expense, handleRemoveExpense, handleUpdateExpense } = this.props;

    const showModal = () => handleUpdateExpense({ ...expense, editing: true });
    const hideModal = () => handleUpdateExpense({ ...expense, editing: false });

    const updateAndClose = (updatedExpense) => {
      handleUpdateExpense({ ...updatedExpense, editing: false });
    };

    return (
      <div className='expense-item'>
        <strong>{expense.title}</strong> : ${expense.price}
        <button onClick={handleRemoveExpense.bind(null, expense)}> Remove </button>
        <button onClick={showModal}> Edit </button>
        <Modal handleClose={hideModal} show={expense.editing}>
          <h3>Editing {expense.title}</h3>
          <ExpenseForm handleComplete={updateAndClose} expense={expense} />
        </Modal>
      </div>
    );
  }
}

ExpenseItem.propTypes = {
  expense: PropTypes.object,
  handleRemoveExpense: PropTypes.func,
  handleUpdateExpense: PropTypes.func,
};

export default ExpenseItem;