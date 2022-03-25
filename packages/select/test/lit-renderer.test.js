import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-select.js';
import { html, LitElement } from 'lit';
import { selectRenderer } from '../src/select-lit-renderer.js';

class StatusSelector extends LitElement {
  static get properties() {
    return {
      statuses: {
        attribute: false
      },
      label: {
        type: String
      }
    };
  }

  constructor() {
    super();

    this.label = 'Status';
    this.statuses = [{ name: 'waiting' }, { name: 'error' }, { name: 'completed' }];
  }

  render() {
    return html`
      <vaadin-select
        label="${this.label}"
        ${selectRenderer(
          () => html`
            <vaadin-list-box>
              ${this.statuses.map(
                ({ name }) => html`<vaadin-item value="${name}" @click="${this.onItemClick}">${name}</vaadin-item>`
              )}
            </vaadin-list-box>
          `,
          this.statuses
        )}
      ></vaadin-select>
    `;
  }

  onItemClick(event) {
    this.dispatchEvent(new CustomEvent('item-click', { detail: { item: event.target } }));
  }
}

customElements.define('status-selector', StatusSelector);

describe('Lit renderer', () => {
  let wrapper;
  let select;
  let overlay;

  beforeEach(async () => {
    wrapper = fixtureSync(`<status-selector></status-selector>`);
    await wrapper.updateComplete;
    select = wrapper.shadowRoot.querySelector('vaadin-select');
    overlay = select.shadowRoot.querySelector('vaadin-select-overlay');
  });

  it('should render list-box and items when select is closed', () => {
    expect(overlay.querySelector('vaadin-list-box')).to.be.ok;
    expect(overlay.querySelectorAll('vaadin-item').length).to.equal(3);
  });

  it('should render items when passed array is updated', async () => {
    const spy = sinon.spy(select, 'requestContentUpdate');
    wrapper.statuses = [...wrapper.statuses, { name: 'new' }];
    await wrapper.updateComplete;
    expect(spy.callCount).to.equal(1);
    expect(overlay.querySelectorAll('vaadin-item').length).to.equal(4);
  });

  it('should remove items when passed array is cleared', async () => {
    const spy = sinon.spy(select, 'requestContentUpdate');
    wrapper.statuses = [];
    await wrapper.updateComplete;
    expect(spy.callCount).to.equal(1);
    expect(overlay.querySelectorAll('vaadin-item').length).to.equal(0);
  });

  it('should not re-render on unrelated property change', async () => {
    const spy = sinon.spy(select, 'requestContentUpdate');
    wrapper.label = 'New label';
    await wrapper.updateComplete;
    expect(spy.callCount).to.equal(0);
  });

  it('should support using host methods as event listeners', () => {
    const spy = sinon.spy();
    wrapper.addEventListener('item-click', spy);
    const item = overlay.querySelector('vaadin-item');
    item.click();
    expect(spy.callCount).to.equal(1);
    expect(spy.firstCall.args[0].detail.item).to.deep.equal(item);
  });
});
