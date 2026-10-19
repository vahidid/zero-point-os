import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Zap,
  Flame,
  Users,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Bell,
  BellRing,
  Calendar,
  Plus,
  Play,
  Pause,
  Check,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowUpLeft,
  Inbox,
  X,
  Edit3,
  Clock,
  Cloud,
  CloudOff,
  RefreshCw,
  Download,
  Upload,
  Copy,
  Database,
  Key,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Share2,
  Info,
  CheckCircle
} from 'lucide-react';

// --- Web Audio API Sound Synthesizer ---
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  playSuccess() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.29);
      });
    } catch (e) {}
  }

  playCrumple() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 0.55;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const burst = Math.sin(i * 0.015) * Math.sin(i * 0.003);
        const crinkle = Math.random() > 0.35 ? (Math.random() * 2 - 1) * burst : 0;
        data[i] = crinkle;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1300, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.32, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {}
  }

  playBell() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.45);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    } catch (e) {}
  }
}

const sfx = new SoundEffects();

const INITIAL_THEMES = [
  { id: 'sat', dayName: 'شنبه', jsDay: 6, theme: 'پروژه اصلی • معماری', color: 'indigo' },
  { id: 'sun', dayName: 'یکشنبه', jsDay: 0, theme: 'محصول • اسپرینت', color: 'amber' },
  { id: 'mon', dayName: 'دوشنبه', jsDay: 1, theme: 'پروژه دوم • توسعه', color: 'emerald' },
  { id: 'tue', dayName: 'سه‌شنبه', jsDay: 2, theme: 'ریویو فنی • جلسات', color: 'rose' },
  { id: 'wed', dayName: 'چهارشنبه', jsDay: 3, theme: 'بستن تسک‌های باز', color: 'purple' },
  { id: 'thu', dayName: 'پنجشنبه', jsDay: 4, theme: 'مرور هفتگی • برنامه‌ریزی', color: 'cyan' },
  { id: 'fri', dayName: 'جمعه', jsDay: 5, theme: 'ریکاوری ذهن', color: 'slate' },
];

const INITIAL_DUMPS = [
  {
    id: 'd-1',
    text: 'ریفاکتور کردن هوک‌های اتصال به API در پروژه اصلی',
    mode: 'deep',
    createdAt: '۱۰ دقیقه پیش',
  },
  {
    id: 'd-2',
    text: 'هماهنگی با تیم محصول درباره اولویت فیچرهای نسخه بعدی',
    mode: 'sync',
    createdAt: '۳۵ دقیقه پیش',
  },
  {
    id: 'd-3',
    text: 'بررسی PRهای معوقه بچه‌های فرانت‌اند',
    mode: 'sync',
    createdAt: '۱ ساعت پیش',
  },
  {
    id: 'd-4',
    text: 'تایید دسترسی محیط استیجینگ برای دولوپر جدید',
    mode: 'quick',
    createdAt: '۲ ساعت پیش',
  },
];

const INITIAL_STICKY = {
  deep: {
    id: 's-1',
    text: 'پیاده‌سازی معماری استیت‌منیجمنت ماژول جدید (بدون وقفه)',
    done: false,
  },
  sync1: {
    id: 's-2',
    text: 'نهایی کردن اسکوپ تسک‌های این هفته با تیم',
    done: false,
  },
  sync2: {
    id: 's-3',
    text: 'کد ریویو و مرج کردن برنچ اصلی پروژه دوم',
    done: true,
  },
};

const MODE_META = {
  untagged: {
    label: 'بدون برچسب',
    dot: 'bg-slate-500',
    badge: 'bg-slate-800/80 text-slate-300 border-slate-700',
  },
  deep: {
    label: 'عمیق',
    dot: 'bg-rose-500',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  },
  sync: {
    label: 'تعاملی',
    dot: 'bg-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  quick: {
    label: 'سرپایی',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
};

const SUPABASE_SQL_SNIPPET = `-- این کد را در بخش SQL Editor پنل Supabase خود اجرا کنید:
create table if not exists public.zero_point_workspaces (
  workspace_key text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.zero_point_workspaces enable row level security;

create policy "Allow public workspace access by key"
  on public.zero_point_workspaces
  for all
  using (true)
  with check (true);`;

export default function App() {
  // --- States ---
  const [dumps, setDumps] = useState(() => {
    try {
      const saved = localStorage.getItem('zp_dumps_v2');
      return saved ? JSON.parse(saved) : INITIAL_DUMPS;
    } catch {
      return INITIAL_DUMPS;
    }
  });

  const [sticky, setSticky] = useState(() => {
    try {
      const saved = localStorage.getItem('zp_sticky_v2');
      return saved ? JSON.parse(saved) : INITIAL_STICKY;
    } catch {
      return INITIAL_STICKY;
    }
  });

  const [themes, setThemes] = useState(() => {
    try {
      const saved = localStorage.getItem('zp_themes_v2');
      return saved ? JSON.parse(saved) : INITIAL_THEMES;
    } catch {
      return INITIAL_THEMES;
    }
  });

  const [updatedAt, setUpdatedAt] = useState(() => {
    return localStorage.getItem('zp_updated_at') || new Date().toISOString();
  });

  // Cloud Config State
  const [cloudConfig, setCloudConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('zp_cloud_config');
      return saved
        ? JSON.parse(saved)
        : {
            supabaseUrl: import.meta?.env?.VITE_SUPABASE_URL || '',
            supabaseAnonKey: import.meta?.env?.VITE_SUPABASE_ANON_KEY || '',
            workspaceKey: import.meta?.env?.VITE_WORKSPACE_KEY || '',
            autoSync: true,
          };
    } catch {
      return { supabaseUrl: '', supabaseAnonKey: '', workspaceKey: '', autoSync: true };
    }
  });

  const [syncStatus, setSyncStatus] = useState('offline'); // 'offline' | 'syncing' | 'synced' | 'error'
  const [lastSyncedTime, setLastSyncedTime] = useState(null);
  const [syncErrorMsg, setSyncErrorMsg] = useState('');

  // PWA & Mobile Navigation
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('focus'); // 'focus' | 'inbox' | 'themes' | 'settings'

  const [dumpInput, setDumpInput] = useState('');
  const [quickMode, setQuickMode] = useState('untagged');
  const [filterMode, setFilterMode] = useState('all');
  const [systemMode, setSystemMode] = useState('deep');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Drawers & Modals (Desktop & Shared)
  const [inboxOpen, setInboxOpen] = useState(true);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [cloudModalOpen, setCloudModalOpen] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Sticky Note States
  const [isCrumpling, setIsCrumpling] = useState(false);
  const [crumpleCount, setCrumpleCount] = useState(() => {
    return Number(localStorage.getItem('zp_crumple_count') || 0);
  });
  const [manualSlotInput, setManualSlotInput] = useState({ deep: '', sync1: '', sync2: '' });

  // Focus Timer
  const [timerSeconds, setTimerSeconds] = useState(90 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(90);

  // Theme editing
  const [editingDayId, setEditingDayId] = useState(null);
  const [editingThemeText, setEditingThemeText] = useState('');

  // Notifications
  const [notifPermission, setNotifPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [reminders, setReminders] = useState([
    { id: 'r1', title: 'شروع بلوک عمیق', time: '09:00', active: true },
    { id: 'r2', title: 'سوئیچ به حالت تعاملی', time: '14:00', active: true },
    { id: 'r3', title: 'تخلیه ذهن شبانه', time: '18:00', active: false },
  ]);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('11:30');
  const [inAppToast, setInAppToast] = useState(null);

  const dumpInputRef = useRef(null);
  const mobileDumpInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const isRemoteApplyingRef = useRef(false);

  // --- Haptic Feedback Helper ---
  const triggerHaptic = useCallback((pattern = 10) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }, []);

  const showToast = useCallback((title, body) => {
    setInAppToast({ title, body });
    setTimeout(() => {
      setInAppToast((prev) => (prev?.title === title ? null : prev));
    }, 3500);
  }, []);

  // --- Audio Unlock on Mobile Touch ---
  useEffect(() => {
    const unlockAudio = () => {
      sfx.init();
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('click', unlockAudio);
    return () => {
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, []);

  // --- PWA Detection & Install Event ---
  useEffect(() => {
    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setIsStandalone(checkStandalone);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      setInstallModalOpen(true);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      triggerHaptic([20, 40, 20]);
      showToast('نصب شد', 'اپلیکیشن نقطه صفر با موفقیت به دستگاه شما اضافه شد.');
    }
  };

  // --- LocalStorage Persistence (Offline-First) ---
  useEffect(() => {
    localStorage.setItem('zp_dumps_v2', JSON.stringify(dumps));
    localStorage.setItem('zp_sticky_v2', JSON.stringify(sticky));
    localStorage.setItem('zp_themes_v2', JSON.stringify(themes));
    localStorage.setItem('zp_crumple_count', String(crumpleCount));
    if (!isRemoteApplyingRef.current) {
      const nowIso = new Date().toISOString();
      setUpdatedAt(nowIso);
      localStorage.setItem('zp_updated_at', nowIso);
    }
  }, [dumps, sticky, themes, crumpleCount]);

  useEffect(() => {
    localStorage.setItem('zp_cloud_config', JSON.stringify(cloudConfig));
  }, [cloudConfig]);

  // --- Direct Supabase REST Sync Helper ---
  const isCloudConfigured = Boolean(
    cloudConfig.supabaseUrl?.trim() &&
      cloudConfig.supabaseAnonKey?.trim() &&
      cloudConfig.workspaceKey?.trim()
  );

  const pushToSupabase = useCallback(
    async (silent = true) => {
      if (!isCloudConfigured) {
        setSyncStatus('offline');
        return;
      }
      setSyncStatus('syncing');
      setSyncErrorMsg('');
      try {
        const baseUrl = cloudConfig.supabaseUrl.trim().replace(/\/$/, '');
        const key = cloudConfig.supabaseAnonKey.trim();
        const wsKey = cloudConfig.workspaceKey.trim();

        const payload = {
          dumps,
          sticky,
          themes,
          crumpleCount,
          reminders,
          clientUpdatedAt: updatedAt,
        };

        const res = await fetch(
          `${baseUrl}/rest/v1/zero_point_workspaces?on_conflict=workspace_key`,
          {
            method: 'POST',
            headers: {
              apikey: key,
              Authorization: `Bearer ${key}`,
              'Content-Type': 'application/json',
              Prefer: 'resolution=merge-duplicates,return=minimal',
            },
            body: JSON.stringify({
              workspace_key: wsKey,
              payload,
              updated_at: new Date().toISOString(),
            }),
          }
        );

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || `HTTP ${res.status}`);
        }

        setSyncStatus('synced');
        setLastSyncedTime(
          new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        );
        if (!silent) showToast('سینک ابری', 'اطلاعات با موفقیت در Supabase ذخیره شد.');
      } catch (err) {
        setSyncStatus('error');
        setSyncErrorMsg('خطا در اتصال یا عدم وجود جدول در Supabase');
        if (!silent) showToast('خطای سینک', 'اتصال برقرار نشد. از اجرای کد SQL مطمئن شوید.');
      }
    },
    [isCloudConfigured, cloudConfig, dumps, sticky, themes, crumpleCount, reminders, updatedAt, showToast]
  );

  const pullFromSupabase = useCallback(
    async (silent = false) => {
      if (!isCloudConfigured) {
        setSyncStatus('offline');
        return;
      }
      setSyncStatus('syncing');
      setSyncErrorMsg('');
      try {
        const baseUrl = cloudConfig.supabaseUrl.trim().replace(/\/$/, '');
        const key = cloudConfig.supabaseAnonKey.trim();
        const wsKey = encodeURIComponent(cloudConfig.workspaceKey.trim());

        const res = await fetch(
          `${baseUrl}/rest/v1/zero_point_workspaces?workspace_key=eq.${wsKey}&select=payload,updated_at`,
          {
            method: 'GET',
            headers: {
              apikey: key,
              Authorization: `Bearer ${key}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const rows = await res.json();
        if (rows && rows.length > 0 && rows[0].payload) {
          const remote = rows[0].payload;
          isRemoteApplyingRef.current = true;
          if (Array.isArray(remote.dumps)) setDumps(remote.dumps);
          if (remote.sticky) setSticky(remote.sticky);
          if (Array.isArray(remote.themes)) setThemes(remote.themes);
          if (typeof remote.crumpleCount === 'number') setCrumpleCount(remote.crumpleCount);
          if (Array.isArray(remote.reminders)) setReminders(remote.reminders);
          setTimeout(() => {
            isRemoteApplyingRef.current = false;
          }, 100);

          setSyncStatus('synced');
          setLastSyncedTime(
            new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
          );
          if (!silent) showToast('دریافت از ابر', 'آخرین اطلاعات فضای کاری شما بارگذاری شد.');
        } else {
          await pushToSupabase(true);
          if (!silent) showToast('فضای کاری جدید', 'فضای کاری شما در Supabase ساخته و سینک شد.');
        }
      } catch (err) {
        setSyncStatus('error');
        setSyncErrorMsg('جدول یافت نشد یا کلیدها نامعتبر هستند');
        if (!silent) showToast('خطا در دریافت', 'مشکلی در ارتباط با Supabase وجود دارد.');
      }
    },
    [isCloudConfigured, cloudConfig, pushToSupabase, showToast]
  );

  useEffect(() => {
    if (isCloudConfigured && cloudConfig.autoSync) {
      pullFromSupabase(true);
    } else if (!isCloudConfigured) {
      setSyncStatus('offline');
    }
  }, [cloudConfig.supabaseUrl, cloudConfig.supabaseAnonKey, cloudConfig.workspaceKey]);

  useEffect(() => {
    if (!isCloudConfigured || !cloudConfig.autoSync || isRemoteApplyingRef.current) return;
    const timer = setTimeout(() => {
      pushToSupabase(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [dumps, sticky, themes, crumpleCount, isCloudConfigured, cloudConfig.autoSync, pushToSupabase]);

  // --- Backup JSON Export / Import ---
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(
      { dumps, sticky, themes, crumpleCount, reminders, exportedAt: new Date().toISOString() },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zero-point-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerHaptic(15);
    showToast('بکاپ گرفته شد', 'فایل JSON فضای کاری شما دانلود شد.');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed.dumps)) setDumps(parsed.dumps);
        if (parsed.sticky) setSticky(parsed.sticky);
        if (Array.isArray(parsed.themes)) setThemes(parsed.themes);
        if (typeof parsed.crumpleCount === 'number') setCrumpleCount(parsed.crumpleCount);
        triggerHaptic([15, 30]);
        showToast('بازیابی موفق', 'اطلاعات فایل بکاپ با موفقیت جایگزین شد.');
      } catch {
        showToast('خطا', 'فایل JSON معتبر نیست.');
      }
    };
    reader.readAsText(file);
  };

  // --- Keyboard Shortcut Ctrl+K / Cmd+K ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        dumpInputRef.current?.focus();
        mobileDumpInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Timer Countdown ---
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          sfx.playBell();
          triggerHaptic([40, 60, 40, 60]);
          triggerAlert('پایان بلوک تمرکز عمیق!', 'زمان استراحت کوتاه و تنفس است.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  // --- Minute Watcher for Reminders ---
  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date();
      const currentHM = now.toTimeString().slice(0, 5);
      if (now.getSeconds() < 2) {
        reminders.forEach((r) => {
          if (r.active && r.time === currentHM) {
            triggerAlert('یادآور نقطه صفر', r.title);
          }
        });
      }
    }, 1000);
    return () => clearInterval(checkReminders);
  }, [reminders]);

  const toggleSound = () => {
    sfx.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    triggerHaptic(10);
  };

  const triggerAlert = (title, body) => {
    sfx.playBell();
    triggerHaptic([30, 40, 30]);
    showToast(title, body);
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification(title, { body });
      } catch (e) {}
    }
  };

  const requestNotifPermission = async () => {
    if (typeof Notification === 'undefined') {
      showToast('عدم پشتیبانی', 'مرورگر از نوتیفیکیشن سیستم پشتیبانی نمی‌کند.');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
      if (perm === 'granted') {
        triggerAlert('نوتیفیکیشن فعال شد', 'یادآورهای تغییر حالت ذهنی فعال شدند.');
      }
    } catch (e) {
      showToast('نوتیفیکیشن داخلی فعال شد', 'هشدارها داخل برنامه نمایش داده می‌شوند.');
    }
  };

  // --- Brain Dump Handlers ---
  const handleAddDump = (e) => {
    e.preventDefault();
    if (!dumpInput.trim()) return;
    const newItem = {
      id: 'd-' + Date.now(),
      text: dumpInput.trim(),
      mode: quickMode,
      createdAt: 'لحظاتی پیش',
    };
    setDumps([newItem, ...dumps]);
    setDumpInput('');
    setQuickMode('untagged');
    sfx.playPop();
    triggerHaptic(15);
  };

  const handleSetDumpMode = (id, mode) => {
    setDumps(dumps.map((item) => (item.id === id ? { ...item, mode } : item)));
    sfx.playPop();
    triggerHaptic(10);
  };

  const handleDeleteDump = (id) => {
    setDumps(dumps.filter((item) => item.id !== id));
    triggerHaptic(15);
  };

  const handleCompleteQuickDump = (id) => {
    sfx.playSuccess();
    triggerHaptic([15, 25]);
    setDumps(dumps.filter((item) => item.id !== id));
    showToast('انجام شد', 'کار سرپایی بسته شد.');
  };

  // --- Promote to Sticky Note ---
  const promoteToSticky = (item, targetSlot = null) => {
    let slot = targetSlot;
    if (!slot) {
      if (item.mode === 'deep' && !sticky.deep) {
        slot = 'deep';
      } else if (!sticky.sync1) {
        slot = 'sync1';
      } else if (!sticky.sync2) {
        slot = 'sync2';
      } else if (!sticky.deep) {
        slot = 'deep';
      }
    }

    if (!slot || sticky[slot]) {
      showToast('ظرفیت میز امروز پر است', 'ابتدا یکی از ۳ کار را آزاد یا مچاله کن.');
      triggerHaptic(30);
      return;
    }

    setSticky({
      ...sticky,
      [slot]: { id: item.id, text: item.text, done: false },
    });
    setDumps(dumps.filter((d) => d.id !== item.id));
    sfx.playPop();
    triggerHaptic(20);
    showToast('به میز امروز اضافه شد', 'تسک در استیکی‌نوت قرار گرفت.');
  };

  const returnSlotToDump = (slotKey) => {
    const task = sticky[slotKey];
    if (!task) return;
    setDumps([
      {
        id: task.id,
        text: task.text,
        mode: slotKey === 'deep' ? 'deep' : 'sync',
        createdAt: 'برگشتی از میز امروز',
      },
      ...dumps,
    ]);
    setSticky({ ...sticky, [slotKey]: null });
    sfx.playPop();
    triggerHaptic(12);
  };

  const toggleStickyDone = (slotKey) => {
    const task = sticky[slotKey];
    if (!task) return;
    const nextDone = !task.done;
    if (nextDone) {
      sfx.playSuccess();
      triggerHaptic([15, 25]);
    } else {
      sfx.playPop();
      triggerHaptic(10);
    }

    setSticky({
      ...sticky,
      [slotKey]: { ...task, done: nextDone },
    });
  };

  const handleManualSlotAdd = (slotKey, e) => {
    e.preventDefault();
    const val = manualSlotInput[slotKey]?.trim();
    if (!val) return;
    setSticky({
      ...sticky,
      [slotKey]: { id: 's-' + Date.now(), text: val, done: false },
    });
    setManualSlotInput({ ...manualSlotInput, [slotKey]: '' });
    sfx.playPop();
    triggerHaptic(15);
  };

  // --- Crumple Sticky Note ---
  const handleCrumpleSticky = () => {
    if (isCrumpling) return;
    const hasAnyTask = sticky.deep || sticky.sync1 || sticky.sync2;
    if (!hasAnyTask) {
      showToast('استیکی‌نوت خالی است', 'چیزی برای مچاله کردن روی کاغذ نیست.');
      return;
    }

    sfx.playCrumple();
    triggerHaptic([30, 45, 60, 45]);
    setIsCrumpling(true);

    setTimeout(() => {
      const unfinished = [];
      ['deep', 'sync1', 'sync2'].forEach((key) => {
        const item = sticky[key];
        if (item && !item.done) {
          unfinished.push({
            id: item.id,
            text: item.text,
            mode: key === 'deep' ? 'deep' : 'sync',
            createdAt: 'از استیکی‌نوت قبلی',
          });
        }
      });

      if (unfinished.length > 0) {
        setDumps((prev) => [...unfinished, ...prev]);
      }

      setSticky({ deep: null, sync1: null, sync2: null });
      setCrumpleCount((c) => c + 1);
      setIsCrumpling(false);
      showToast('کاغذ مچاله شد!', 'کارهای ناتمام بدون برچسب عقب‌افتادگی به ورودی برگشتند.');
    }, 620);
  };

  // --- Helpers ---
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const todayJsDay = new Date().getDay();
  const todayThemeObj = themes.find((t) => t.jsDay === todayJsDay) || themes[0];

  const filteredDumps = dumps.filter((d) => {
    if (filterMode === 'all') return true;
    return d.mode === filterMode;
  });

  const completedStickyCount = ['deep', 'sync1', 'sync2'].filter(
    (k) => sticky[k] && sticky[k].done
  ).length;
  const totalStickyCount = ['deep', 'sync1', 'sync2'].filter((k) => sticky[k]).length;
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  // --- Quick Capture Omnibox Component ---
  const renderOmnibox = (isMobile = false) => (
    <div className={`w-full ${isMobile ? 'max-w-none' : 'max-w-xl'} shrink-0`}>
      <form
        onSubmit={handleAddDump}
        className="bg-slate-900/95 border border-slate-800/90 focus-within:border-amber-400/60 rounded-2xl p-1.5 shadow-xl flex items-center gap-2 transition-all"
      >
        <input
          ref={isMobile ? mobileDumpInputRef : dumpInputRef}
          type="text"
          value={dumpInput}
          onChange={(e) => setDumpInput(e.target.value)}
          placeholder={isMobile ? 'تخلیه فوری ذهن در ورودی لال...' : 'تخلیه فوری ذهن در ورودی لال... (Ctrl + K)'}
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm px-3 py-2.5 focus:outline-none"
        />

        {/* Quick Mode Tag Selector */}
        <div className="flex items-center gap-1 px-1">
          {['deep', 'sync', 'quick'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setQuickMode(quickMode === m ? 'untagged' : m);
                triggerHaptic(8);
              }}
              title={MODE_META[m].label}
              className={`min-w-[28px] min-h-[28px] rounded-lg flex items-center justify-center border transition-all active:scale-90 ${
                quickMode === m
                  ? MODE_META[m].badge + ' scale-105 shadow-sm'
                  : 'border-transparent hover:bg-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${MODE_META[m].dot}`} />
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1 active:scale-95 shadow-md shadow-amber-400/10 min-h-touch"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">ثبت</span>
        </button>
      </form>
    </div>
  );

  // --- Sticky Note Component (Used on Desktop & Mobile) ---
  const renderStickyNote = (isMobile = false) => (
    <div className={`w-full ${isMobile ? 'max-w-none' : 'max-w-xl'} my-auto py-2 flex flex-col items-center`}>
      <div
        className={`w-full sticky-paper rounded-2xl p-4 sm:p-6 text-slate-900 relative transition-all duration-300 ${
          isCrumpling ? 'animate-crumple' : 'rotate-[-0.3deg] hover:rotate-0'
        }`}
      >
        {/* Top Paper Tape */}
        <div className="w-24 h-5 sm:h-6 bg-white/40 backdrop-blur-sm absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 rotate-1 rounded-sm shadow-sm pointer-events-none" />

        {/* Sticky Header */}
        <div className="flex items-center justify-between border-b border-slate-900/10 pb-3 mb-3.5 sm:mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-900" />
            <h2 className="font-extrabold text-sm sm:text-base text-slate-900">۳ خروجی امروز</h2>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/10 text-slate-800">
            {completedStickyCount} از {totalStickyCount || 3}
          </span>
        </div>

        {/* Slot 1: Deep Work */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-1 mb-2">
            <span className="text-[11px] font-extrabold text-rose-950 flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
              ۱ کار عمیق (سازنده)
            </span>

            {/* Mini Focus Timer */}
            <div className="flex items-center gap-1 bg-slate-900/10 px-2 py-0.5 rounded-lg shrink-0">
              {[45, 90].map((min) => (
                <button
                  key={min}
                  onClick={() => {
                    setSelectedPreset(min);
                    setTimerSeconds(min * 60);
                    setTimerRunning(false);
                    triggerHaptic(8);
                  }}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors active:scale-90 ${
                    selectedPreset === min
                      ? 'bg-slate-900 text-amber-300'
                      : 'text-slate-700 hover:bg-slate-900/10'
                  }`}
                >
                  {min}m
                </button>
              ))}
              <span className="font-mono font-extrabold text-xs text-slate-900 mx-1">
                {formatTime(timerSeconds)}
              </span>
              <button
                onClick={() => {
                  sfx.playPop();
                  triggerHaptic(10);
                  setTimerRunning(!timerRunning);
                }}
                className="p-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-500 transition-colors active:scale-90"
              >
                {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {sticky.deep ? (
            <div
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                sticky.deep.done
                  ? 'bg-emerald-950/10 border-emerald-800/20 opacity-65'
                  : 'bg-white/65 border-slate-900/15 shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleStickyDone('deep')}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                  sticky.deep.done
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-700 hover:border-rose-600 bg-white/80'
                }`}
              >
                {sticky.deep.done && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
              <span
                onClick={() => toggleStickyDone('deep')}
                className={`flex-1 text-xs sm:text-sm font-bold cursor-pointer leading-snug py-0.5 select-text ${
                  sticky.deep.done ? 'line-through text-slate-700' : 'text-slate-900'
                }`}
              >
                {sticky.deep.text}
              </span>
              <button
                onClick={() => returnSlotToDump('deep')}
                title="برگشت به ورودی"
                className="p-1.5 rounded-lg hover:bg-slate-900/10 text-slate-600 hover:text-slate-900 transition-colors active:scale-90"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => handleManualSlotAdd('deep', e)} className="flex gap-1.5">
              <input
                type="text"
                value={manualSlotInput.deep}
                onChange={(e) =>
                  setManualSlotInput({ ...manualSlotInput, deep: e.target.value })
                }
                placeholder="مهم‌ترین تسک عمیق امروز..."
                className="flex-1 bg-white/50 border border-dashed border-slate-900/25 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white/80"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-slate-900 text-amber-300 text-xs font-bold hover:bg-slate-800 active:scale-95 transition-colors shrink-0"
              >
                افزودن
              </button>
            </form>
          )}
        </div>

        {/* Slots 2 & 3: Sync / Product / Management */}
        <div>
          <span className="text-[11px] font-extrabold text-amber-950 flex items-center gap-1.5 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />۲ کار تعاملی و محصولی
          </span>

          <div className="space-y-2">
            {['sync1', 'sync2'].map((slotKey, index) => {
              const item = sticky[slotKey];
              return item ? (
                <div
                  key={slotKey}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                    item.done
                      ? 'bg-emerald-950/10 border-emerald-800/20 opacity-65'
                      : 'bg-white/60 border-slate-900/15 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => toggleStickyDone(slotKey)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                      item.done
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-700 hover:border-amber-700 bg-white/80'
                    }`}
                  >
                    {item.done && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                  <span
                    onClick={() => toggleStickyDone(slotKey)}
                    className={`flex-1 text-xs sm:text-sm font-bold cursor-pointer leading-snug py-0.5 select-text ${
                      item.done ? 'line-through text-slate-700' : 'text-slate-900'
                    }`}
                  >
                    {item.text}
                  </span>
                  <button
                    onClick={() => returnSlotToDump(slotKey)}
                    title="برگشت به ورودی"
                    className="p-1.5 rounded-lg hover:bg-slate-900/10 text-slate-600 hover:text-slate-900 transition-colors active:scale-90"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form
                  key={slotKey}
                  onSubmit={(e) => handleManualSlotAdd(slotKey, e)}
                  className="flex gap-1.5"
                >
                  <input
                    type="text"
                    value={manualSlotInput[slotKey]}
                    onChange={(e) =>
                      setManualSlotInput({ ...manualSlotInput, [slotKey]: e.target.value })
                    }
                    placeholder={`کار تعاملی / مدیریتی #${index + 1}...`}
                    className="flex-1 bg-white/45 border border-dashed border-slate-900/25 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 placeholder-slate-600 focus:outline-none focus:bg-white/80"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-amber-300 text-xs font-bold hover:bg-slate-800 active:scale-95 transition-colors shrink-0"
                  >
                    افزودن
                  </button>
                </form>
              );
            })}
          </div>
        </div>

        {/* Sticky Footer: Crumple Action */}
        <div className="mt-4 pt-3 border-t border-slate-900/10 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-700">
            مچاله‌شده‌ها: {crumpleCount}
          </span>
          <button
            onClick={handleCrumpleSticky}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-amber-300 hover:text-rose-200 font-bold text-xs transition-all shadow-sm active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>مچاله کردن و شروع تازه</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      dir="rtl"
      className={`h-screen h-[100dvh] w-screen overflow-hidden flex flex-col transition-colors duration-700 text-slate-100 selection:bg-amber-400 selection:text-slate-950 ${
        systemMode === 'deep' ? 'bg-[#090d16]' : 'bg-[#0c1322]'
      }`}
      style={{
        fontFamily:
          'Vazirmatn, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap');

        @keyframes crumpleAnim {
          0% { transform: scale(1) rotate(-0.5deg); filter: brightness(1); }
          30% { transform: scale(0.75) rotate(8deg) skewX(12deg) skewY(-8deg); filter: brightness(0.85); border-radius: 35%; }
          65% { transform: scale(0.32) rotate(-25deg) skewX(-20deg); filter: brightness(0.65); border-radius: 50%; opacity: 0.85; }
          100% { transform: scale(0) rotate(55deg); opacity: 0; border-radius: 50%; }
        }
        .animate-crumple {
          animation: crumpleAnim 0.6s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
          will-change: transform, opacity;
        }

        .clean-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.18) transparent;
          scrollbar-gutter: stable;
          -webkit-overflow-scrolling: touch;
        }
        .clean-scroll::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .clean-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .clean-scroll::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.18);
          border-radius: 9999px;
        }
        .clean-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.35);
        }

        .sticky-paper {
          background: linear-gradient(145deg, #fef08a 0%, #fde047 60%, #facc15 100%);
          box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.65), 0 4px 12px rgba(250, 204, 21, 0.12);
        }
      `}</style>

      {/* Subtle Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute -top-40 right-1/4 w-96 h-96 rounded-full blur-[150px] transition-all duration-1000 ${
            systemMode === 'deep' ? 'bg-rose-600/10' : 'bg-amber-500/10'
          }`}
        />
      </div>

      {/* Toast Notification */}
      {inAppToast && (
        <div className="fixed bottom-20 md:bottom-5 left-4 right-4 md:right-auto md:left-5 z-50 max-w-sm bg-slate-900/95 border border-slate-700/80 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-bounce">
          <BellRing className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex-1">
            <h4 className="font-bold text-xs text-amber-300">{inAppToast.title}</h4>
            <p className="text-xs text-slate-300 mt-0.5">{inAppToast.body}</p>
          </div>
        </div>
      )}

      {/* --- DESKTOP HEADER (hidden on mobile < md) --- */}
      <header className="hidden md:flex relative z-20 h-16 px-4 sm:px-6 border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md items-center justify-between shrink-0">
        {/* Right: Logo & Day Theme Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-md shadow-amber-500/10">
              <Zap className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">نقطه صفر</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <button
            onClick={() => setThemeModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs transition-all group active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">{todayThemeObj.dayName}:</span>
            <span className="font-bold text-slate-200 max-w-xs truncate">
              {todayThemeObj.theme}
            </span>
            <Edit3 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Center: Mode Switcher */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800/90">
          <button
            onClick={() => {
              setSystemMode('deep');
              sfx.playPop();
              triggerHaptic(10);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
              systemMode === 'deep'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>حالت عمیق</span>
          </button>
          <button
            onClick={() => {
              setSystemMode('sync');
              sfx.playPop();
              triggerHaptic(10);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
              systemMode === 'sync'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>حالت تعاملی</span>
          </button>
        </div>

        {/* Left: Action Icons */}
        <div className="flex items-center gap-2">
          {/* Cloud Sync Status */}
          <button
            onClick={() => setCloudModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
              syncStatus === 'synced'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : syncStatus === 'syncing'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : syncStatus === 'error'
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="تنظیمات ابری Supabase و بکاپ"
          >
            {syncStatus === 'syncing' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : syncStatus === 'synced' ? (
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <CloudOff className="w-3.5 h-3.5" />
            )}
            <span>
              {syncStatus === 'synced'
                ? 'سینک ابری'
                : syncStatus === 'syncing'
                ? 'در حال سینک...'
                : syncStatus === 'error'
                ? 'خطای سینک'
                : 'آفلاین'}
            </span>
          </button>

          {/* Install PWA Button */}
          {!isStandalone && (
            <button
              onClick={handleInstallPWA}
              className="px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 text-xs font-bold active:scale-95"
              title="نصب برنامه (PWA)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>نصب PWA</span>
            </button>
          )}

          {/* Toggle Inbox Drawer */}
          <button
            onClick={() => setInboxOpen(!inboxOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
              inboxOpen
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="ورودی لال"
          >
            <Inbox className="w-4 h-4 text-amber-400" />
            <span>ورودی</span>
            <span className="px-1.5 py-0.2 rounded-md bg-slate-950 text-slate-300 text-[11px]">
              {dumps.length}
            </span>
          </button>

          {/* Reminders Button */}
          <button
            onClick={() => setReminderModalOpen(true)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors relative active:scale-95"
            title="یادآورها"
          >
            <Bell className="w-4 h-4" />
            {reminders.some((r) => r.active) && (
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors active:scale-95"
            title="صدا"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </header>

      {/* --- MOBILE COMPACT HEADER (< md, Safe Area Aware) --- */}
      <header className="md:hidden relative z-30 pt-safe px-3.5 py-2.5 border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl flex items-center justify-between shrink-0">
        {/* Brand & Day theme */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <div
            onClick={() => setActiveMobileTab('themes')}
            className="flex flex-col cursor-pointer"
          >
            <span className="font-extrabold text-xs text-white leading-tight">نقطه صفر</span>
            <span className="text-[10px] text-amber-400/90 font-medium truncate max-w-[125px]">
              {todayThemeObj.dayName} • {todayThemeObj.theme}
            </span>
          </div>
        </div>

        {/* Mode Switch & Quick Status */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-900/95 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setSystemMode('deep');
                sfx.playPop();
                triggerHaptic(10);
              }}
              className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all active:scale-90 ${
                systemMode === 'deep' ? 'bg-rose-500 text-white shadow' : 'text-slate-400'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>عمیق</span>
            </button>
            <button
              onClick={() => {
                setSystemMode('sync');
                sfx.playPop();
                triggerHaptic(10);
              }}
              className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all active:scale-90 ${
                systemMode === 'sync' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>تعاملی</span>
            </button>
          </div>

          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 active:scale-90"
            title="صدا"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>

          {!isStandalone && (
            <button
              onClick={() => setInstallModalOpen(true)}
              className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 active:scale-90"
              title="نصب اپلیکیشن"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* --- DESKTOP WORKSPACE LAYOUT (hidden on mobile < md) --- */}
      <div className="relative z-10 flex-1 hidden md:flex overflow-hidden">
        {/* Center Canvas: Omnibox + Sticky Note */}
        <main className="flex-1 h-full overflow-y-auto clean-scroll flex flex-col items-center justify-between px-4 py-5 sm:py-6">
          {renderOmnibox(false)}
          {renderStickyNote(false)}

          {/* Minimal Footer Hint */}
          <div className="text-[11px] text-slate-500 flex items-center gap-4 shrink-0">
            <span>فقط ۳ کار در روز</span>
            <span>•</span>
            <span>بدون لیست عقب‌افتاده</span>
            {lastSyncedTime && (
              <>
                <span>•</span>
                <span className="text-emerald-400/80">آخرین سینک: {lastSyncedTime}</span>
              </>
            )}
          </div>
        </main>

        {/* Collapsible Side Panel: Dumb Inbox */}
        {inboxOpen && (
          <aside className="w-80 lg:w-96 h-full border-r border-slate-800/70 bg-slate-950/75 backdrop-blur-xl flex flex-col shrink-0 z-20">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800/70 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">ورودی لال (Brain Dump)</h3>
              </div>
              <button
                onClick={() => setInboxOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Pills */}
            <div className="px-4 py-2.5 border-b border-slate-800/50 flex items-center gap-1 overflow-x-auto clean-scroll shrink-0">
              {[
                { key: 'all', label: 'همه' },
                { key: 'untagged', label: 'بی‌برچسب' },
                { key: 'deep', label: '🔴 عمیق' },
                { key: 'sync', label: '🟡 تعاملی' },
                { key: 'quick', label: '🟢 سرپایی' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterMode(tab.key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                    filterMode === tab.key
                      ? 'bg-slate-200 text-slate-950'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Inbox List */}
            <div className="flex-1 overflow-y-auto clean-scroll p-3 space-y-2">
              {filteredDumps.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs">
                  <span>ورودی خالی است.</span>
                </div>
              ) : (
                filteredDumps.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all group"
                    >
                      <p className="text-xs text-slate-200 font-medium leading-relaxed mb-2.5">
                        {item.text}
                      </p>

                      <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-800/60">
                        {/* Mode Tag Dots */}
                        <div className="flex items-center gap-1">
                          {['deep', 'sync', 'quick'].map((m) => (
                            <button
                              key={m}
                              onClick={() => handleSetDumpMode(item.id, m)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all ${
                                item.mode === m
                                  ? MODE_META[m].badge
                                  : 'bg-slate-950/60 text-slate-500 border-slate-800 hover:text-slate-300'
                              }`}
                            >
                              {MODE_META[m].label}
                            </button>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {item.mode === 'quick' ? (
                            <button
                              onClick={() => handleCompleteQuickDump(item.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold text-[10px] transition-all flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>تیک</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => promoteToSticky(item)}
                              title="انتقال به استیکی‌نوت"
                              className="px-2 py-1 rounded-lg bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold text-[10px] transition-all flex items-center gap-1"
                            >
                              <span>میز امروز</span>
                              <ArrowUpLeft className="w-3 h-3" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteDump(item.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
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
          </aside>
        )}
      </div>

      {/* --- MOBILE WORKSPACE VIEW (< md) --- */}
      <div className="relative z-10 flex-1 flex md:hidden flex-col overflow-hidden">
        {/* TAB 1: FOCUS / STICKY NOTE */}
        {activeMobileTab === 'focus' && (
          <div className="flex-1 overflow-y-auto clean-scroll px-3.5 pt-3 pb-24 flex flex-col items-center">
            {renderOmnibox(true)}
            {renderStickyNote(true)}

            {/* Quick Pick helper from Brain Dump if slots are open */}
            {dumps.length > 0 && (!sticky.deep || !sticky.sync1 || !sticky.sync2) && (
              <div className="w-full mt-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Inbox className="w-3.5 h-3.5 text-amber-400" />
                    انتخاب سریع از ورودی لال ({dumps.length})
                  </span>
                  <button
                    onClick={() => {
                      setActiveMobileTab('inbox');
                      triggerHaptic(8);
                    }}
                    className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>مشاهده همه</span>
                    <ArrowUpLeft className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto clean-scroll">
                  {dumps.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between gap-2"
                    >
                      <span className="text-xs text-slate-200 truncate flex-1 leading-snug">
                        {item.text}
                      </span>
                      <button
                        onClick={() => promoteToSticky(item)}
                        className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 text-[10px] font-bold shrink-0 flex items-center gap-1 active:scale-95"
                      >
                        <Plus className="w-3 h-3" />
                        <span>میز امروز</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Footer note */}
            <div className="mt-4 text-[11px] text-slate-500 flex items-center gap-3">
              <span>فقط ۳ کار در روز</span>
              <span>•</span>
              <span>تخلیه بدون استرس</span>
            </div>
          </div>
        )}

        {/* TAB 2: INBOX (Brain Dump List) */}
        {activeMobileTab === 'inbox' && (
          <div className="flex-1 flex flex-col overflow-hidden px-3.5 pt-3 pb-24">
            {renderOmnibox(true)}

            {/* Filter Pills */}
            <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto clean-scroll shrink-0">
              {[
                { key: 'all', label: 'همه' },
                { key: 'untagged', label: 'بی‌برچسب' },
                { key: 'deep', label: '🔴 عمیق' },
                { key: 'sync', label: '🟡 تعاملی' },
                { key: 'quick', label: '🟢 سرپایی' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setFilterMode(tab.key);
                    triggerHaptic(8);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                    filterMode === tab.key
                      ? 'bg-slate-200 text-slate-950 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dump List */}
            <div className="flex-1 overflow-y-auto clean-scroll space-y-2.5 pb-4">
              {filteredDumps.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-xs">
                  <Inbox className="w-8 h-8 text-slate-700 mb-2" />
                  <span>ورودی خالی است؛ ذهن خود را خالی کنید!</span>
                </div>
              ) : (
                filteredDumps.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-sm"
                  >
                    <p className="text-xs text-slate-100 font-medium leading-relaxed mb-3 select-text">
                      {item.text}
                    </p>

                    <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-800/60">
                      {/* Mode Tag Buttons */}
                      <div className="flex items-center gap-1">
                        {['deep', 'sync', 'quick'].map((m) => (
                          <button
                            key={m}
                            onClick={() => handleSetDumpMode(item.id, m)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all active:scale-90 ${
                              item.mode === m
                                ? MODE_META[m].badge
                                : 'bg-slate-950/60 text-slate-500 border-slate-800'
                            }`}
                          >
                            {MODE_META[m].label}
                          </button>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        {item.mode === 'quick' ? (
                          <button
                            onClick={() => handleCompleteQuickDump(item.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-[11px] flex items-center gap-1 active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تیک</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => promoteToSticky(item)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-400/20 text-amber-300 font-bold text-[11px] flex items-center gap-1 active:scale-95"
                          >
                            <span>میز امروز</span>
                            <ArrowUpLeft className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteDump(item.id)}
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-400 active:scale-90"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: THEMES & REMINDERS */}
        {activeMobileTab === 'themes' && (
          <div className="flex-1 overflow-y-auto clean-scroll px-3.5 pt-3 pb-24 space-y-4">
            {/* Weekly Themes Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">تم روزهای هفته</h3>
              </div>

              <div className="space-y-2">
                {themes.map((item) => {
                  const isToday = item.jsDay === todayJsDay;
                  const isEditing = editingDayId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isToday
                          ? 'bg-amber-400/10 border-amber-400/40'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-slate-300 w-14">
                          {item.dayName}
                        </span>
                        {isToday && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                            امروز
                          </span>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="flex-1 flex gap-1.5">
                          <input
                            type="text"
                            value={editingThemeText}
                            onChange={(e) => setEditingThemeText(e.target.value)}
                            autoFocus
                            className="flex-1 bg-slate-900 border border-amber-400/50 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              setThemes(
                                themes.map((t) =>
                                  t.id === item.id
                                    ? { ...t, theme: editingThemeText.trim() || t.theme }
                                    : t
                                )
                              );
                              setEditingDayId(null);
                              triggerHaptic(10);
                            }}
                            className="px-2.5 py-1 bg-amber-400 text-slate-950 rounded-lg text-xs font-bold"
                          >
                            ثبت
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingDayId(item.id);
                            setEditingThemeText(item.theme);
                          }}
                          className="flex-1 flex items-center justify-between cursor-pointer"
                        >
                          <span className="text-xs text-slate-200 font-medium truncate">
                            {item.theme}
                          </span>
                          <Edit3 className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mindset Reminders Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">یادآورهای تغییر حالت ذهن</h3>
              </div>

              {notifPermission !== 'granted' && (
                <button
                  onClick={requestNotifPermission}
                  className="w-full mb-3 py-2 px-3 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold active:scale-95"
                >
                  فعال‌سازی نوتیفیکیشن موبایل
                </button>
              )}

              <div className="space-y-2 mb-3">
                {reminders.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{r.title}</div>
                      <div className="text-[11px] font-mono text-amber-400 mt-0.5">{r.time}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={r.active}
                      onChange={() => {
                        setReminders(
                          reminders.map((item) =>
                            item.id === r.id ? { ...item, active: !item.active } : item
                          )
                        );
                        triggerHaptic(10);
                      }}
                      className="w-5 h-5 accent-amber-400 rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newReminderTitle.trim()) return;
                  setReminders([
                    ...reminders,
                    {
                      id: 'r-' + Date.now(),
                      title: newReminderTitle.trim(),
                      time: newReminderTime,
                      active: true,
                    },
                  ]);
                  setNewReminderTitle('');
                  sfx.playPop();
                  triggerHaptic(15);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newReminderTitle}
                  onChange={(e) => setNewReminderTitle(e.target.value)}
                  placeholder="عنوان یادآور..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <input
                  type="time"
                  value={newReminderTime}
                  onChange={(e) => setNewReminderTime(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-amber-300 font-mono focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl active:scale-95"
                >
                  افزودن
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS & CLOUD SYNC */}
        {activeMobileTab === 'settings' && (
          <div className="flex-1 overflow-y-auto clean-scroll px-3.5 pt-3 pb-24 space-y-4">
            {/* PWA Status & Install Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">نسخه اپلیکیشن (PWA)</h3>
              </div>

              {isStandalone ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-emerald-300 block">
                      اپلیکیشن به صورت تمام‌صفحه نصب است
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      دسترسی آفلاین و بدون تاخیر فعال است.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    نقطه صفر را به عنوان اپلیکیشن مستقل روی گوشی نصب کنید تا بدون نوار مرورگر و به شکل تمام‌صفحه کار کند.
                  </p>
                  <button
                    onClick={handleInstallPWA}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 active:scale-95"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>نصب نقطه صفر روی موبایل</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cloud Sync Supabase Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">سینک ابری (Supabase)</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    syncStatus === 'synced'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : syncStatus === 'syncing'
                      ? 'bg-amber-500/20 text-amber-300'
                      : syncStatus === 'error'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {syncStatus === 'synced'
                    ? 'سینک شده'
                    : syncStatus === 'syncing'
                    ? 'در حال سینک'
                    : syncStatus === 'error'
                    ? 'خطا'
                    : 'آفلاین'}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={cloudConfig.supabaseUrl}
                  onChange={(e) =>
                    setCloudConfig({ ...cloudConfig, supabaseUrl: e.target.value })
                  }
                  placeholder="https://xxxx.supabase.co"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Supabase Anon Public Key
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={cloudConfig.supabaseAnonKey}
                  onChange={(e) =>
                    setCloudConfig({ ...cloudConfig, supabaseAnonKey: e.target.value })
                  }
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                  <Key className="w-3 h-3 text-amber-400" />
                  <span>کلید فضای کاری (Workspace Secret)</span>
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={cloudConfig.workspaceKey}
                  onChange={(e) =>
                    setCloudConfig({ ...cloudConfig, workspaceKey: e.target.value })
                  }
                  placeholder="vahid-personal-focus-2026"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400/50 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none"
                />
              </div>

              {syncErrorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{syncErrorMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    pushToSupabase(false);
                    triggerHaptic(15);
                  }}
                  disabled={!isCloudConfigured}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>ارسال به ابر (Push)</span>
                </button>
                <button
                  onClick={() => {
                    pullFromSupabase(false);
                    triggerHaptic(15);
                  }}
                  disabled={!isCloudConfigured}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>دریافت از ابر (Pull)</span>
                </button>
              </div>
            </div>

            {/* Offline JSON Backup Card */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <span className="text-xs font-bold text-slate-300 block mb-2">
                پشتیبان‌گیری آفلاین (فایل JSON)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJSON}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>دانلود بکاپ</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>بازیابی بکاپ</span>
                </button>
              </div>
            </div>

            {/* Tactile & Sound Test */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 block">لرزش و فیدبک لمسی</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  تست بازخورد Haptic روی دستگاه
                </span>
              </div>
              <button
                onClick={() => {
                  triggerHaptic([30, 40, 50]);
                  sfx.playPop();
                  showToast('فیدبک لمسی', 'لرزش Haptic با موفقیت تست شد.');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 text-amber-400 font-bold text-xs active:scale-95"
              >
                تست لمسی
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION BAR (< md, Safe Area Aware) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 pb-safe transition-all shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-4 h-16 px-1">
          {/* Tab 1: میز امروز */}
          <button
            onClick={() => {
              setActiveMobileTab('focus');
              triggerHaptic(8);
            }}
            className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
              activeMobileTab === 'focus'
                ? 'text-amber-400 font-extrabold'
                : 'text-slate-400 font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                activeMobileTab === 'focus' ? 'bg-amber-400/15 scale-110' : ''
              }`}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-none">میز امروز</span>
            {totalStickyCount > 0 && (
              <span className="absolute top-1 right-1/4 px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-slate-950 font-bold">
                {completedStickyCount}/{totalStickyCount}
              </span>
            )}
          </button>

          {/* Tab 2: ورودی لال */}
          <button
            onClick={() => {
              setActiveMobileTab('inbox');
              triggerHaptic(8);
            }}
            className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
              activeMobileTab === 'inbox'
                ? 'text-amber-400 font-extrabold'
                : 'text-slate-400 font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                activeMobileTab === 'inbox' ? 'bg-amber-400/15 scale-110' : ''
              }`}
            >
              <Inbox className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-none">ورودی لال</span>
            {dumps.length > 0 && (
              <span className="absolute top-1 right-1/4 px-1.5 py-0.2 rounded-full text-[9px] bg-slate-800 border border-slate-700 text-amber-300 font-bold">
                {dumps.length}
              </span>
            )}
          </button>

          {/* Tab 3: تم و زمان */}
          <button
            onClick={() => {
              setActiveMobileTab('themes');
              triggerHaptic(8);
            }}
            className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
              activeMobileTab === 'themes'
                ? 'text-amber-400 font-extrabold'
                : 'text-slate-400 font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                activeMobileTab === 'themes' ? 'bg-amber-400/15 scale-110' : ''
              }`}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-none">تم و یادآور</span>
          </button>

          {/* Tab 4: سینک و تنظیمات */}
          <button
            onClick={() => {
              setActiveMobileTab('settings');
              triggerHaptic(8);
            }}
            className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
              activeMobileTab === 'settings'
                ? 'text-amber-400 font-extrabold'
                : 'text-slate-400 font-medium'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                activeMobileTab === 'settings' ? 'bg-amber-400/15 scale-110' : ''
              }`}
            >
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-none">سینک و ابزار</span>
            <span
              className={`w-2 h-2 rounded-full absolute top-2 right-1/4 ${
                syncStatus === 'synced'
                  ? 'bg-emerald-400'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-slate-600'
              }`}
            />
          </button>
        </div>
      </nav>

      {/* --- MODAL: PWA INSTALL GUIDE (Mobile & Desktop) --- */}
      {installModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 shadow-2xl max-h-[90dvh] overflow-y-auto clean-scroll animate-in fade-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">نصب نسخه اپلیکیشن (PWA)</h3>
              </div>
              <button
                onClick={() => setInstallModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {deferredPrompt ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  می‌توانید اپلیکیشن را به صورت مستقیم و بدون نیاز به نصب از استور روی گوشی یا سیستم خود نصب کنید.
                </p>
                <button
                  onClick={() => {
                    setInstallModalOpen(false);
                    handleInstallPWA();
                  }}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>تایید و نصب اپلیکیشن</span>
                </button>
              </div>
            ) : isIOS ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  برای نصب نقطه صفر در آیفون / آیپد (سافاری)، مراحل زیر را انجام دهید:
                </p>
                <div className="space-y-2.5 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      ۱
                    </span>
                    <span className="text-slate-200">
                      در نوار پایین سافاری، دکمه <Share2 className="w-3.5 h-3.5 inline mx-1 text-amber-400" /> (Share) را لمس کنید.
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      ۲
                    </span>
                    <span className="text-slate-200">
                      گزینه <b>«Add to Home Screen»</b> (افزودن به صفحه اصلی) را انتخاب کنید.
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      ۳
                    </span>
                    <span className="text-slate-200">
                      در گوشه بالا دکمه <b>Add</b> را بزنید تا برنامه مانند یک اپلیکیشن بومی فعال شود.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  در منوی مرورگر خود (علامت ۳ نقطه در بالا یا پایین صفحه)، گزینه:
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-amber-300 font-bold text-center">
                  «Install App» یا «Add to Home screen»
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  را انتخاب کنید تا نقطه صفر روی دستگاه شما نصب شود و به صورت آفلاین اجرا گردد.
                </p>
              </div>
            )}

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInstallModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold active:scale-95"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DESKTOP MODAL 1: Cloud Sync (Supabase) & Backup --- */}
      {cloudModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl max-h-[90vh] overflow-y-auto clean-scroll">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  اتصال ابری (Supabase) و پشتیبان‌گیری
                </h3>
              </div>
              <button
                onClick={() => setCloudModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cloud Form */}
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={cloudConfig.supabaseUrl}
                  onChange={(e) =>
                    setCloudConfig({ ...cloudConfig, supabaseUrl: e.target.value })
                  }
                  placeholder="https://xxxx.supabase.co"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Supabase Anon Public Key
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={cloudConfig.supabaseAnonKey}
                  onChange={(e) =>
                    setCloudConfig({ ...cloudConfig, supabaseAnonKey: e.target.value })
                  }
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                  <Key className="w-3 h-3 text-amber-400" />
                  <span>کلید اختصاصی فضای کاری (Workspace Secret Key)</span>
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={cloudConfig.workspaceKey}
                  onChange={(e) =>
                    setCloudConfig({ ...cloudConfig, workspaceKey: e.target.value })
                  }
                  placeholder="مثلاً: vahid-personal-focus-2026"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400/50 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  این کلید مثل رمز عبور دیتای شماست؛ در هر دستگاهی همین کلید را وارد کنید، اطلاعاتتان سینک می‌شود.
                </p>
              </div>

              {syncErrorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{syncErrorMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => pushToSupabase(false)}
                  disabled={!isCloudConfigured}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>ارسال به ابر (Push)</span>
                </button>
                <button
                  onClick={() => pullFromSupabase(false)}
                  disabled={!isCloudConfigured}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>دریافت از ابر (Pull)</span>
                </button>
              </div>
            </div>

            {/* SQL Setup Helper */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  کد ساخت جدول در Supabase (یک‌بار اجرا کنید)
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SQL_SNIPPET);
                    setSqlCopied(true);
                    setTimeout(() => setSqlCopied(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{sqlCopied ? 'کپی شد!' : 'کپی SQL'}</span>
                </button>
              </div>
              <pre
                dir="ltr"
                className="text-[10px] text-slate-400 overflow-x-auto clean-scroll font-mono leading-relaxed max-h-28"
              >
                {SUPABASE_SQL_SNIPPET}
              </pre>
            </div>

            {/* Local JSON Backup */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400">پشتیبان‌گیری آفلاین (فایل JSON):</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJSON}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>خروجی</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>بازیابی</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DESKTOP MODAL 2: Weekly Theme Days --- */}
      {themeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">تم روزهای هفته</h3>
              </div>
              <button
                onClick={() => setThemeModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto clean-scroll">
              {themes.map((item) => {
                const isToday = item.jsDay === todayJsDay;
                const isEditing = editingDayId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      isToday
                        ? 'bg-amber-400/10 border-amber-400/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-300 w-16 shrink-0">
                      {item.dayName}
                    </span>

                    {isEditing ? (
                      <div className="flex-1 flex gap-1.5">
                        <input
                          type="text"
                          value={editingThemeText}
                          onChange={(e) => setEditingThemeText(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setThemes(
                                themes.map((t) =>
                                  t.id === item.id
                                    ? { ...t, theme: editingThemeText.trim() || t.theme }
                                    : t
                                )
                              );
                              setEditingDayId(null);
                            }
                          }}
                          className="flex-1 bg-slate-900 border border-amber-400/50 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            setThemes(
                              themes.map((t) =>
                                t.id === item.id
                                  ? { ...t, theme: editingThemeText.trim() || t.theme }
                                  : t
                              )
                            );
                            setEditingDayId(null);
                          }}
                          className="px-2.5 py-1 bg-amber-400 text-slate-950 rounded-lg text-xs font-bold"
                        >
                          ثبت
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingDayId(item.id);
                          setEditingThemeText(item.theme);
                        }}
                        className="flex-1 flex items-center justify-between cursor-pointer group"
                      >
                        <span className="text-xs text-slate-200 font-medium">{item.theme}</span>
                        <Edit3 className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- DESKTOP MODAL 3: Reminders --- */}
      {reminderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">یادآورهای تغییر حالت</h3>
              </div>
              <button
                onClick={() => setReminderModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {notifPermission !== 'granted' && (
              <button
                onClick={requestNotifPermission}
                className="w-full mb-3 py-2 px-3 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold hover:bg-amber-400 hover:text-slate-950 transition-all"
              >
                فعال‌سازی نوتیفیکیشن مرورگر
              </button>
            )}

            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto clean-scroll">
              {reminders.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200">{r.title}</div>
                    <div className="text-[11px] font-mono text-amber-400 mt-0.5">{r.time}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={r.active}
                    onChange={() =>
                      setReminders(
                        reminders.map((item) =>
                          item.id === r.id ? { ...item, active: !item.active } : item
                        )
                      )
                    }
                    className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newReminderTitle.trim()) return;
                setReminders([
                  ...reminders,
                  {
                    id: 'r-' + Date.now(),
                    title: newReminderTitle.trim(),
                    time: newReminderTime,
                    active: true,
                  },
                ]);
                setNewReminderTitle('');
                sfx.playPop();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={newReminderTitle}
                onChange={(e) => setNewReminderTitle(e.target.value)}
                placeholder="عنوان یادآور..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
              <input
                type="time"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-mono focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                افزودن
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}