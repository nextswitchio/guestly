"use client";
import { Banknote, Clock, Lightbulb, PartyPopper, RefreshCw, Target } from 'lucide-react';
import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import SavingsProgressBar from "@/components/wallet/SavingsProgressBar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

const increments = [10, 25, 50, 100];

type SavingsTarget = {
  id: string;
  userId: string;
  eventId?: string;
  goalAmount: number;
  currentAmount: number;
  targetDate?: string;
  recurringAmount?: number;
  recurringFrequency?: 'weekly' | 'biweekly' | 'monthly';
  nextContribution?: number;
  createdAt: number;
  updatedAt: number;
};

type Reminder = {
  id: string;
  userId: string;
  savingsTargetId: string;
  type: 'milestone' | 'deadline' | 'suggestion';
  message: string;
  scheduledDate: number;
  sent: boolean;
  createdAt: number;
};

type Suggestion = {
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  message: string;
  goalReached: boolean;
};

export default function WalletSavings() {
  const [targets, setTargets] = React.useState<SavingsTarget[]>([]);
  const [reminders, setReminders] = React.useState<Reminder[]>([]);
  const [suggestion, setSuggestion] = React.useState<Suggestion | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [adding, setAdding] = React.useState(false);
  const [selectedIncrement, setSelectedIncrement] = React.useState(25);
  const [selectedTarget, setSelectedTarget] = React.useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showRecurringModal, setShowRecurringModal] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [settingUpRecurring, setSettingUpRecurring] = React.useState(false);
  const [cancellingRecurring, setCancellingRecurring] = React.useState(false);
  
  // New target form state
  const [newGoalAmount, setNewGoalAmount] = React.useState("");
  const [newTargetDate, setNewTargetDate] = React.useState("");
  
  // Recurring contribution form state
  const [recurringAmount, setRecurringAmount] = React.useState("");
  const [recurringFrequency, setRecurringFrequency] = React.useState<'weekly' | 'biweekly' | 'monthly'>('weekly');

  React.useEffect(() => {
    loadTargets();
    loadReminders();
  }, []);
  
  React.useEffect(() => {
    if (selectedTarget) {
      loadSuggestion(selectedTarget);
      generateReminders(selectedTarget);
    }
  }, [selectedTarget]);

  async function loadTargets() {
    try {
      const res = await fetch("/api/wallet/savings");
      const data = await res.json();
      if (data.success) {
        setTargets(data.data || []);
        // Auto-select first target if none selected
        if (data.data?.length > 0 && !selectedTarget) {
          setSelectedTarget(data.data[0].id);
        }
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }
  
  async function loadReminders() {
    try {
      const res = await fetch("/api/wallet/savings/reminders");
      const data = await res.json();
      if (data.success) {
        setReminders(data.data || []);
      }
    } catch {
      /* ignore */
    }
  }
  
  async function loadSuggestion(targetId: string) {
    try {
      const res = await fetch(`/api/wallet/savings/suggestions?targetId=${targetId}`);
      const data = await res.json();
      if (data.success) {
        setSuggestion(data.data);
      }
    } catch {
      /* ignore */
    }
  }
  
  async function generateReminders(targetId: string) {
    try {
      await fetch("/api/wallet/savings/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savingsTargetId: targetId }),
      });
      // Reload reminders after generating
      await loadReminders();
    } catch {
      /* ignore */
    }
  }
  
  async function dismissReminder(reminderId: string) {
    try {
      await fetch("/api/wallet/savings/reminders/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminderId }),
      });
      // Reload reminders after dismissing
      await loadReminders();
    } catch {
      /* ignore */
    }
  }

  async function createTarget() {
    if (creating || !newGoalAmount) return;
    setCreating(true);
    try {
      const res = await fetch("/api/wallet/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalAmount: parseFloat(newGoalAmount),
          targetDate: newTargetDate || undefined,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          await loadTargets();
          setShowCreateModal(false);
          setNewGoalAmount("");
          setNewTargetDate("");
          setSelectedTarget(data.data.id);
        }
      }
    } catch {
      /* ignore */
    } finally {
      setCreating(false);
    }
  }

  async function addSavings() {
    if (adding || !selectedTarget) return;
    setAdding(true);
    try {
      const res = await fetch("/api/wallet/savings/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          targetId: selectedTarget, 
          amount: selectedIncrement 
        }),
      });
      
      if (res.ok) {
        await loadTargets();
        await loadReminders();
        if (selectedTarget) {
          await loadSuggestion(selectedTarget);
          await generateReminders(selectedTarget);
        }
      }
    } catch {
      /* ignore */
    } finally {
      setAdding(false);
    }
  }
  
  async function setupRecurring() {
    if (settingUpRecurring || !selectedTarget || !recurringAmount) return;
    setSettingUpRecurring(true);
    try {
      const res = await fetch("/api/wallet/savings/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          targetId: selectedTarget, 
          amount: parseFloat(recurringAmount),
          recurring: true,
          frequency: recurringFrequency
        }),
      });
      
      if (res.ok) {
        await loadTargets();
        setShowRecurringModal(false);
        setRecurringAmount("");
      }
    } catch {
      /* ignore */
    } finally {
      setSettingUpRecurring(false);
    }
  }
  
  async function cancelRecurring() {
    if (cancellingRecurring || !selectedTarget) return;
    if (!confirm("Are you sure you want to cancel recurring contributions for this goal?")) return;
    
    setCancellingRecurring(true);
    try {
      const res = await fetch(`/api/wallet/savings/contribute?targetId=${selectedTarget}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        await loadTargets();
      }
    } catch {
      /* ignore */
    } finally {
      setCancellingRecurring(false);
    }
  }

  async function deleteTarget(targetId: string) {
    if (!confirm("Are you sure you want to delete this savings target?")) return;
    
    try {
      const res = await fetch(`/api/wallet/savings?targetId=${targetId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        await loadTargets();
        if (selectedTarget === targetId) {
          setSelectedTarget(targets[0]?.id || null);
        }
      }
    } catch {
      /* ignore */
    }
  }

  const currentTarget = targets.find(t => t.id === selectedTarget);
  const goalReached = currentTarget && currentTarget.goalAmount > 0 && currentTarget.currentAmount >= currentTarget.goalAmount;
  const hasRecurring = currentTarget?.recurringAmount && currentTarget?.recurringFrequency;

  return (
    <ProtectedRoute allowRoles={["attendee"]}>
      <div>
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-neutral-400">
          <Link href="/wallet" className="hover:text-neutral-600">Wallet</Link>
          <span>/</span>
          <span className="text-neutral-600">Event Savings</span>
        </nav>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Event Savings</h1>
            <p className="mt-1 text-sm text-neutral-500">Set goals and save up for your next event experiences</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} size="md">+ New Goal</Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-neutral-900">Your Savings Goals</h2>
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-100" />
              ))
            ) : targets.length === 0 ? (
              <div className="rounded-2xl border border-neutral-100 bg-white p-6 text-center shadow-sm">
                <span className="text-3xl"><Target className="h-4 w-4 inline-block" /></span>
                <p className="mt-2 text-sm font-medium text-neutral-900">No savings goals yet</p>
                <p className="mt-1 text-xs text-neutral-400">Create your first goal to start saving</p>
                <Button onClick={() => setShowCreateModal(true)} size="sm" className="mt-4">Create Goal</Button>
              </div>
            ) : (
              targets.map((target) => {
                const progress = target.goalAmount > 0 ? (target.currentAmount / target.goalAmount) * 100 : 0;
                const isSelected = selectedTarget === target.id;
                return (
                  <div key={target.id} onClick={() => setSelectedTarget(target.id)}
                    className={`rounded-2xl border-2 bg-white p-4 text-left shadow-sm transition cursor-pointer ${isSelected ? "border-primary-600 shadow-md" : "border-neutral-100 hover:border-neutral-200"}`}>
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{target.eventId ? "Event Savings" : "General Savings"}</p>
                        {target.targetDate && <p className="mt-0.5 text-xs text-neutral-400">Target: {new Date(target.targetDate).toLocaleDateString()}</p>}
                        {target.recurringAmount && target.recurringFrequency && <p className="mt-0.5 text-xs text-emerald-600 font-medium">RefreshCw ${target.recurringAmount} {target.recurringFrequency}</p>}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); deleteTarget(target.id); }} className="text-neutral-400 hover:text-rose-500">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-bold text-neutral-900">${target.currentAmount.toFixed(2)}</span>
                        <span className="text-xs text-neutral-400">of ${target.goalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                    <p className="mt-2 text-xs font-medium text-neutral-500">{progress >= 100 ? 'Goal reached!' : `${progress.toFixed(0)}% complete`}</p>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            {currentTarget ? (
              <>
                <SavingsProgressBar goal={currentTarget.goalAmount} progress={currentTarget.currentAmount} />

                {reminders.filter(r => r.savingsTargetId === currentTarget.id && !r.sent).length > 0 && (
                  <div className="space-y-3">
                    {reminders.filter(r => r.savingsTargetId === currentTarget.id && !r.sent).map((reminder) => {
                      const iconMap = { milestone: '<PartyPopper className="h-4 w-4 inline-block" />', deadline: '⏰', suggestion: '💡' };
                      const styleMap = {
                        milestone: { container: 'border-emerald-100 bg-emerald-50/50', title: 'text-emerald-900', message: 'text-emerald-700', button: 'text-emerald-400 hover:text-emerald-600' },
                        deadline: { container: 'border-amber-100 bg-amber-50/50', title: 'text-amber-900', message: 'text-amber-700', button: 'text-amber-400 hover:text-amber-600' },
                        suggestion: { container: 'border-primary-100 bg-primary-50/50', title: 'text-primary-900', message: 'text-primary-700', button: 'text-primary-400 hover:text-primary-600' },
                      };
                      const styles = styleMap[reminder.type];
                      return (
                        <div key={reminder.id} className={`rounded-2xl border p-4 ${styles.container}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{iconMap[reminder.type]}</span>
                              <div>
                                <p className={`text-sm font-medium capitalize ${styles.title}`}>{reminder.type} Reminder</p>
                                <p className={`mt-1 text-sm ${styles.message}`}>{reminder.message}</p>
                              </div>
                            </div>
                            <button onClick={() => dismissReminder(reminder.id)} className={`transition ${styles.button}`}>
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {suggestion && !suggestion.goalReached && (
                  <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl"><Banknote className="h-4 w-4 inline-block" /></span>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-primary-900">Smart Savings Suggestion</h3>
                        <p className="mt-1 text-sm text-primary-700">{suggestion.message}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Button size="sm" onClick={() => { setSelectedIncrement(Math.ceil(suggestion.amount)); document.querySelector('[data-add-savings]')?.scrollIntoView({ behavior: 'smooth' }); }}>Save ${Math.ceil(suggestion.amount)}</Button>
                          <span className="text-xs text-primary-600">Suggested {suggestion.frequency} contribution</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {hasRecurring && (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-emerald-900">Recurring Contribution Active</h3>
                        <p className="mt-1 text-xs text-emerald-700">${currentTarget.recurringAmount} will be automatically deducted from your wallet {currentTarget.recurringFrequency}</p>
                        {currentTarget.nextContribution && <p className="mt-1 text-xs text-emerald-600">Next contribution: {new Date(currentTarget.nextContribution).toLocaleDateString()}</p>}
                      </div>
                      <Button variant="secondary" size="sm" onClick={cancelRecurring} disabled={cancellingRecurring}>{cancellingRecurring ? "Cancelling..." : "Cancel"}</Button>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm" data-add-savings>
                  <h2 className="mb-4 text-sm font-semibold text-neutral-900">Add to This Goal</h2>
                  <div className="mb-4 grid grid-cols-4 gap-2">
                    {[10, 25, 50, 100].map((inc) => (
                      <button key={inc} type="button" onClick={() => setSelectedIncrement(inc)}
                        className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold tabular-nums transition ${selectedIncrement === inc ? "border-primary-600 bg-primary-50 text-primary-700" : "border-neutral-100 bg-white text-neutral-700 hover:border-neutral-200"}`}>
                        ${inc}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={addSavings} disabled={adding} className="flex-1" size="lg">
                      {adding ? <span className="flex items-center justify-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Saving…</span> : `Save $${selectedIncrement.toFixed(2)}`}
                    </Button>
                    {!hasRecurring && <Button variant="secondary" onClick={() => setShowRecurringModal(true)} size="lg">Set Up Recurring</Button>}
                  </div>
                  {goalReached && <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-center text-xs font-medium text-emerald-700"><PartyPopper className="h-4 w-4 inline-block" /> You&apos;ve reached your goal! Time to grab those tickets.</div>}
                </div>

                <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-5">
                  <h3 className="text-sm font-semibold text-primary-900">Savings Tips</h3>
                  <ul className="mt-2 space-y-2 text-xs leading-relaxed text-primary-700">
                    <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0 text-primary-500">•</span>Set up recurring contributions to save automatically</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0 text-primary-500">•</span>Save a small amount weekly — it adds up fast!</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0 text-primary-500">•</span>Set your goal to match VIP ticket prices for the best experience</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0 text-primary-500">•</span>Funds are deducted from your wallet balance</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-neutral-100 bg-white p-12 text-center shadow-sm">
                <span className="text-4xl"><Banknote className="h-4 w-4 inline-block" /></span>
                <p className="mt-3 text-sm font-medium text-neutral-900">Select a savings goal</p>
                <p className="mt-1 text-xs text-neutral-400">Choose a goal from the list or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Target Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Savings Goal"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Goal Amount ($)"
            type="number"
            min={1}
            step={0.01}
            value={newGoalAmount}
            onChange={(e) => setNewGoalAmount(e.currentTarget.value)}
            placeholder="e.g., 150.00"
            required
          />
          
          <Input
            label="Target Date (Optional)"
            type="date"
            value={newTargetDate}
            onChange={(e) => setNewTargetDate(e.currentTarget.value)}
            hint="Set a deadline to reach your goal"
          />

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={createTarget}
              disabled={creating || !newGoalAmount}
              className="flex-1"
            >
              {creating ? "Creating..." : "Create Goal"}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Set Up Recurring Modal */}
      <Modal
        open={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        title="Set Up Recurring Contribution"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Contribution Amount ($)"
            type="number"
            min={1}
            step={0.01}
            value={recurringAmount}
            onChange={(e) => setRecurringAmount(e.currentTarget.value)}
            placeholder="e.g., 25.00"
            hint="This amount will be automatically deducted from your wallet"
            required
          />
          
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['weekly', 'biweekly', 'monthly'] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setRecurringFrequency(freq)}
                  className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold capitalize transition ${
                    recurringFrequency === freq
                      ? "border-primary-600 bg-primary-50 text-primary-700"
                      : "border-neutral-100 bg-white text-neutral-700 hover:border-neutral-200"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              {recurringFrequency === 'weekly' && 'Contributions will be made every 7 days'}
              {recurringFrequency === 'biweekly' && 'Contributions will be made every 14 days'}
              {recurringFrequency === 'monthly' && 'Contributions will be made every month'}
            </p>
          </div>

          <div className="rounded-xl bg-primary-50 px-4 py-3 text-xs text-primary-700">
            <p className="font-medium">💡 How it works:</p>
            <ul className="mt-2 space-y-1 pl-4">
              <li>• Contributions are automatically deducted from your wallet balance</li>
              <li>• Make sure you have sufficient balance on contribution dates</li>
              <li>• You can cancel recurring contributions anytime</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowRecurringModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={setupRecurring}
              disabled={settingUpRecurring || !recurringAmount}
              className="flex-1"
            >
              {settingUpRecurring ? "Setting Up..." : "Set Up Recurring"}
            </Button>
          </div>
        </div>
      </Modal>
    </ProtectedRoute>
  );
}
