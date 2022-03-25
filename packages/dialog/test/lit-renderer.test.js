import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-dialog.js';
import { html, LitElement } from 'lit';
import { dialogRenderer } from '../src/dialog-lit-renderer.js';

class ButtonsWrapper extends LitElement {
  static get properties() {
    return {
      buttons: {
        attribute: false
      },
      modal: {
        type: Boolean
      },
      opened: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();

    this.buttons = ['New', 'Edit'];
    this.modal = true;
    this.opened = false;
  }

  render() {
    return html`
      <vaadin-dialog
        .opened="${this.opened}"
        .modeless="${!this.modal}"
        ${dialogRenderer(
          () => html` ${this.buttons.map((btn) => html`<button @click="${this.onButtonClick}">${btn}</button>`)} `,
          this.buttons
        )}
      ></vaadin-dialog>
    `;
  }

  onButtonClick(event) {
    this.dispatchEvent(new CustomEvent('button-click', { detail: { button: event.target } }));
  }
}

customElements.define('buttons-wrapper', ButtonsWrapper);

describe('Lit renderer', () => {
  let wrapper;
  let dialog;
  let overlay;

  beforeEach(async () => {
    wrapper = fixtureSync(`<buttons-wrapper></buttons-wrapper>`);
    await wrapper.updateComplete;
    dialog = wrapper.shadowRoot.querySelector('vaadin-dialog');
    overlay = dialog.$.overlay;
    wrapper.opened = true;
    await wrapper.updateComplete;
    await nextFrame();
  });

  it('should render dialog content when opened', () => {
    expect(overlay.querySelectorAll('button').length).to.equal(2);
  });

  it('should re-render content on passed property change', async () => {
    const spy = sinon.spy(dialog, 'requestContentUpdate');
    wrapper.buttons = [...wrapper.buttons, 'Delete'];
    await wrapper.updateComplete;
    expect(spy.callCount).to.equal(1);
    expect(overlay.querySelectorAll('button').length).to.equal(3);
  });

  it('should clear content when passed property is cleared', async () => {
    const spy = sinon.spy(dialog, 'requestContentUpdate');
    wrapper.buttons = [];
    await wrapper.updateComplete;
    expect(spy.callCount).to.equal(1);
    expect(overlay.querySelectorAll('button').length).to.equal(0);
  });

  it('should not re-render on unrelated property change', async () => {
    const spy = sinon.spy(dialog, 'requestContentUpdate');
    wrapper.modal = false;
    await wrapper.updateComplete;
    expect(spy.callCount).to.equal(0);
  });

  it('should support using host methods as event listeners', () => {
    const spy = sinon.spy();
    wrapper.addEventListener('button-click', spy);
    const button = overlay.querySelector('button');
    button.click();
    expect(spy.callCount).to.equal(1);
    expect(spy.firstCall.args[0].detail.button).to.deep.equal(button);
  });
});
