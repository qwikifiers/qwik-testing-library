import { JSXNode, render as qwikRender } from '@builder.io/qwik';
import { getQueriesForElement, prettyDOM } from '@testing-library/dom';
import { ComponentRef, Options, Result } from './types';

/* istanbul ignore next */
if (!process.env.QTL_SKIP_AUTO_CLEANUP) {
  if (typeof afterEach === 'function') {
    afterEach(async () => {
      cleanup();
    });
  }
}

const mountedContainers = new Set<ComponentRef>();

async function render(ui: JSXNode, options: Options = {}): Result {
  let { container, baseElement = container } = options;
  const { queries, serverData } = options;

  if (!baseElement) {
    // Default to document.body instead of documentElement to avoid output of potentially-large
    // head elements (such as JSS style blocks) in debug output.
    baseElement = document.body;
  }

  if (!container) {
    container = baseElement.appendChild(document.createElement('div'));
  }

  const { cleanup } = await qwikRender(container, ui, { serverData });

  mountedContainers.add({ container, componentCleanup: cleanup });

  const queryHelpers = getQueriesForElement(container, queries);

  return {
    asFragment: () => container?.innerHTML as string,
    container,
    baseElement,
    debug: (el = baseElement, maxLength, options) =>
      Array.isArray(el)
        ? el.forEach((e) => console.log(prettyDOM(e, maxLength, options)))
        : console.log(prettyDOM(el, maxLength, options)),
    // unmount: dispose,
    ...queryHelpers,
  } as Result;
}

function cleanupAtContainer(ref: ComponentRef) {
  const { container, componentCleanup } = ref;

  componentCleanup();

  if (container?.parentNode === document.body) {
    document.body.removeChild(container);
  }

  mountedContainers.delete(ref);
}

function cleanup() {
  mountedContainers.forEach(cleanupAtContainer);
}

export * from '@testing-library/dom';
export { cleanup, render };
