import { client } from './client';

export default {
  async getSeats() {
    try {
      const result = await client.get('/getSeats');
      return result.data;
    } catch (error: unknown) {
      return error;
    }
  },
};
