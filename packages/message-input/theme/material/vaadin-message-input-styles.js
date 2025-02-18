import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-message-input',
  css`
    :host {
      padding: 0.5em 1em;
    }
  `,
  { moduleId: 'material-message-input' },
);
