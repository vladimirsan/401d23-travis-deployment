import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure as configureEnzyme, shallow as enzymeShallowMount } from 'enzyme';
import Dashboard from '../component/dashboard/dashboard';

configureEnzyme({ adapter: new Adapter() });

describe('#Dashboard', () => {
  test('Testing empty state', () => {
    const mountedDashboard = enzymeShallowMount(<Dashboard/>);
    expect(mountedDashboard.state().expenses).toEqual([]);
  });

  test('It should display "I am a Dashboard"', () => {
    const mountedDashboard = enzymeShallowMount(<Dashboard/>);
    expect(mountedDashboard.find('h1').text()).toEqual('I am a Dashboard!');
  });

  test('It should contain an ExpenseForm', () => {
    const mountedDashboard = enzymeShallowMount(<Dashboard/>);
    expect(mountedDashboard.find('ExpenseForm')).toBeTruthy();
  });

  test('Expenses should be correctly added to the internal state', () => {
    const mountedDashboard = enzymeShallowMount(<Dashboard/>);
    mountedDashboard.setState({
      expenses: [
        {
          tittle: 'Gregor',
          price: 2000,
        },
        {
          tittle: 'Hound',
          price: 2000,
        },
      ],
    });
    expect(mountedDashboard.find('ExpenseItem').length).toEqual(2);
    expect(mountedDashboard.find('p').text()).toEqual('The total price is : $4000');
  });
});

