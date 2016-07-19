import {candidateEmailFromLog} from '../src/message_popup/index.js';
jest.unmock('../src/message_popup/index.js');

describe('candidateEmailFromLog', () => {
  it('parses email', () => {
    expect(candidateEmailFromLog({ json: { name: 'foo', email: 'foo@kevin.com'}})).toEqual('foo@kevin.com');
  });

  it('parses name when it looks like an email', () => {
    expect(candidateEmailFromLog({ json: { name: 'foo@kevin.com'}})).toEqual('foo@kevin.com');
  });

  it('returns undefined if nothing found', () => {
    expect(candidateEmailFromLog({ json: {}})).toEqual(undefined);
    expect(candidateEmailFromLog({ json: { name: 'foo' }})).toEqual(undefined);
  });
});