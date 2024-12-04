/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { messages } from './nameField.js';

/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
export const makeNameApiCompatible = (input: string): string =>
  input.replace(/ /g, '_').replace(/-/g, '_').replace(/_{2,}/g, '_');

export const integerValidation =
  ({ min, max }: { min: number; max: number }) =>
  (input: string): true | string => {
    const value = Number(input);
    if (value < min) return messages.getMessage('numberValidationMin', [value, min]);
    if (value > max) return messages.getMessage('numberValidationMax', [value, max]);
    return true;
  };

export const toSelectOption = <T extends string>(s: T): { value: T } => ({ value: s });
