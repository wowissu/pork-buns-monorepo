import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
  return {
    apiUrl: window.API_URL,
    agentUrl: window.AGENT_URL
  };
});