import { render as qwikRender } from '@builder.io/qwik';
import { getQueriesForElement } from '@testing-library/dom';
import {
  Options,
  Result,
  Ui,
} from 'packages/qwik-testing-library/src/lib/types';

/* istanbul ignore next */
if (!process.env.QTL_SKIP_AUTO_CLEANUP) {
  if (typeof afterEach === 'function') {
    afterEach(async () => {
      cleanup();
    });
  }
}

const mountedContainers = new Set<HTMLElement>();

async function render(ui: Ui, options: Options = {}): Result {
  let {
    container,
    baseElement = container,
    queries,
    wrapper,
    ...qwikRenderOptions
  } = options;

  if (!baseElement) {
    // Default to document.body instead of documentElement to avoid output of potentially-large
    // head elements (such as JSS style blocks) in debug output.
    baseElement = document.body;
  }

  if (!container) {
    container = baseElement.appendChild(document.createElement('div'));
  }

  await qwikRender(container, ui, qwikRenderOptions);

  mountedContainers.add(container!);

  const queryHelpers = getQueriesForElement(container, queries);

  return {
    asFragment: () => container?.innerHTML as string,
    container,
    baseElement,
    // debug: (el = baseElement, maxLength, options) =>
    //   Array.isArray(el)
    //     ? el.forEach((e) => console.log(prettyDOM(e, maxLength, options)))
    //     : console.log(prettyDOM(el, maxLength, options)),
    // unmount: dispose,
    ...queryHelpers,
  } as Result;
}

function cleanupAtContainer(container: HTMLElement) {
  if (container?.parentNode === document.body) {
    document.body.removeChild(container);
  }

  mountedContainers.delete(container);
}

function cleanup() {
  mountedContainers.forEach(cleanupAtContainer);
}

export * from '@testing-library/dom';
export { cleanup, render };
