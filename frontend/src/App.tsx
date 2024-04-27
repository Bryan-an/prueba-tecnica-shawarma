import React, { useState } from 'react';
import './App.css';
import { uploadFile } from './services/upload';
import { Toaster, toast } from 'sonner';
import { IUser } from './types';
import { Search } from './steps/Search';

enum EAppStatus {
  IDLE = 'idle',
  ERROR = 'error',
  READY_UPLOAD = 'ready_upload',
  UPLOADING = 'uploading',
  READY_USAGE = 'ready_usage',
}

function App() {
  const [appStatus, setAppStatus] = useState<EAppStatus>(EAppStatus.IDLE);
  const [file, setFile] = useState<File | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);

    if (file) {
      setFile(file);
      setAppStatus(EAppStatus.READY_UPLOAD);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (appStatus !== EAppStatus.READY_UPLOAD || !file) return;

    setAppStatus(EAppStatus.UPLOADING);

    const [err, res] = await uploadFile(file);

    if (err) {
      setAppStatus(EAppStatus.ERROR);
      toast.error(err.message);
      return;
    }

    if (res?.data) setUsers(res.data);
    setAppStatus(EAppStatus.READY_USAGE);
    toast.success(res?.message ?? 'File uploaded successfully');
  };

  const buttonShown = [EAppStatus.READY_UPLOAD, EAppStatus.UPLOADING].includes(
    appStatus
  );

  const formShown = appStatus !== EAppStatus.READY_USAGE;

  return (
    <>
      <Toaster />
      <h4>Challenge: Upload CSV + Search</h4>
      {formShown && (
        <form onSubmit={handleSubmit}>
          <label>
            <span>File:</span>
            <input
              disabled={appStatus === EAppStatus.UPLOADING}
              onChange={handleInputChange}
              name="file"
              type="file"
              accept=".csv"
            />
          </label>
          {buttonShown && (
            <button disabled={appStatus === EAppStatus.UPLOADING}>
              {appStatus === EAppStatus.UPLOADING
                ? 'Uploading...'
                : 'Upload file'}
            </button>
          )}
        </form>
      )}

      {appStatus === EAppStatus.READY_USAGE && <Search initialData={users} />}
    </>
  );
}

export default App;
