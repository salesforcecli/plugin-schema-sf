/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import { Messages } from '@salesforce/core/messages';
import { integerValidation, makeNameApiCompatible } from '../../src/shared/prompts/functions.js';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url);
const messages = Messages.loadMessages('@salesforce/plugin-sobject', 'prompts.shared');

describe('integer validation for prompts', () => {
  it('fail max gt', () => {
    expect(integerValidation({ min: 1, max: 10 })('11')).to.equal(messages.getMessage('numberValidationMax', [11, 10]));
  });
  it('fail min', () => {
    expect(integerValidation({ min: 1, max: 10 })('0')).to.equal(messages.getMessage('numberValidationMin', [0, 1]));
  });
  it('pass = min', () => {
    expect(integerValidation({ min: 1, max: 10 })('1')).to.equal(true);
  });
  it('pass = max', () => {
    expect(integerValidation({ min: 1, max: 10 })('10')).to.equal(true);
  });
  it('pass inside range', () => {
    expect(integerValidation({ min: 1, max: 10 })('5')).to.equal(true);
  });
});

describe('api name compatibility', () => {
  it('handles spaces', () => {
    expect(makeNameApiCompatible('foo bar')).to.equal('foo_bar');
    expect(makeNameApiCompatible('foo   bar')).to.equal('foo_bar');
  });
  it('handles hyphens', () => {
    expect(makeNameApiCompatible('foo-bar')).to.equal('foo_bar');
    expect(makeNameApiCompatible('foo---bar')).to.equal('foo_bar');
  });
  it('handles multiple underscores', () => {
    expect(makeNameApiCompatible('foo__bar')).to.equal('foo_bar');
    expect(makeNameApiCompatible('foo_____bar')).to.equal('foo_bar');
  });
});
