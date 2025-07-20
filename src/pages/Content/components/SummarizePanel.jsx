import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';
import '../content.styles.css';

function SummarizePanel() {
  const [summary, setSummary] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [displayedText, setDisplayedText] = React.useState('');
  const [step, setStep] = React.useState('idle');
  const [length, setLength] = React.useState('short');
  const [language, setLanguage] = React.useState('en');

  const LANGUAGE_OPTIONS = ['en', 'sk'];
  const SUMMARY_LENGTH_OPTIONS = ['short', 'mid', 'long'];

  const handleClick = () => {
    setStep('options');
  };

  const handleConfirm = async () => {
    const videoId = new URLSearchParams(window.location.search).get('v');

    if (!videoId) {
      alert('No video ID found.');
      return;
    }

    setLoading(true);
    setStep('loading');
    const message = 'Summarizing...';
    setSummary(message);
    setDisplayedText(message);

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_TRANSCRIPT',
        videoId,
        language,
        length,
      });

      if (response && response.data?.summary) {
        setSummary(response.data.summary);
        setDisplayedText(response.data.summary);
        setStep('done');
      } else if (response?.message) {
        const errorMsg = `⚠️ ${response.message}`;
        setSummary(errorMsg);
        setDisplayedText(errorMsg);
      } else {
        const errorMsg = '❌ Failed to summarize video.';
        setSummary(errorMsg);
        setDisplayedText(errorMsg);
      }
    } catch (error) {
      const errorMsg = `❌ Error: ${error.message}`;
      setSummary(errorMsg);
      setDisplayedText(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="summarize-container"
      className="flex flex-col w-full mt-4 p-3 mb-4 bg-white border border-gray-300 rounded-lg shadow transition-all duration-300 ease-in-out "
    >
      {step === 'idle' && (
        <button
          id="my-custom-button"
          onClick={handleClick}
          className="flex mb-2 flex-row justify-center w-full p-2 space-x-2 font-bold border rounded-md"
        >
          <SparklesIcon className="w-5 " />
          <p>Summarize</p>
        </button>
      )}

      {step === 'options' && (
        <>
          <div className="w-full">
            <h1 className="text-sm mb-2">Pick length of summary</h1>
            <div className="flex gap-2 font-bold mt-2 w-full">
              {SUMMARY_LENGTH_OPTIONS.map((len) => (
                <div
                  key={len}
                  onClick={() => setLength(len)}
                  className={`w-full border p-2 rounded-md flex justify-center items-center text-center cursor-pointer transition-all hover:shadow-lg ${
                    length === len ? 'bg-gray-200' : ''
                  }`}
                >
                  {len.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full mt-4">
            <h1 className="text-sm mb-2">Pick language</h1>
            <div className="flex gap-2 font-bold mt-2 w-full">
              {LANGUAGE_OPTIONS.map((lang) => (
                <div
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full  p-2 rounded-md flex justify-center items-center text-center cursor-pointer transition-all hover:shadow-lg btn ${
                    language === lang ? 'bg-gray-200' : ''
                  }`}
                >
                  {lang}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleConfirm}
            className="mt-4 w-full p-2 font-bold border rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Confirm
          </button>
        </>
      )}

      {step === 'loading' && (
        <div
          id="summary-output"
          className="max-h-[400px] overflow-y-auto whitespace-pre-wrap text-md"
        >
          <p>{displayedText}</p>
        </div>
      )}

      {step === 'done' && (
        <div
          id="summary-output"
          className="max-h-[400px] overflow-y-auto whitespace-pre-wrap !text-[14px]"
        >
          <p>{displayedText}</p>
        </div>
      )}
    </div>
  );
}

export default SummarizePanel;
