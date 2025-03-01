// src/utils/eventBus.ts
type Callback = () => void;

const createEventBus = () => {
  const listeners: { [key: string]: Callback[] } = {};

  return {
    subscribe(event: string, callback: Callback) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    },

    unsubscribe(event: string, callback: Callback) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter((cb) => cb !== callback);
      }
    },

    emit(event: string) {
      if (listeners[event]) {
        listeners[event].forEach((callback) => callback());
      }
    },
  };
};

export const eventBus = createEventBus();
