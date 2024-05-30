import { TestBed, inject } from '@angular/core/testing';
// Helper function to test share code
// The letters are randomly generated and their value not important.
// Their case is important - so we want to test each letter has the correct case
// * Shape defines what case each char should be in format `ULLUU'
const isValidCode = (shape, shareCode: string) => {
  const isUppercase = c => c.toUpperCase() === c;
  const isLowercase = c => c.toLowerCase() === c;

  let valid = true;

  for (let idx = 0; idx < shareCode.split('').length; idx++) {
    const charValid = shape[idx] === 'U' ? isUppercase(shareCode[idx]) : isLowercase(shareCode[idx]);
    if (!charValid) {
      valid = false;
      break;
    }
  }
  return valid;
};

describe('isValidCode', () => {
  it('returns TRUE when code matches shape (all uppercase)', () => {
    expect(isValidCode('UUUUU', 'AAAAA')).toBe(true);
  });
  it('returns FALSE when code does not matche shape (all uppercase)', () => {
    expect(isValidCode('UUUUU', 'aAAAA')).toBe(false);
  });
  it('returns TRUE when code matches shape (all lowercase)', () => {
    expect(isValidCode('LLLLL', 'aaaaa')).toBe(true);
  });
  it('returns FALSE when code does not matche shape (all lowercase)', () => {
    expect(isValidCode('LLLLL', 'aaAaa')).toBe(false);
  });
  it('returns TRUE when code matches shape', () => {
    expect(isValidCode('LULUL', 'aAaAa')).toBe(true);
  });
  it('returns False when code does not match shape', () => {
    expect(isValidCode('LULUL', 'AaAaA')).toBe(false);
  });
});
