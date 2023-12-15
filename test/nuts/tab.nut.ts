/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import path from 'node:path';
import { execCmd, TestSession } from '@salesforce/cli-plugins-testkit';

describe('generate tab NUTs', () => {
  let session: TestSession;

  before(async () => {
    session = await TestSession.create({
      project: {
        name: 'tab-nut',
      },
    });
  });

  after(async () => {
    await session?.clean();
  });

  it('help should not throw', () => {
    const command = 'generate metadata tab --help';
    execCmd(command, { ensureExitCode: 0 });
  });
  describe('flag validation failures', () => {
    it('invalid folder', () => {
      const command = `generate metadata tab --object foo --icon 1 --directory ${path.join(
        'force-app',
        'main',
        'default',
        'objects'
      )}`;
      execCmd(command, { ensureExitCode: 'nonZero' });
    });
  });
});
