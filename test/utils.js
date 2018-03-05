/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;
  const testFns = window.xSlider.__testonly__;

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

  const createSyntheticClickEvent = () => new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: window.wcutils.getRandomInt(0, 100),
    clientY: window.wcutils.getRandomInt(0, 100),
  });

  const createSyntheticTouchEvent = (type, x, y) => {
    const target = document.createElement('div');
    const touchObj = new Touch({
      identifier: Date.now(),
      target: target,
      clientX: x,
      clientY: y,
      radiusX: 2.5,
      radiusY: 2.5,
      rotationAngle: 10,
      force: 0.5,
    });

    return new TouchEvent(type, {
      cancelable: true,
      bubbles: true,
      touches: [touchObj],
      targetTouches: [],
      changedTouches: [touchObj],
      shiftKey: true,
    });
  };

  describe('The normalizeEvent function', function() {
    it('correctly processes MouseEvents', function() {
      const clickEv = createSyntheticClickEvent();
      const normalizedEv = testFns.normalizeEvent(clickEv);

      expect(normalizedEv).to.be.an('object');

      expect(normalizedEv).to.have.own.property('x');
      expect(normalizedEv).to.have.own.property('y');
      expect(normalizedEv).to.have.own.property('id');
      expect(normalizedEv).to.have.own.property('event');

      expect(normalizedEv.x).to.equal(clickEv.clientX);
      expect(normalizedEv.y).to.equal(clickEv.clientY);
      expect(normalizedEv.id).to.be.null;
      expect(normalizedEv.event).to.equal(clickEv);
    });

    it('correctly processes TouchEvents', function() {
      const touchEv = createSyntheticTouchEvent('touchstart');
      const normalizedEv = testFns.normalizeEvent(touchEv);

      expect(normalizedEv).to.be.an('object');

      expect(normalizedEv).to.have.own.property('x');
      expect(normalizedEv).to.have.own.property('y');
      expect(normalizedEv).to.have.own.property('id');
      expect(normalizedEv).to.have.own.property('event');

      expect(normalizedEv.x).to.equal(touchEv.changedTouches[0].clientX);
      expect(normalizedEv.y).to.equal(touchEv.changedTouches[0].clientY);
      expect(normalizedEv.id).to.equal(touchEv.changedTouches[0].identifier);
      expect(normalizedEv.event).to.equal(touchEv);
    });
  });
})();
