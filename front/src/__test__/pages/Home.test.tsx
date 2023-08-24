import Home from '@pages/home';
import api from '@shared/api';
import { act, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

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
    const getSeats = jest.spyOn(api, 'getSeats');
    setUp();

    expect(getSeats).toHaveBeenCalledTimes(1);
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
    const seat = await screen.findByText('A-6');
    await act(() => userEvent.click(seat));
    expect(screen.getByText('좌석 예약'));
  });

  it('renders error message if validation fails when making a reservation', async () => {
    setUp();
    const seat = await screen.findByText('A-6');
    await act(() => userEvent.click(seat));

    const name = screen.getByLabelText('이름');
    const pw = screen.getByLabelText('비밀번호');
    await act(() => userEvent.type(name, '가'));
    await act(() => userEvent.type(pw, '12'));

    const submitBtn = screen.getByRole('button', { name: '예약' });
    await act(() => userEvent.click(submitBtn));

    await screen.findByText('이름을 2자 이상 4자 이하로 입력해주세요.');
    await screen.findByText('비밀번호를 4자 이상 입력해주세요.');
    await screen.findByText('비밀번호가 일치하지 않습니다.');
  });

  // TODO: mock websocket Server
  // TODO: mock dayjs module
  it('reservation success', async () => {
    const makeReservation = jest.spyOn(api, 'makeReservation');
    setUp();

    const seat = await screen.findByText('A-6');
    await act(() => userEvent.click(seat));

    const name = screen.getByLabelText('이름');
    const pw = screen.getByLabelText('비밀번호');
    const pwCheck = screen.getByLabelText('비밀번호 확인');
    await act(() => userEvent.type(name, '사용자'));
    await act(() => userEvent.type(pw, '1234'));
    await act(() => userEvent.type(pwCheck, '1234'));

    const submitBtn = screen.getByRole('button', { name: '예약' });
    await act(() => userEvent.click(submitBtn));

    expect(makeReservation).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByText('좌석 예약')).toBeNull();
    });
  });

  it('cancel reservation success', async () => {
    const cancelReservation = jest.spyOn(api, 'cancelReservation');
    setUp();

    const seat = await screen.findByText('A-1');
    await act(() => userEvent.click(seat));

    const pw = screen.getByLabelText('비밀번호');
    await act(() => userEvent.type(pw, '1234'));

    const submitBtn = screen.getByRole('button', { name: '삭제' });
    await act(() => userEvent.click(submitBtn));

    expect(cancelReservation).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByText('좌석 확인')).toBeNull();
    });
  });
});

const flushPromises = async () => await act(async () => await Promise.resolve());
