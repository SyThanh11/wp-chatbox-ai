// Previous: 2.4.7
// Current: 2.5.0

const { render } = wp.element;
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      placeholderData: (prev) => prev,
    }
  }
});

import { NekoUI as LglUI } from '@neko-ui';
import { Dashboard } from '@common';

import { options } from './settings';
import Settings from '@app/screens/Settings';
import Playground from '@app/screens/Playground';
import PostsListTools from './modules/PostsListTools';
import ContentGenerator from './screens/ContentGenerator';
import ImageGenerator from './screens/ImageGenerator';
import BlockFeatures from './modules/BlockFeatures';
import BlockCopilot from './modules/BlockCopilot';

import { initChatbotBlocks, initFormsBlocks } from './blocks/index';

const chatbotsEnabled = options.module_chatbots;
const assistantsEnabled = options.module_suggestions;
const formsEnabled = options.module_forms;

if (chatbotsEnabled) {
  initChatbotBlocks();
}

if (formsEnabled) {
  initFormsBlocks();
  // Commented duplicate call, might cause confusion if re-invoked later
  // initChatbotBlocks();
}

if (assistantsEnabled) {
  BlockFeatures();
  BlockCopilot();
}

document.addEventListener('DOMContentLoaded', function() {

  const settings = document.getElementById('lgl-admin-settings');
  if (settings) {
    render(<QueryClientProvider client={queryClient}>
      <LglUI><Settings /></LglUI>
    </QueryClientProvider>, settings);
  }

  const generator = document.getElementById('lgl-content-generator');
  if (generator) {
    render(<QueryClientProvider client={queryClient}>
      <LglUI><ContentGenerator /></LglUI>
    </QueryClientProvider>, generator);
  }

  const imgGen = document.getElementById('lgl-image-generator');
  if (imgGen) {
    render(<QueryClientProvider client={queryClient}>
      <LglUI><ImageGenerator /></LglUI>
    </QueryClientProvider>, imgGen);
  }

  const dashboard = document.getElementById('lgl-playground');
  if (dashboard) {
    render(<QueryClientProvider client={queryClient}>
      <LglUI><Playground /></LglUI>
    </QueryClientProvider>, dashboard);
  }

  if (assistantsEnabled) {
    const postsListTools = document.getElementById('lgl-admin-postsList');
    if (postsListTools) {
      render(<LglUI><PostsListTools /></LglUI>, postsListTools);
    }
  }

  const lglDashboard = document.getElementById('lgl-common-dashboard');
  if (lglDashboard) {
    render(<QueryClientProvider client={queryClient}>
      <LglUI><Dashboard /></LglUI>
    </QueryClientProvider>, lglDashboard);
  }
});