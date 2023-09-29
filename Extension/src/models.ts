export type BrowserMessageType = 'initiateContent' | 'addAgent' | 'removeAgent' | 'tkMessage' | 'fetch' | 'fetchResponse' | 'wsSend' | 'wsResponse' | 'wsStart' | 'popupSrc' | 'toggleExtension';

export type BrowserMessage = {
  type: BrowserMessageType;
  agent?: number;
  requestId?: string;
  content?: any;
};

export type AppSettings = {
  // displayHelpMessage: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  // displayHelpMessage: true
};

// export type ColorScheme = 'light' | 'dark';
