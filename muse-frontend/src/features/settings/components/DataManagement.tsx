import { Database, Download, Upload, Trash2, RefreshCw, FileJson, FileSpreadsheet } from 'lucide-react';
import { DataManagement as DataManagementType } from '../types';

interface Props {
  data: DataManagementType;
  onExport: () => void;
  onClearAll: () => void;
  onUpdate: (updates: Partial<DataManagementType>) => void;
  isExporting?: boolean;
}

export default function DataManagement({ data, onExport, onClearAll, onUpdate, isExporting }: Props) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Database size={18} className="text-white" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Data Management</h3>
      </div>

      <div className="space-y-4">
        {/* Data Size */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
          <span className="text-sm text-gray-300">Total data stored</span>
          <span className="text-sm text-white font-medium">{data.dataSize}</span>
        </div>

        {/* Export Format */}
        <div>
          <label className="text-xs text-gray-400 block mb-2">Export Format</label>
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ exportFormat: 'json' })}
              className={`flex-1 p-2 rounded-xl text-sm flex items-center justify-center gap-2 ${
                data.exportFormat === 'json' ? 'bg-white text-black' : 'bg-white/10'
              }`}
            >
              <FileJson size={14} /> JSON
            </button>
            <button
              onClick={() => onUpdate({ exportFormat: 'csv' })}
              className={`flex-1 p-2 rounded-xl text-sm flex items-center justify-center gap-2 ${
                data.exportFormat === 'csv' ? 'bg-white text-black' : 'bg-white/10'
              }`}
            >
              <FileSpreadsheet size={14} /> CSV
            </button>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          disabled={isExporting}
          className="w-full py-2 bg-cyan-500 text-black rounded-xl font-medium hover:bg-cyan-400 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isExporting ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
          {isExporting ? 'Exporting...' : 'Export All Data'}
        </button>

        {data.lastExport && (
          <p className="text-[10px] text-gray-500 text-center">
            Last export: {new Date(data.lastExport).toLocaleString()}
          </p>
        )}

        {/* Danger Zone */}
        <div className="border-t border-red-500/30 pt-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <Trash2 size={14} className="text-red-400" />
            <span className="text-xs text-red-400 font-medium">Danger Zone</span>
          </div>
          <button
            onClick={onClearAll}
            className="w-full py-2 border border-red-500/50 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            Delete All Data
          </button>
          <p className="text-[10px] text-gray-500 text-center mt-2">
            This action cannot be undone. All your journals, threads, and rooms will be permanently deleted.
          </p>
        </div>
      </div>
    </div>
  );
}