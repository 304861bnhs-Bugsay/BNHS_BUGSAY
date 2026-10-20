import React, { useState } from 'react';
import { 
  SupervisoryScheduleItem, 
  Teacher, 
  Quarter 
} from '../types';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Trash2,
  Edit,
  ClipboardCheck
} from 'lucide-react';

interface ScheduleViewProps {
  schedule: SupervisoryScheduleItem[];
  teachers: Teacher[];
  activeQuarter: Quarter;
  onAddScheduleItem: (item: SupervisoryScheduleItem) => void;
  onUpdateScheduleItem: (item: SupervisoryScheduleItem) => void;
  onDeleteScheduleItem: (id: string) => void;
  onStartObservationWithTeacher: (teacherId: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  schedule,
  teachers,
  activeQuarter,
  onAddScheduleItem,
  onUpdateScheduleItem,
  onDeleteScheduleItem,
  onStartObservationWithTeacher
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupervisoryScheduleItem | null>(null);

  const [formData, setFormData] = useState({
    teacherId: teachers[0]?.id || '',
    scheduledDate: new Date().toISOString().split('T')[0],
    timeSlot: '08:00 AM - 09:00 AM',
    subject: 'Science 10',
    roomSection: 'Grade 10 - Newton',
    quarter: activeQuarter,
    observationType: 'Formal Announced' as 'Formal Announced' | 'Unannounced' | 'Follow-up',
    status: 'Scheduled' as 'Scheduled' | 'Completed' | 'Postponed',
    notes: ''
  });

  const quarters: (string | Quarter)[] = ['All', 'Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'];

  const filteredSchedule = schedule.filter((item) => {
    return selectedQuarter === 'All' || item.quarter === selectedQuarter;
  });

  // Sort chronologically
  const sortedSchedule = [...filteredSchedule].sort((a, b) => 
    new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      teacherId: teachers[0]?.id || '',
      scheduledDate: new Date().toISOString().split('T')[0],
      timeSlot: '08:00 AM - 09:00 AM',
      subject: 'Science 10',
      roomSection: 'Grade 10 - Newton',
      quarter: activeQuarter,
      observationType: 'Formal Announced',
      status: 'Scheduled',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SupervisoryScheduleItem) => {
    setEditingItem(item);
    setFormData({
      teacherId: item.teacherId,
      scheduledDate: item.scheduledDate,
      timeSlot: item.timeSlot,
      subject: item.subject,
      roomSection: item.roomSection,
      quarter: item.quarter,
      observationType: item.observationType,
      status: item.status,
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdateScheduleItem({
        ...editingItem,
        ...formData
      });
    } else {
      const newItem: SupervisoryScheduleItem = {
        id: `sch-${Date.now()}`,
        ...formData
      };
      onAddScheduleItem(newItem);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Instructional Supervisory Plan &amp; Observation Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quarterly calendar of formal announced visits, walkthroughs, and post-coaching verification observations
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Observation Visit</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {quarters.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setSelectedQuarter(q)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedQuarter === q
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-mono tabular-nums">
          {sortedSchedule.filter(s => s.status === 'Scheduled').length} upcoming visits
        </div>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-3">
        {sortedSchedule.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200/80 space-y-2">
            <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No scheduled observations for this period</p>
            <p className="text-xs text-slate-400">
              Click "Schedule Observation Visit" to set planned dates for your mentee teachers.
            </p>
          </div>
        ) : (
          sortedSchedule.map((item) => {
            const teacher = teachers.find(t => t.id === item.teacherId);
            const isCompleted = item.status === 'Completed';

            return (
              <div 
                key={item.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {teacher?.fullName || 'Teacher'}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({teacher?.cadre})
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {item.quarter}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">
                      {item.observationType}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 font-medium">
                    {item.subject} · {item.roomSection}
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-500 italic max-w-2xl">
                      Focus: {item.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
                  {/* Date & Time pill */}
                  <div className="text-right text-xs">
                    <div className="font-mono tabular-nums font-semibold text-slate-900">
                      {item.scheduledDate}
                    </div>
                    <div className="font-mono tabular-nums text-[11px] text-slate-500">
                      {item.timeSlot}
                    </div>
                  </div>

                  {/* Status */}
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700'
                      : item.status === 'Postponed'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-blue-50 text-blue-700'
                  }`}>
                    {item.status}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => onStartObservationWithTeacher(item.teacherId)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-2xs whitespace-nowrap"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        <span>Start COT</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Schedule"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Remove this scheduled observation?')) {
                          onDeleteScheduleItem(item.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Schedule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              {editingItem ? 'Edit Observation Schedule' : 'Schedule Classroom Supervisory Visit'}
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Coordinate planned observation dates with the teacher under mentorship.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teacher to Observe *
                </label>
                <select
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.cadre})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full text-xs font-mono px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Time Slot *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 08:30 AM - 09:30 AM"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject Area
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room &amp; Section
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roomSection}
                    onChange={(e) => setFormData({ ...formData, roomSection: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quarter
                  </label>
                  <select
                    value={formData.quarter}
                    onChange={(e) => setFormData({ ...formData, quarter: e.target.value as Quarter })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="Quarter 1">Quarter 1</option>
                    <option value="Quarter 2">Quarter 2</option>
                    <option value="Quarter 3">Quarter 3</option>
                    <option value="Quarter 4">Quarter 4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Visit Type
                  </label>
                  <select
                    value={formData.observationType}
                    onChange={(e) => setFormData({ ...formData, observationType: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="Formal Announced">Formal Announced</option>
                    <option value="Unannounced">Unannounced Walkthrough</option>
                    <option value="Follow-up">Post-Coaching Follow-up</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Postponed">Postponed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Observation Focus / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Focus on inquiry-based laboratory questioning and student engagement..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  {editingItem ? 'Update Schedule' : 'Confirm Visit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
