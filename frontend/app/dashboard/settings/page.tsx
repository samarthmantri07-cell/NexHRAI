"use client";

import { PageHeader } from '@/components/ui/custom/page-header';
import { GlassCard } from '@/components/ui/custom/glass-card';
import { Button } from '@/components/ui/button';
import { Settings2, Bell, Shield, Key } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6 max-w-4xl'>
      <PageHeader title='Platform Settings' description='Manage your organization preferences and security configurations.' />
      
      <div className="grid gap-6">
        <GlassCard delay={0.1} className="p-8">
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
              <input type="text" defaultValue="Acme Corp HR" className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <Button>Save Changes</Button>
          </div>
        </GlassCard>

        <GlassCard delay={0.2} className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Bell className="w-6 h-6" /></div>
            <div>
              <h3 className="text-xl font-semibold text-white">Notifications & Alerts</h3>
              <p className="text-muted-foreground">Configure when and how you receive attrition risk alerts.</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-white">
              <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 w-5 h-5 accent-primary" />
              Email alerts for High-Risk employee flags
            </label>
            <label className="flex items-center gap-3 text-white">
              <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5 w-5 h-5 accent-primary" />
              Weekly summary report digest
            </label>
            <Button variant="secondary">Update Preferences</Button>
          </div>
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
            <Button variant="outline" className="border-white/20 hover:bg-white/5"><Key className="w-4 h-4 mr-2" /> Generate API Key</Button>
            <Button variant="destructive" className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border-transparent hover:border-transparent">Revoke All Sessions</Button>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
