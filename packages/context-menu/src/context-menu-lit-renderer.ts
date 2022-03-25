/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { render, RenderOptions, TemplateResult } from 'lit';
import { directive, DirectiveResult } from 'lit/directive.js';
import { LitRendererDirective } from '@vaadin/lit-renderer';
import { ContextMenu, ContextMenuRendererContext } from './vaadin-context-menu.js';

export type ContextMenuLitRenderer = (context: ContextMenuRendererContext, menu: ContextMenu) => TemplateResult;

class ContextMenuRendererDirective extends LitRendererDirective<ContextMenu, ContextMenuLitRenderer> {
  /**
   * Set renderer callback to the element.
   */
  addRenderer(element: ContextMenu, renderer: ContextMenuLitRenderer, options: RenderOptions) {
    element.renderer = (root: HTMLElement, menu?: ContextMenu, context?: ContextMenuRendererContext) => {
      render(renderer.call(options.host, context as ContextMenuRendererContext, menu as ContextMenu), root, options);
    };
  }

  /**
   * Run renderer callback on the element.
   */
  runRenderer(element: ContextMenu) {
    element.requestContentUpdate();
  }
}

const rendererDirective = directive(ContextMenuRendererDirective);

export const contextMenuRenderer = (
  renderer: ContextMenuLitRenderer,
  value?: unknown
): DirectiveResult<typeof ContextMenuRendererDirective> => rendererDirective(renderer, value);
