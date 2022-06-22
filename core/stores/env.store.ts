import { defineStore } from 'pinia';

export const useEnvStore = defineStore('env', () => {
  return {
    apiUrl: window.API_URL,
    agentUrl: window.AGENT_URL
  };
});