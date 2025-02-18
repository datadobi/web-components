/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LoginOverlay } from '@vaadin/login/src/vaadin-login-overlay.js';

/**
 * @deprecated Import `LoginOverlay` from `@vaadin/login` instead.
 */
export const LoginOverlayElement = LoginOverlay;

export * from '@vaadin/login/src/vaadin-login-overlay.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-login" is deprecated. Use "@vaadin/login" instead.');
