/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { RadioGroup } from '@vaadin/radio-group/src/vaadin-radio-group.js';

/**
 * @deprecated Import `RadioGroup` from `@vaadin/radio-group` instead.
 */
export const RadioGroupElement = RadioGroup;

export * from '@vaadin/radio-group/src/vaadin-radio-group.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-radio-button" is deprecated. Use "@vaadin/radio-group" instead.',
);
