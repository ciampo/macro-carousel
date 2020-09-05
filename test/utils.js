/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;
  const testFns = window.MacroCarousel.__testonly__;

  const clampTests = [
    {val: 0, min: 0, max: 0, expected: 0},
    {val: 0, min: -1, max: 1, expected: 0},
    {val: 0, min: -10, max: -5, expected: -5},
    {val: 0, min: 3, max: 4, expected: 3},
    {val: 0, min: undefined, max: undefined, expected: 0},
    {val: 0, min: null, max: null, expected: 0},
    {val: 1, min: 1, max: 0, expected: 'throw'},
  ];

  describe('The clamp function', function() {
    clampTests.forEach(t => {
      const descr = t.expected === 'throw' ?
          'throws an error' : 'clamps the value';

      it(`${descr} when the value ${t.val} is clamped between ${t.min} and ${t.max}`, function() {
        if (t.expected === 'throw') {
          expect(() => testFns.clamp(t.val, t.min, t.max)).to.throw();
        } else {
          expect(testFns.clamp(t.val, t.min, t.max)).to.equal(t.expected);
        }
      });
    });
  });

  const clampAbsTests = [
    {val: 1, min: 2, max: 3, expected: 2},
    {val: -1, min: 2, max: 3, expected: -2},
    {val: 1, min: -1, max: 1, expected: 1},
    {val: 1, min: -10, max: -5, expected: -5},
    {val: -1, min: 3, max: 4, expected: -3},
    {val: 0, min: undefined, max: undefined, expected: 'throw'},
    {val: 0, min: null, max: null, expected: 'throw'},
    {val: 1, min: 1, max: 0, expected: 'throw'},
  ];

  describe('The clampAbs function', function() {
    clampAbsTests.forEach(t => {
      const descr = t.expected === 'throw' ?
          'throws an error' : 'clamps the value';

      it(`${descr} when the value ${t.val} is clamped between ${t.min} and ${t.max}`, function() {
        if (t.expected === 'throw') {
          expect(() => testFns.clampAbs(t.val, t.min, t.max)).to.throw();
        } else {
          expect(testFns.clampAbs(t.val, t.min, t.max)).to.equal(t.expected);
        }
      });
    });
  });
})();
