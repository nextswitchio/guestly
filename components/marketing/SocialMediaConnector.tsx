'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

interface SocialAccount {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';
  connected: boolean;
  accountName?: string;
  accountId?: string;
  connectedAt?: number;
}

interface SocialMediaConnectorProps {
  organizerId?: string;
  onConnectionChange?: () => void;
}

const platformConfig = {
  facebook: {
    label: 'Facebook',
    icon: 'facebook' as const,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    description: 'Connect your Facebook page to auto-post events',
  },
  instagram: {
    label: 'Instagram',
    icon: 'instagram' as const,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    description: 'Share events to Instagram feed and stories',
  },
  twitter: {
    label: 'Twitter / X',
    icon: 'twitter' as const,
    color: 'text-sky-500',
    bgColor: 'bg-sky-50 dark:bg-sky-900/20',
    description: 'Tweet events to your followers',
  },
  linkedin: {
    label: 'LinkedIn',
    icon: 'linkedin' as const,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    description: 'Post events to your LinkedIn company page',
  },
  tiktok: {
    label: 'TikTok',
    icon: 'video' as const,
    color: 'text-gray-900 dark:text-white',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    description: 'Share event videos on TikTok',
  },
};

export function SocialMediaConnector({
  organizerId: propOrganizerId,
  onConnectionChange,
}: SocialMediaConnectorProps) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [organizerId, setOrganizerId] = useState<string>(propOrganizerId || '');

  useEffect(() => {
    // If organizerId not provided as prop, fetch from auth
    if (!propOrganizerId) {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.userId) {
            setOrganizerId(data.userId);
          }
        })
        .catch((error) => console.error('Failed to get user:', error));
    }
  }, [propOrganizerId]);

  useEffect(() => {
    if (organizerId) {
      loadConnectedAccounts();
    }
  }, [organizerId]);

  const loadConnectedAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/social/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Failed to load social accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: keyof typeof platformConfig) => {
    try {
      setConnecting(platform);
      
      // In a real implementation, this would open OAuth flow
      // For now, we'll simulate the connection
      const response = await fetch('/api/social/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizerId,
          platform,
          // Mock credentials - in real app, these come from OAuth
          credentials: {
            accessToken: `mock_token_${platform}_${Date.now()}`,
            accountId: `${platform}_account_${organizerId}`,
            accountName: `My ${platformConfig[platform].label} Account`,
          },
        }),
      });

      if (response.ok) {
        await loadConnectedAccounts();
        onConnectionChange?.();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to connect account');
      }
    } catch (error) {
      console.error('Failed to connect account:', error);
      alert('Failed to connect account');
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platform: keyof typeof platformConfig) => {
    if (!confirm(`Disconnect ${platformConfig[platform].label}?`)) return;

    try {
      setConnecting(platform);
      
      // In real implementation, this would revoke OAuth tokens
      const response = await fetch('/api/social/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizerId, platform }),
      });

      if (response.ok) {
        await loadConnectedAccounts();
        onConnectionChange?.();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to disconnect account');
      }
    } catch (error) {
      console.error('Failed to disconnect account:', error);
      alert('Failed to disconnect account');
    } finally {
      setConnecting(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Icon name="spinner" className="w-8 h-8 mx-auto animate-spin text-primary-500" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading social accounts...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Social Media Accounts</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Connect your social media accounts to auto-post events
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadConnectedAccounts}>
          <Icon name="refresh-cw" className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(platformConfig) as Array<keyof typeof platformConfig>).map((platform) => {
          const config = platformConfig[platform];
          const account = accounts.find((a) => a.platform === platform);
          const isConnected = account?.connected || false;
          const isProcessing = connecting === platform;

          return (
            <Card key={platform} className="p-4">
              <div className="flex items-start gap-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${config.bgColor}`}>
                  <Icon name={config.icon} className={`w-6 h-6 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{config.label}</h4>
                    {isConnected && (
                      <span className="flex items-center gap-1 text-xs text-success-600 dark:text-success-400">
                        <Icon name="check-circle" className="w-4 h-4" />
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {config.description}
                  </p>
                  
                  {isConnected && account?.accountName && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                      <Icon name="user" className="w-3 h-3 inline mr-1" />
                      {account.accountName}
                    </p>
                  )}

                  {isConnected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(platform)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Icon name="spinner" className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Icon name="x" className="w-4 h-4 mr-2" />
                      )}
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(platform)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Icon name="spinner" className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Icon name="link" className="w-4 h-4 mr-2" />
                      )}
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {accounts.filter((a) => a.connected).length === 0 && (
        <Card className="p-6 text-center bg-gray-50 dark:bg-gray-800/50">
          <Icon name="alert-circle" className="w-16 h-16 mx-auto text-warning-500 mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            No social accounts connected yet. Connect accounts to enable auto-posting.
          </p>
        </Card>
      )}
    </div>
  );
}
