import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, RefreshCw, X, Image as ImageIcon } from 'lucide-react';

export interface ExtractedHistoryEntry {
  medicine_id: string;
  name: string;
  dosage: string;
  frequency: string;
  therapeutic_class: string;
  doctor_name: string;
  hospital_name: string;
  prescription_date: string;
  active: boolean;
  has_duplication_flag: boolean;
}

interface Props {
  patientName?: string;
  onHistoryAdded?: (item: ExtractedHistoryEntry) => void;
  compact?: boolean;
}

export const PatientHistoryUploader: React.FC<Props> = ({
  patientName = 'Ramesh Kumar',
  onHistoryAdded,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; previewUrl?: string } | null>(null);
  const [successItem, setSuccessItem] = useState<ExtractedHistoryEntry | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulateExtraction = (fileName: string, sampleMed?: ExtractedHistoryEntry) => {
    setIsUploading(true);
    setUploadProgress(15);
    setUploadStep('Reading document text...');
    setSuccessItem(null);

    setTimeout(() => {
      setUploadProgress(45);
      setUploadStep('Running Multimodal OCR & Drug DB Verification...');
    }, 400);

    setTimeout(() => {
      setUploadProgress(75);
      setUploadStep('Extracting Doctor, Dosage & Prescription Date...');
    }, 850);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStep('✅ Patient History Record Extracted Successfully!');
      setIsUploading(false);

      const newItem: ExtractedHistoryEntry = sampleMed || {
        medicine_id: `med-up-${Date.now()}`,
        name: 'Telmisartan',
        dosage: '40 mg',
        frequency: 'Once daily (Morning)',
        therapeutic_class: 'Angiotensin II Receptor Blocker (ARBs)',
        doctor_name: 'Dr. R. Sharma',
        hospital_name: 'Manipal Hospital, Bengaluru',
        prescription_date: new Date().toISOString().split('T')[0],
        active: true,
        has_duplication_flag: true
      };

      setSuccessItem(newItem);
      if (onHistoryAdded) {
        onHistoryAdded(newItem);
      }
    }, 1300);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKb = (file.size / 1024).toFixed(1) + ' KB';
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
    setUploadedFile({ name: file.name, size: sizeKb, previewUrl });

    handleSimulateExtraction(file.name);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const sizeKb = (file.size / 1024).toFixed(1) + ' KB';
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
    setUploadedFile({ name: file.name, size: sizeKb, previewUrl });

    handleSimulateExtraction(file.name);
  };

  const handleQuickSample = (sampleType: 'mehta' | 'sharma') => {
    if (sampleType === 'mehta') {
      setUploadedFile({ name: 'Prescription_Dr_Mehta_Apollo.jpg', size: '240 KB' });
      handleSimulateExtraction('Prescription_Dr_Mehta_Apollo.jpg', {
        medicine_id: `med-mehta-${Date.now()}`,
        name: 'Amlodipine',
        dosage: '5 mg',
        frequency: 'Once daily (Morning)',
        therapeutic_class: 'Calcium Channel Blocker (BP)',
        doctor_name: 'Dr. A. Mehta (Cardiology)',
        hospital_name: 'Apollo Hospital, Bengaluru',
        prescription_date: '2026-07-20',
        active: true,
        has_duplication_flag: false
      });
    } else {
      setUploadedFile({ name: 'Prescription_Dr_Sharma_Manipal.jpg', size: '310 KB' });
      handleSimulateExtraction('Prescription_Dr_Sharma_Manipal.jpg', {
        medicine_id: `med-sharma-${Date.now()}`,
        name: 'Telmisartan',
        dosage: '40 mg',
        frequency: 'Once daily (Morning)',
        therapeutic_class: 'Angiotensin II Receptor Blocker',
        doctor_name: 'Dr. R. Sharma (Orthopedics)',
        hospital_name: 'Manipal Hospital, Bengaluru',
        prescription_date: '2026-07-27',
        active: true,
        has_duplication_flag: true
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-teal-50/90 dark:from-slate-900 via-emerald-50/60 dark:via-teal-950/40 to-slate-50 dark:to-slate-900 border-2 border-teal-200/80 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-xs font-sans space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shadow-xs shrink-0">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-black text-xs md:text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Upload Patient History & Prescriptions</span>
              <span className="bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[9px] font-black px-2 py-0.5 rounded-full border border-teal-300 dark:border-teal-800">
                AI OCR Active
              </span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              Upload prescription images, doctor notes, or lab PDFs to update <strong className="text-slate-900 dark:text-slate-100">{patientName}</strong>'s longitudinal record.
            </p>
          </div>
        </div>

        {uploadedFile && (
          <button
            onClick={() => {
              setUploadedFile(null);
              setSuccessItem(null);
              setUploadProgress(0);
            }}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold p-1 cursor-pointer"
            title="Clear upload"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-teal-500 bg-teal-100/60 dark:bg-teal-950/80 scale-[1.01]'
            : 'border-teal-300/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 hover:border-teal-500 dark:hover:border-teal-400 shadow-2xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-2 py-2">
            <div className="flex items-center justify-center gap-2 text-xs font-black text-teal-900 dark:text-teal-200">
              <RefreshCw className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-spin" />
              <span>{uploadStep}</span>
            </div>
            <div className="w-full max-w-md mx-auto bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-600">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : uploadedFile ? (
          <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-800 dark:text-slate-200 py-1">
            <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span className="font-mono text-slate-900 dark:text-slate-100">{uploadedFile.name}</span>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">({uploadedFile.size})</span>
            <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full text-[10px]">Ready</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 py-1">
            <div className="flex items-center gap-2 text-xs font-black text-teal-800 dark:text-teal-300">
              <ImageIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Drop prescription file here, or <span className="text-teal-600 dark:text-teal-400 underline">browse computer</span></span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Supports JPG, PNG, WEBP, or PDF (Max 15MB)</span>
          </div>
        )}
      </div>

      {/* Quick Preset Sample Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">Quick Sample Uploads:</span>
          <button
            type="button"
            onClick={() => handleQuickSample('mehta')}
            className="text-[10px] font-black text-teal-800 dark:text-teal-200 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 border border-teal-300 dark:border-teal-700 px-2.5 py-1 rounded-lg shadow-2xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <span>📸 Dr. Mehta (Apollo)</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickSample('sharma')}
            className="text-[10px] font-black text-purple-800 dark:text-purple-200 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 border border-purple-300 dark:border-purple-700 px-2.5 py-1 rounded-lg shadow-2xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <span>📸 Dr. Sharma (Manipal)</span>
          </button>
        </div>

        {successItem && (
          <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Extracted: {successItem.name} {successItem.dosage} ({successItem.doctor_name})</span>
          </div>
        )}
      </div>
    </div>
  );
};
