"use client";

import { useState, useEffect, FormEvent } from 'react';
import { PageHeader } from '@/components/ui/custom/page-header';
import { GlassCard } from '@/components/ui/custom/glass-card';
import { Button } from '@/components/ui/button';
import { Settings2, Bell, Shield, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';

export default function SettingsPage() {
  const { settings, isLoading, updateSettings, isUpdating } = useSettings();
  
  const [workspaceName, setWorkspaceName] = useState("NexHR-AI Workspace");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (settings) {
      setWorkspaceName(settings.workspaceName);
      setEmailAlerts(settings.emailAlertsEnabled);
      setWeeklyDigest(settings.weeklyDigestEnabled);
    }
  }, [settings]);

  const handleSaveGeneral = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({ 
        workspaceName, 
        emailAlertsEnabled: emailAlerts, 
        weeklyDigestEnabled: weeklyDigest 
      });
      setMessage({ text: 'Settings updated successfully', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to update settings', type: 'error' });
    }
    setTimeout(() => setMessage(null), 3000);
  };
  
  const handleGenericAction = (action: string) => {
    setMessage({ text: `${action} successful`, type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6 max-w-4xl relative'>
      <PageHeader title='Platform Settings' description='Manage your organization preferences and security configurations.' />
      
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-0 right-0 px-4 py-2 rounded-md font-medium text-sm ${
              message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6">
        <GlassCard delay={0.1} className="p-8">
          <form onSubmit={handleSaveGeneral}>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 text-primary rounded-xl"><Settings2 className="w-6 h-6" /></div>
              <div>
                <h3 className="text-xl font-semibold text-white">General Configuration</h3>
                <p className="text-muted-foreground">Manage workspace name and global preferences.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white block mb-2">Workspace Name</label>
                <input 
                  type="text" 
                  value={workspaceName} 
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-colors" 
                />
              </div>
              <Button type="submit" disabled={isUpdating}>{isUpdating ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </form>
        </GlassCard>

        <GlassCard delay={0.2} className="p-8">
          <form onSubmit={handleSaveGeneral}>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Bell className="w-6 h-6" /></div>
              <div>
                <h3 className="text-xl font-semibold text-white">Notifications & Alerts</h3>
                <p className="text-muted-foreground">Configure when and how you receive attrition risk alerts.</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-white cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 w-5 h-5 accent-primary" 
                />
                Email alerts for High-Risk employee flags
              </label>
              <label className="flex items-center gap-3 text-white cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 w-5 h-5 accent-primary" 
                />
                Weekly summary report digest
              </label>
              <Button type="submit" variant="secondary" disabled={isUpdating}>{isUpdating ? 'Updating...' : 'Update Preferences'}</Button>
            </div>
          </form>
        </GlassCard>

        <GlassCard delay={0.3} className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><Shield className="w-6 h-6" /></div>
            <div>
              <h3 className="text-xl font-semibold text-white">Security & Access</h3>
              <p className="text-muted-foreground">Manage SSO and API keys.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => handleGenericAction('API Key generated')} variant="outline" className="border-white/20 hover:bg-white/5"><Key className="w-4 h-4 mr-2" /> Generate API Key</Button>
            <Button onClick={() => handleGenericAction('Sessions revoked')} variant="destructive" className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border-transparent hover:border-transparent">Revoke All Sessions</Button>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
