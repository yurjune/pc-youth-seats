import Home from '@pages/home';
import api from '@shared/api';
import { act, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

function setUp() {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>,
  );
}

describe('Home page', () => {
  it('renders correctly', async () => {
    setUp();
    expect(screen.getByText('강단')).toBeInTheDocument();
    await flushPromises();
  });

  it('fetch seats data correctly', async () => {
    const spy = jest.spyOn(api, 'getSeats');
    setUp();
    expect(spy).toHaveBeenCalledTimes(1);
    await flushPromises();
  });
});

const flushPromises = async () => await act(async () => await Promise.resolve());
