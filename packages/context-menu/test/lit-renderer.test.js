import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';
import { html, LitElement } from 'lit';
import { contextMenuRenderer } from '../src/context-menu-lit-renderer.js';

class ActionSelector extends LitElement {
  static get properties() {
    return {
      actions: {
        attribute: false
      },
      openOn: {
        type: String
      }
    };
  }

  constructor() {
    super();

    this.actions = ['Edit', 'Delete'];
    this.openOn = 'click';
  }

  menuContent({ target }) {
    return html`
      <vaadin-list-box>
        ${this.actions.map(
          (name) => html`
            <vaadin-item .value="${name} ${target.id}" @click="${this.onItemClick}">${name} ${target.id}</vaadin-item>
          `
        )}
      </vaadin-list-box>
    `;
  }

  render() {
    return html`
      <vaadin-context-menu .openOn="${this.openOn}" ${contextMenuRenderer(this.menuContent, this.actions)}>
        <div id="1">First paragraph</div>
        <div id="2">Second paragraph</div>
      </vaadin-context-menu>
    `;
  }

  onItemClick(event) {
    this.dispatchEvent(new CustomEvent('item-click', { detail: { item: event.target } }));
  }
}

customElements.define('action-selector', ActionSelector);

describe('Lit renderer', () => {
  let wrapper;
  let menu;
  let overlay;
  let target;
  let item;

  beforeEach(async () => {
    wrapper = fixtureSync(`<action-selector></action-selector>`);
    await wrapper.updateComplete;
    target = wrapper.shadowRoot.querySelector('div');
    menu = wrapper.shadowRoot.querySelector('vaadin-context-menu');
    overlay = menu.$.overlay;
    target.click();
    await nextFrame();
  });

  afterEach(async () => {
    menu.close();
    await nextFrame();
  });

  it('should render list-box and items when menu is opened', () => {
    expect(overlay.querySelector('vaadin-list-box')).to.be.ok;
    expect(overlay.querySelectorAll('vaadin-item').length).to.equal(2);
  });

  it('should re-render items when target element is changed', async () => {
    item = overlay.querySelector('vaadin-item');
    expect(item.value).to.equal('Edit 1');
    menu.close();
    await nextFrame();
    const second = target.nextElementSibling;
    second.click();
    await nextFrame();
    item = overlay.querySelector('vaadin-item');
    expect(item.value).to.equal('Edit 2');
  });

  it('should render items when passed array is updated', async () => {
    const spy = sinon.spy(menu, 'requestContentUpdate');
    wrapper.actions = [...wrapper.actions, 'Copy'];
    await wrapper.updateComplete;
    expect(spy.callCount).to.equal(1);
    expect(overlay.querySelectorAll('vaadin-item').length).to.equal(3);
  });

  it('should remove items when passed array is cleared', async () => {
    const spy = sinon.spy(menu, 'requestContentUpdate');
    wrapper.actions = [];
    await wrapper.updateComplete;
    expect(spy.callCount).to.equal(1);
    expect(overlay.querySelectorAll('vaadin-item').length).to.equal(0);
  });

  it('should not re-render on unrelated property change', async () => {
    const spy = sinon.spy(menu, 'requestContentUpdate');
    wrapper.openOn = 'keydown';
    await wrapper.updateComplete;
    expect(spy.callCount).to.equal(0);
  });

  it('should support using host methods as event listeners', () => {
    const spy = sinon.spy();
    wrapper.addEventListener('item-click', spy);
    item = overlay.querySelector('vaadin-item');
    item.click();
    expect(spy.callCount).to.equal(1);
    expect(spy.firstCall.args[0].detail.item).to.deep.equal(item);
  });
});
