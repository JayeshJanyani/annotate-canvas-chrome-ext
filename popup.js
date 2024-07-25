document.getElementById('toggleDrawing').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const currentTab = tabs[0];
      
      if (currentTab.url.startsWith('chrome://')) {
        console.log('Cannot use the extension on chrome:// pages');
        document.body.innerHTML = '<p>This extension cannot be used on chrome:// pages.</p>';
        return;
      }
  
      chrome.tabs.sendMessage(currentTab.id, { action: 'checkInitialized' }, (response) => {
        if (chrome.runtime.lastError) {
          // Content script is not yet injected, so inject it
          chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['content.js']
          }, () => {
            if (chrome.runtime.lastError) {
              console.error('Script injection failed:', chrome.runtime.lastError.message);
              return;
            }
            sendToggleMessage(currentTab.id);
          });
        } else {
          // Content script is already injected, just send the toggle message
          sendToggleMessage(currentTab.id);
        }
      });
    });
  });
  
  function sendToggleMessage(tabId) {
    chrome.tabs.sendMessage(tabId, { action: 'toggleDrawing' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Message sending failed:', chrome.runtime.lastError.message);
      } else {
        console.log(response.status);
      }
    });
  }