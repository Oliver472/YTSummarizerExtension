import axios from 'axios';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_TRANSCRIPT') {
    axios
      .get('https://b4e252554ce5.ngrok-free.app/api/v1/summarize', {
        params: {
          video_id: msg.videoId,
          lang: msg.language, // Optional: set language
          length: msg.length,
        },
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      })
      .then((response) => {
        console.log(response);
        sendResponse(response);
      })
      .catch((error) => {
        console.log(error);
        sendResponse(error);
      });

    return true;
  }
});
