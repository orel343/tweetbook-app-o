import React, { useState } from 'react';
import s from './ReportModal.module.scss';

interface ReportModalProps {
  onClose: () => void;
  onSubmit: () => void;
  status: string | null;
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose, onSubmit, status }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const reportReasons = [
    'Spam or Misleading',
    'Abuse or Harassment',
    'Hate Speech',
    'Violence or Threats',
    'Self-Harm or Suicide',
    'Illegal Activities',
    'Impersonation',
    'Copyright Violation',
    'Privacy Violation',
    'False Information',
  ];

  return (
    <div className={s.modalBackground} onClick={onClose}>
      <div className={s.modalContainer} onClick={(e) => e.stopPropagation()}>
        <h2>Report Post</h2>
        <p>Select a reason for reporting this post:</p>
        <div className={s.reasonList}>
          {reportReasons.map((reason, index) => (
            <button
              key={index}
              className={selectedReason === reason ? s.selected : ''}
              onClick={() => setSelectedReason(reason)}
            >
              {reason}
            </button>
          ))}
        </div>
        {selectedReason && (
          <>
            <p>Reason: {selectedReason}</p>
            <p>Additional details (optional):</p>
            <textarea rows={3} placeholder="Provide more details here..." />
            <div className={s.modalActions}>
              <button onClick={onSubmit}>Submit</button>
              <button onClick={onClose}>Cancel</button>
            </div>
          </>
        )}
        {status && <p className={s.statusMessage}>{status}</p>}
      </div>
    </div>
  );
};

export default ReportModal;
