'use client';

import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

interface SocialMediaPreviewProps {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok';
  content: string;
  imageUrl?: string;
  accountName?: string;
  accountAvatar?: string;
}

export default function SocialMediaPreview({
  platform,
  content,
  imageUrl,
  accountName = 'Your Account',
  accountAvatar,
}: SocialMediaPreviewProps) {
  const renderPreview = () => {
    switch (platform) {
      case 'facebook':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Facebook Header */}
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                {accountAvatar ? (
                  <img src={accountAvatar} alt={accountName} className="w-full h-full rounded-full" />
                ) : (
                  accountName[0]
                )}
              </div>
              <div>
                <div className="font-semibold text-sm">{accountName}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  Just now · <Icon name="globe" className="w-3 h-3" />
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="px-4 pb-3">
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            </div>
            {/* Image */}
            {imageUrl && (
              <img src={imageUrl} alt="Post" className="w-full" />
            )}
            {/* Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-2 flex justify-around">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm">
                <Icon name="thumbs-up" className="w-4 h-4" />
                Like
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm">
                <Icon name="message-circle" className="w-4 h-4" />
                Comment
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm">
                <Icon name="share-2" className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        );

      case 'twitter':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {accountAvatar ? (
                  <img src={accountAvatar} alt={accountName} className="w-full h-full rounded-full" />
                ) : (
                  accountName[0]
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{accountName}</span>
                  <span className="text-gray-500 text-sm">@{accountName.toLowerCase().replace(/\s/g, '')}</span>
                  <span className="text-gray-500 text-sm">· now</span>
                </div>
                <p className="text-sm whitespace-pre-wrap mb-3">{content}</p>
                {imageUrl && (
                  <img src={imageUrl} alt="Post" className="w-full rounded-2xl border border-gray-200 dark:border-gray-700" />
                )}
                <div className="flex justify-between mt-3 text-gray-500 max-w-md">
                  <button className="flex items-center gap-2 hover:text-blue-500">
                    <Icon name="message-circle" className="w-4 h-4" />
                    <span className="text-xs">0</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-500">
                    <Icon name="repeat" className="w-4 h-4" />
                    <span className="text-xs">0</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-red-500">
                    <Icon name="heart" className="w-4 h-4" />
                    <span className="text-xs">0</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-500">
                    <Icon name="share" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'instagram':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Instagram Header */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-semibold">
                      {accountAvatar ? (
                        <img src={accountAvatar} alt={accountName} className="w-full h-full rounded-full" />
                      ) : (
                        accountName[0]
                      )}
                    </div>
                  </div>
                </div>
                <span className="font-semibold text-sm">{accountName.toLowerCase().replace(/\s/g, '')}</span>
              </div>
              <Icon name="more-horizontal" className="w-5 h-5" />
            </div>
            {/* Image */}
            {imageUrl && (
              <img src={imageUrl} alt="Post" className="w-full aspect-square object-cover" />
            )}
            {/* Actions */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <Icon name="heart" className="w-6 h-6" />
                  <Icon name="message-circle" className="w-6 h-6" />
                  <Icon name="send" className="w-6 h-6" />
                </div>
                <Icon name="bookmark" className="w-6 h-6" />
              </div>
              <div className="text-sm">
                <span className="font-semibold">{accountName.toLowerCase().replace(/\s/g, '')}</span>{' '}
                <span className="whitespace-pre-wrap">{content}</span>
              </div>
            </div>
          </div>
        );

      case 'linkedin':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* LinkedIn Header */}
            <div className="p-4 flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                {accountAvatar ? (
                  <img src={accountAvatar} alt={accountName} className="w-full h-full rounded-full" />
                ) : (
                  accountName[0]
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{accountName}</div>
                <div className="text-xs text-gray-500">Company · Just now</div>
              </div>
            </div>
            {/* Content */}
            <div className="px-4 pb-3">
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            </div>
            {/* Image */}
            {imageUrl && (
              <img src={imageUrl} alt="Post" className="w-full" />
            )}
            {/* Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-2 py-1 flex gap-1">
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm flex-1 justify-center">
                <Icon name="thumbs-up" className="w-4 h-4" />
                Like
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm flex-1 justify-center">
                <Icon name="message-square" className="w-4 h-4" />
                Comment
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm flex-1 justify-center">
                <Icon name="repeat" className="w-4 h-4" />
                Repost
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm flex-1 justify-center">
                <Icon name="send" className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        );

      case 'tiktok':
        return (
          <div className="bg-black text-white rounded-lg shadow-sm overflow-hidden max-w-sm mx-auto">
            {/* TikTok Video Preview */}
            <div className="relative aspect-[9/16] bg-gray-900 flex items-center justify-center">
              {imageUrl ? (
                <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
              ) : (
                <Icon name="video" className="w-16 h-16 text-gray-400" />
              )}
              {/* Overlay UI */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-xs font-semibold">
                        {accountAvatar ? (
                          <img src={accountAvatar} alt={accountName} className="w-full h-full rounded-full" />
                        ) : (
                          accountName[0]
                        )}
                      </div>
                      <span className="font-semibold text-sm">@{accountName.toLowerCase().replace(/\s/g, '')}</span>
                    </div>
                    <p className="text-sm line-clamp-3">{content}</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <button className="flex flex-col items-center">
                      <Icon name="heart" className="w-8 h-8" />
                      <span className="text-xs">0</span>
                    </button>
                    <button className="flex flex-col items-center">
                      <Icon name="message-circle" className="w-8 h-8" />
                      <span className="text-xs">0</span>
                    </button>
                    <button className="flex flex-col items-center">
                      <Icon name="share-2" className="w-8 h-8" />
                      <span className="text-xs">0</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold capitalize">{platform} Preview</h4>
        <span className="text-xs text-gray-500">Preview only</span>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
        {renderPreview()}
      </div>
    </Card>
  );
}
