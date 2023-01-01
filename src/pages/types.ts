

export interface ModuleInterface {
    bind: () => void;
    render: () => string;
}

export interface KeyboardEvent {
    keyCode: number;
}
export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
}