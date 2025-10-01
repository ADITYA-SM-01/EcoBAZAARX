import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import {
  Settings,
  Moon,
  Sun,
  Monitor,
  Bell,
  Shield,
  User,
  ChevronRight,
  ArrowLeft,
  Check
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const { user } = useAuth();
  type NotificationSettings = {
    promotions: boolean;
    orderUpdates: boolean;
    newsletter: boolean;
  };
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    promotions: true,
    orderUpdates: true,
    newsletter: false,
  });

  const handleBack = () => {
    window.history.back();
  };

  const getThemeIcon = (themeName: string) => {
    switch (themeName.toLowerCase()) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      case 'system':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const sections = [
    {
      title: 'Appearance',
      icon: <Monitor className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Theme</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {availableThemes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => setTheme(theme.name)}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  currentTheme.name === theme.name
                    ? 'border-eco-600 bg-eco-50 dark:bg-eco-900'
                    : 'border-gray-200 hover:border-eco-400 dark:border-gray-700'
                } transition-all`}
              >
                <div className="flex items-center space-x-3">
                  {getThemeIcon(theme.name)}
                  <span className="capitalize">{theme.name}</span>
                </div>
                {currentTheme.name === theme.name && (
                  <Check className="w-5 h-5 text-eco-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Notification Preferences</h3>
          <div className="space-y-4">
            {(Object.entries(notifications) as [keyof NotificationSettings, boolean][]).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Receive notifications about {key.toLowerCase()}
                  </span>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enabled ? 'bg-eco-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Privacy',
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Privacy Settings</h3>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Your privacy is important to us. Review your privacy settings to control how your information is used.
            </p>
          </div>
          {/* Add privacy settings here */}
        </div>
      ),
    },
    {
      title: 'Account',
      icon: <User className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Account Information</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Name</label>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Role</label>
                <p className="font-medium capitalize">{user?.role}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 dark:text-gray-400">Member Since</label>
                <p className="font-medium">
                  {new Date(user?.joinDate || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-100 dark:from-gray-900 dark:to-gray-800">
      <Navigation onSearch={() => {}} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-eco-600" />
              Settings
            </h1>
          </div>
        </div>

        <div className="grid gap-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-eco-100 dark:bg-eco-900 rounded-lg text-eco-600">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;