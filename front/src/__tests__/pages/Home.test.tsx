import Home from '@pages/home';
import api from '@shared/api';
import { act, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

function setUp() {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>,
  );
}

describe('Home page', () => {
  it('renders', async () => {
    setUp();
    expect(screen.getByText('강단')).toBeInTheDocument();
    await flushPromises();
  });

  it('fetch seats data', async () => {
    const getSeatsSpy = jest.spyOn(api, 'getSeats');
    setUp();

    expect(getSeatsSpy).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('A-1')).toBeInTheDocument();
    expect(await screen.findByText('사용자1')).toBeInTheDocument();
  });

  it('renders designated seats', async () => {
    setUp();
    expect((await screen.findAllByText('교역자')).length).toBe(3);
    expect((await screen.findAllByText('새가족')).length).toBe(5);
    expect((await screen.findAllByText('방송팀')).length).toBe(2);
  });

  it('open reserve dialog when click a seat', async () => {
    setUp();
    await userEvent.click(await screen.findByText('A-6'));
    expect(screen.getByText('좌석 예약'));
  });

  it('renders error message if validation fails when making a reservation', async () => {
    setUp();
    await userEvent.click(await screen.findByText('A-6'));
    await userEvent.type(screen.getByLabelText('이름'), '가');
    await userEvent.type(screen.getByLabelText('비밀번호'), '12');
    await userEvent.click(screen.getByRole('button', { name: '예약' }));

    await screen.findByText('이름을 2자 이상 4자 이하로 입력해주세요.');
    await screen.findByText('비밀번호를 4자 이상 입력해주세요.');
    await screen.findByText('비밀번호가 일치하지 않습니다.');
  });

  // TODO: mock websocket Server
  // TODO: mock dayjs module
  it('reservation success', async () => {
    const makeReservationSpy = jest.spyOn(api, 'makeReservation');
    setUp();

    await userEvent.click(await screen.findByText('A-6'));
    await userEvent.type(screen.getByLabelText('이름'), '사용자');
    await userEvent.type(screen.getByLabelText('비밀번호'), '1234');
    await userEvent.type(screen.getByLabelText('비밀번호 확인'), '1234');
    await userEvent.click(screen.getByRole('button', { name: '예약' }));

    expect(makeReservationSpy).toHaveBeenCalledTimes(1);
    await waitForElementToBeRemoved(() => screen.queryByText('좌석 예약'));
  });

  it('cancel reservation success', async () => {
    const cancelReservationSpy = jest.spyOn(api, 'cancelReservation');
    setUp();

    await userEvent.click(await screen.findByText('A-1'));
    await userEvent.type(screen.getByLabelText('비밀번호'), '1234');
    await userEvent.click(screen.getByRole('button', { name: '삭제' }));

    expect(cancelReservationSpy).toHaveBeenCalledTimes(1);
    await waitForElementToBeRemoved(() => screen.queryByText('좌석 확인'));
  });
});

const flushPromises = async () => await act(async () => await Promise.resolve());
