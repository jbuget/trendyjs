import { describe, it } from 'mocha';
import { expect } from 'chai';
import date from '../../lib/infrastructure/dates';

describe('Utils | date', function () {

  describe('#today()', function () {

    it('should return a Date object of the current day with time set to 00:00:000z', function () {
      // given
      const today = new Date();

      // when
      const actual = date.today();

      // then
      expect(actual.getYear()).to.equal(today.getYear());
      expect(actual.getMonth()).to.equal(today.getMonth());
      expect(actual.getDate()).to.equal(today.getDate());
      expect(actual.getHours()).to.equal(0);
      expect(actual.getMinutes()).to.equal(0);
      expect(actual.getSeconds()).to.equal(0);
    });
  });

  describe('#tomorrow()', function () {

    it('should return a Date object of tomorrow day with time set to 00:00:000z', function () {
      // given
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // when
      const actual = date.tomorrow();

      // then
      expect(actual.getYear()).to.equal(tomorrow.getYear());
      expect(actual.getMonth()).to.equal(tomorrow.getMonth());
      expect(actual.getDate()).to.equal(tomorrow.getDate());
      expect(actual.getHours()).to.equal(0);
      expect(actual.getMinutes()).to.equal(0);
      expect(actual.getSeconds()).to.equal(0);
    });
  });


});