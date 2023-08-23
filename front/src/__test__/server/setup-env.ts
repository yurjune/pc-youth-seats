// add this to your setupFilesAfterEnv config in jest so it's imported for every test file
import { server } from './server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
