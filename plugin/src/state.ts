import { Application } from 'types';
import create from 'zustand';

interface ApplicationStore {
  applications: Application[];
  setApplications: (applications: Application[]) => void;
}

export const quarkusApplicationStore = create<ApplicationStore>((set) => ({
  applications: [],
  setApplications: (applications) => set({ applications }),
}));
