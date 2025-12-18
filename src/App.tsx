import './App.css';
import { MotionConfig } from 'motion/react';
import { Toaster } from './components/Toaster/Toaster';
import { INFO_MESSAGES, MISC_MESSAGES } from './utils/messages';
import { useToasts } from './hooks/useToasts';

export default function App() {
  // call addToast and <Toaster /> to render toasts
  const { toasts, addToast, removeToast, removeAllToasts } = useToasts();

  // this is using mock data, so pretty static logic
  const makeToast = () => {
    const allMessages = [...INFO_MESSAGES, ...MISC_MESSAGES];
    const randomItem = allMessages[Math.floor(Math.random() * allMessages.length)];
    addToast(randomItem.message);
  };

  return (
    <MotionConfig reducedMotion="user">
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
    </MotionConfig>
  );
}

