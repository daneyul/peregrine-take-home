import './App.css';
import { useState } from 'react';
import { Toaster } from './components/Toaster/Toaster';
import { ToastProps } from './components/Toast/Toast';
import { CheckCircledIcon, InfoCircledIcon, DownloadIcon, ArrowTopRightIcon } from '@radix-ui/react-icons';

let toastId = 0;

export default function App() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (message: React.ReactNode) => {
    const newToast: ToastProps = {
      id: (++toastId).toString(),
      message,
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  const makeToast = () => {
    const allMessages = [...INFO_MESSAGES, ...MISC_MESSAGES];
    const randomItem = allMessages[Math.floor(Math.random() * allMessages.length)];
    addToast(randomItem.message);
  };

  return (
    <>
      <div className="card">
        <button className="toast-btn" onClick={makeToast}>
          Toast
        </button>
      </div>
      <Toaster
        toasts={toasts}
        maxToasts={3}
        onRemove={removeToast}
        onRemoveAll={removeAllToasts}
      />
    </>
  );
}

const INFO_MESSAGES = [
  {
    message: <>Dashboard moved to <a href="#"><span>Incidents</span><ArrowTopRightIcon className="link-icon" /></a></>,
  },
  {
    message: <>Folder moved to <a href="#"><span>Incidents</span><ArrowTopRightIcon className="link-icon" /></a></>,
  },
  {
    message: 'Settings saved',
  },
  {
    message: 'File deleted successfully',
  },
  {
    message: 'Permission updated',
  },
  {
    message: <>Importing <a href="#"><span>CDR_Mediations_5104983729576938238_10119293477859</span><ArrowTopRightIcon className="link-icon" /></a></>,
  },
  {
    message: 'Export completed',
  },
  {
    message: 'Reticulating splines...',
  },
];

const MISC_MESSAGES = [
  {
    message: <>Importing <a href="#"><span>CDR_Mediations_5104983729576938238_10119293477859</span><ArrowTopRightIcon className="link-icon" /></a></>,
  },
  {
    message: <>The dashboard was moved successfully to <a href="#"><span>Incidents</span><ArrowTopRightIcon className="link-icon" /></a></>,
  },
  {
    message: <>The folder was moved to <a href="#"><span>Incidents</span><ArrowTopRightIcon className="link-icon" /></a></>,
  },
  {
    message: 'Reticulating splines...',
  },
  {
    message: 'Breakfast is served.',
  },
  {
    message: 'As Gregor Samsa awoke one morning from uneasy dreams he found himself transformed in his bed into a gigantic insect.',
  },
  {
    message: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
  },
  {
    message: 'It was a bright cold day in April, and the clocks were striking thirteen.',
  },
  {
    message: "Ships at a distance have every man's wish on board",
  },
];

