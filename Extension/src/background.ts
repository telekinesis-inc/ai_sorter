import browser from 'webextension-polyfill';
import { type BrowserMessage, type BrowserMessageType } from './models';

browser.action.onClicked.addListener((tab) => tab.id ? browser.tabs.sendMessage(tab.id, {type: 'toggleExtension'}): null);

browser.runtime.onMessage.addListener(async (message: BrowserMessage, sender, sendResponse) => {
  console.log('background got message', message, sender);
  sendResponse();
  if (sender.tab?.id != undefined) {
    switch (message.type as BrowserMessageType) {
      case 'fetch':
        const response = await (await fetch(message.content.url, message.content.options)).text();
        await browser.tabs.sendMessage(sender.tab.id, {
          type: 'fetchResponse',
          agent: message.agent,
          requestId: message.requestId,
          content: response
        });
        return true;
      /*case 'initiateContent': {
        await browser.tabs.sendMessage(sender.tab.id, {
          type: 'popupSrc',
          content: {
            js: await (await fetch(browser.runtime.getURL('dist/popup.js'))).text(), 
            css: await (await fetch(browser.runtime.getURL('dist/popup.css'))).text(), 
          }
        });
        return true;
      }*/
    }
  }


// import { detect } from 'detect-browser';
// import {
//   type BrowserMessage,
//   type BrowserMessageType,
//   type ColorScheme
// } from './models';
// import settingsConnector from './settings-connector';

// console.log('background script running...');
// let test: any;

// test = localStorage.getItem('test') || 0;
// localStorage.setItem('test', test + '2')
// console.log(test)

// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log('background got message', message, sender);

  // browser.tabs.query({active: true, currentWindow: true}).then(tabs => tabs.map(t => {
  //   console.log(t)
  //   t.id && browser.tabs.sendMessage(t.id, {'test2': 'test3'}).then(e => console.log('background got response', e))
  // }))
  // sendResponse();
  // localStorage.setItem('messages', (localStorage.getItem('messages') || '') + JSON.stringify(message))

  // sendResponse();
  // switch (message.type as BrowserMessageType) {
  //   case 'gotColorScheme': {
  //     updateIcon(message.value as ColorScheme).then(sendResponse);
  //     return true;
  //   }
  // }
});

// async function updateIcon(colorScheme: ColorScheme) {
//   console.log('updating icon', colorScheme);
//   // do work here
// }
