import React, { useState } from 'react';
import { MasterTeacherProfile, Quarter } from '../types';
import { School, Settings, Check } from 'lucide-react';

interface MasterTeacherHeaderProps {
  profile: MasterTeacherProfile;
  onUpdateProfile: (updated: MasterTeacherProfile) => void;
}

export const MasterTeacherHeader: React.FC<MasterTeacherHeaderProps> = ({
  profile,
  onUpdateProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<MasterTeacherProfile>({ ...profile });

  const quarters: Quarter[] = ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'];

  const handleQuarterChange = (q: Quarter) => {
    onUpdateProfile({ ...profile, activeQuarter: q });
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border-b border-slate-200/90 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Identity lockup */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={profile.avatarUrl || '/src/assets/images/portrait_master_teacher_1792479588494.jpg'}
                alt={profile.fullName}
                referrerPolicy="no-referrer"
                className="w-13 h-13 rounded-full object-cover ring-2 ring-slate-100 bg-slate-100"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  {profile.fullName}
                </h1>
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {profile.designation}
                </span>
              </div>

              {/* Zero-Pill unboxed metadata */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 mt-1">
                <span className="flex items-center gap-1 font-medium text-slate-800">
                  <School className="w-3.5 h-3.5 text-slate-500" />
                  {profile.schoolName}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>School ID: <span className="font-mono tabular-nums font-medium text-slate-700">{profile.schoolId}</span></span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{profile.department}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{profile.academicYear}</span>
              </div>
            </div>
          </div>

          {/* Quarter Segmented Filter & Settings */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Interactive Quarter Selector (Functional button tabs) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/60">
              {quarters.map((q) => {
                const isActive = profile.activeQuarter === q;
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQuarterChange(q)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {q}
                  </button>
                );
              })}
            </div>

            {/* Profile Settings Trigger */}
            <button
              type="button"
              onClick={() => {
                setFormData({ ...profile });
                setIsEditing(true);
              }}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Edit School & Master Teacher Profile"
              aria-label="Edit Profile"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Edit Master Teacher & School Profile
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              These institutional details are printed on official DepEd Classroom Observation Tool (COT) rating sheets.
            </p>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Master Teacher Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation Cadre
                  </label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value as 'Master Teacher I' | 'Master Teacher II' })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="Master Teacher I">Master Teacher I</option>
                    <option value="Master Teacher II">Master Teacher II</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    School Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    School ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.schoolId}
                    onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                    className="w-full text-sm font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Schools Division
                  </label>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
