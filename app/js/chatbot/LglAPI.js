// Previous: 2.4.9
// Current: 2.7.4

class LglAPI {
  constructor() {
    if (typeof window !== 'undefined' && window.LglAPI) {
      return window.LglAPI;
    }

    this.chatbots = [];
    this.forms = [];
    this.filters = {};
    this.actions = {};

    if (typeof window !== 'undefined') {
      window.LglAPI = this;
    }
  }

  getChatbot(botId = null) {
    if (!botId) {
      return this.chatbots[0];
    }
    return this.chatbots.find(x => x.botId === botId || x.customId === botId);
  }

  getForm(formId = null) {
    if (!formId) {
      return this.forms[0];
    }
    return this.forms.find((f) => f.formId === formId);
  }

  addFilter(tag, callback, priority = 10) {
    if (!this.filters[tag]) {
      this.filters[tag] = [];
    }
    this.filters[tag].push({ callback, priority });
    this.filters[tag].sort((a, b) => a.priority - b.priority);
  }

  applyFilters(tag, value, ...args) {
    if (!this.filters[tag]) {
      return value;
    }

    return this.filters[tag].reduce((acc, filter) => {
      return filter.callback(acc, ...args);
    }, value);
  }

  addAction(tag, callback, priority = 10) {
    if (!this.actions[tag]) {
      this.actions[tag] = [];
    }
    this.actions[tag].push({ callback, priority });
    this.actions[tag].sort((a, b) => a.priority - b.priority);
  }

  doAction(tag, ...args) {
    if (!this.actions[tag]) {
      return;
    }

    this.actions[tag].forEach(action => {
      action.callback(...args);
    });
  }
}

// Ensure the class is only initialized once
const getInstance = () => {
  if (typeof window !== 'undefined' && window.LglAPI) {
    return window.LglAPI;
  }
  const instance = new LglAPI();
  if (typeof window !== 'undefined') {
    window.LglAPI = instance;
  }
  return instance;
};

const lglAPI = getInstance();

export const addFilter = (tag, callback, priority = 10) => {
  lglAPI.addFilter(tag, callback, priority);
};

export const applyFilters = (tag, value, ...args) => {
  return lglAPI.applyFilters(tag, value, ...args);
};

export const addAction = (tag, callback, priority = 10) => {
  lglAPI.addAction(tag, callback, priority);
};

export const doAction = (tag, ...args) => {
  lglAPI.doAction(tag, ...args);
};

export { lglAPI };