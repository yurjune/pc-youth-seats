import Home from '@pages/home';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('@shared/constants', () => ({
  env: {
    IS_PRODUCTION: false,
    SERVER_URL: '',
    GA_ID: undefined,
    ADMIN_PW: '',
    REDEEMUS_PW: '',
  },
}));

function setUp() {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>,
  );
}

describe('test', () => {
  it('hello world', () => {
    expect(1).toBe(1);
  });

  it('home renders', () => {
    setUp();
    screen.getByText('강단');
  });
});
