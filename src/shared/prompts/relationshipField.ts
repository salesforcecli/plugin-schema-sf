/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CustomField } from 'jsforce/api/metadata';
import { Messages, type NamedPackageDir } from '@salesforce/core';
import { Prompter } from '@salesforce/sf-plugins-core';
import { getObjectXmlByFolderAsJson } from '../fs.js';
import { objectPrompt, makeNameApiCompatible } from './prompts.js';

Messages.importMessagesDirectory(dirname(fileURLToPath(import.meta.url)));
const messages = Messages.loadMessages('@salesforce/plugin-sobject', 'prompts.relationship');

type RelationshipFieldProperties = Pick<
  CustomField,
  | 'referenceTo'
  | 'relationshipLabel'
  | 'relationshipName'
  | 'deleteConstraint'
  | 'reparentableMasterDetail'
  | 'writeRequiresMasterRead'
  | 'relationshipOrder'
>;

export const relationshipFieldPrompts = async ({
  type,
  packageDirs,
  childObjectFolderPath,
}: {
  type: 'MasterDetail' | 'Lookup';
  packageDirs: NamedPackageDir[];
  childObjectFolderPath: string;
}): Promise<RelationshipFieldProperties> => {
  const prompter = new Prompter();
  const childObjectXml = await getObjectXmlByFolderAsJson(childObjectFolderPath);
  const response = await prompter.prompt<RelationshipFieldProperties>([
    // prompt the user to select from objects in local source
    await objectPrompt(packageDirs, 'referenceTo', messages.getMessage('objectPrompt')),
    {
      type: 'input',
      name: 'relationshipLabel',
      message: 'Relationship label',
      default: childObjectXml.pluralLabel,
    },
    {
      type: 'input',
      name: 'relationshipName',
      message: 'Relationship name',
      default: (answers: RelationshipFieldProperties) =>
        answers.relationshipLabel ? makeNameApiCompatible(answers.relationshipLabel) : undefined,
    },
    // lookup-only
    {
      type: 'list',
      name: 'deleteConstraint',
      message: messages.getMessage('lookupDeleteConstraint'),
      when: type === 'Lookup',
      default: 'SetNull',
      choices: [
        {
          value: 'SetNull',
          name: messages.getMessage('lookupDeleteConstraint.setNull'),
        },
        {
          value: 'Restrict',
          name: messages.getMessage('lookupDeleteConstraint.restrict'),
        },
        {
          value: 'Cascade',
          name: messages.getMessage('lookupDeleteConstraint.cascade'),
        },
      ],
    },
    // master-detail only
    {
      type: 'confirm',
      name: 'reparentableMasterDetail',
      message: messages.getMessage('reparentableMasterDetail'),
      when: type === 'MasterDetail',
      default: false,
    },
    {
      type: 'confirm',
      name: 'writeRequiresMasterRead',
      message: messages.getMessage('writeRequiresMasterRead'),
      when: type === 'MasterDetail',
      default: false,
    },
  ]);

  return {
    ...response,
    referenceTo: response.referenceTo?.split(path.sep).pop(),
  };
};
