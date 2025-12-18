import './App.css';
import { useState } from 'react';
import { Toaster } from './components/Toaster/Toaster';
import { ToastProps } from './components/Toast/Toast';
import { CheckCircledIcon, InfoCircledIcon, DownloadIcon, ArrowTopRightIcon } from '@radix-ui/react-icons';

let toastId = 0;

export default function App() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (message: React.ReactNode, icon?: React.ReactNode) => {
    const newToast: ToastProps = {
      id: (++toastId).toString(),
      message,
      icon,
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
    const randomItem = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
    addToast(randomItem.message, randomItem.icon);
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

const SUCCESS_MESSAGES = [
  {
    message: <>Dashboard moved to <a href="#"><span>Incidents</span><ArrowTopRightIcon className="link-icon" /></a></>,
    icon: <CheckCircledIcon />
  },
  {
    message: <>Folder moved to <a href="#"><span>Incidents</span><ArrowTopRightIcon className="link-icon" /></a></>,
    icon: <CheckCircledIcon />
  },
  {
    message: 'Settings saved',
    icon: <CheckCircledIcon />
  },
  {
    message: 'File deleted successfully',
    icon: <CheckCircledIcon />
  },
  {
    message: 'Permission updated',
    icon: <CheckCircledIcon />
  },
  {
    message: <>Importing <a href="#"><span>CDR_Mediations_5104983729576938238_10119293477859</span><ArrowTopRightIcon className="link-icon" /></a></>,
    icon: <DownloadIcon />
  },
  {
    message: 'Export completed',
    icon: <DownloadIcon />
  },
  {
    message: 'Reticulating splines...',
    icon: <InfoCircledIcon />
  },
];

const ERROR_MESSAGES = [
  'Failed to import',
  'Failed to move dashboard',
  'Failed to move folder',
  'Failed to save settings',
  'Failed to delete file',
  'Failed to update permission',
  'Failed to import',
  'Failed to export',
];

const MISC_MESSAGES = [
  `Importing ${'CDR_Mediations_5104983729576938238_10119293477859'}`,
  `The dashboard was moved successfully to ${'Incidents'}`,
  `The folder was moved to ${'Incidents'}`,
  'Reticulating splines...',
  'Breakfast is served.',
  'As Gregor Samsa awoke one morning from uneasy dreams he found himself transformed in his bed into a gigantic insect.',
  'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
  'It was a bright cold day in April, and the clocks were striking thirteen.',
  "Ships at a distance have every man's wish on board",
];

