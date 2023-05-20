import { JSX } from '@builder.io/qwik/jsx-runtime';
import { queries } from '@testing-library/dom';
import type {
  Queries,
  BoundFunctions,
  prettyFormat,
} from '@testing-library/dom';
import { Component, RenderOptions } from '@builder.io/qwik';

export interface Options extends RenderOptions {
  container?: HTMLElement;
  baseElement?: HTMLElement;
  queries?: Queries & typeof queries;
  wrapper?: Component<{ children: JSX.Element }>;
}

export type DebugFn = (
  baseElement?: HTMLElement | HTMLElement[],
  maxLength?: number,
  options?: prettyFormat.OptionsReceived
) => void;

export type Result = BoundFunctions<typeof queries> & {
  asFragment: () => string;
  container: HTMLElement;
  baseElement: HTMLElement;
  debug: DebugFn;
  unmount: () => void;
};

export type ComponentRef = {
  container: HTMLElement;
  componentCleanup: () => void;
};
