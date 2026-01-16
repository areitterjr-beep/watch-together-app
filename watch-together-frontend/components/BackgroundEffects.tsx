'use client';

import { useState, useRef } from 'react';
import { Sparkles, Image, Palette, X, Upload } from 'lucide-react';

interface BackgroundEffectsProps {
  effect: 'none' | 'blur' | 'image' | 'color';
  blurIntensity: number;
  backgroundColor: 'blue' | 'green' | 'purple' | 'red' | 'custom';
  customBackgroundColor: string;
  onEffectChange: (effect: 'none' | 'blur' | 'image' | 'color') => void;
  onBlurIntensityChange: (intensity: number) => void;
  onBackgroundColorChange: (color: 'blue' | 'green' | 'purple' | 'red' | 'custom') => void;
  onCustomBackgroundColorChange: (color: string) => void;
  onBackgroundImageChange: (image: string | null) => void;
}

export default function BackgroundEffects({
  effect,
  blurIntensity,
  backgroundColor,
  customBackgroundColor,
  onEffectChange,
  onBlurIntensityChange,
  onBackgroundColorChange,
  onCustomBackgroundColorChange,
  onBackgroundImageChange,
}: BackgroundEffectsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        onBackgroundImageChange(imageUrl);
        onEffectChange('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const presetColors = [
    { name: 'blue', value: '#1e40af', label: 'Blue' },
    { name: 'green', value: '#166534', label: 'Green' },
    { name: 'purple', value: '#6b21a8', label: 'Purple' },
    { name: 'red', value: '#991b1b', label: 'Red' },
  ] as const;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        title="Background effects"
      >
        <Sparkles className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsOpen(false)}>
      <div 
        className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Background Effects</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Effect Options */}
        <div className="space-y-4">
          {/* None */}
          <button
            onClick={() => onEffectChange('none')}
            className={`w-full p-3 rounded-lg transition-colors text-left ${
              effect === 'none'
                ? 'bg-primary-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <X className="w-5 h-5" />
              <span>No Effect</span>
            </div>
          </button>

          {/* Blur */}
          <div>
            <button
              onClick={() => onEffectChange('blur')}
              className={`w-full p-3 rounded-lg transition-colors text-left mb-2 ${
                effect === 'blur'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Blur Background</span>
              </div>
            </button>
            {effect === 'blur' && (
              <div className="pl-8 pr-4 py-2">
                <label className="block text-sm text-gray-400 mb-2">
                  Blur Intensity: {blurIntensity}px
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={blurIntensity}
                  onChange={(e) => onBlurIntensityChange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Color Background */}
          <div>
            <button
              onClick={() => onEffectChange('color')}
              className={`w-full p-3 rounded-lg transition-colors text-left mb-2 ${
                effect === 'color'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                <span>Color Background</span>
              </div>
            </button>
            {effect === 'color' && (
              <div className="pl-8 pr-4 py-2 space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {presetColors.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => onBackgroundColorChange(preset.name)}
                      className={`h-12 rounded-lg border-2 transition-all ${
                        backgroundColor === preset.name
                          ? 'border-white scale-110'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                      style={{ backgroundColor: preset.value }}
                      title={preset.label}
                    />
                  ))}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Custom Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customBackgroundColor}
                      onChange={(e) => {
                        onCustomBackgroundColorChange(e.target.value);
                        onBackgroundColorChange('custom');
                      }}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={customBackgroundColor}
                      onChange={(e) => {
                        onCustomBackgroundColorChange(e.target.value);
                        onBackgroundColorChange('custom');
                      }}
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                      placeholder="#1e40af"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image Background */}
          <div>
            <button
              onClick={() => {
                onEffectChange('image');
                document.getElementById('bg-image-upload')?.click();
              }}
              className={`w-full p-3 rounded-lg transition-colors text-left ${
                effect === 'image'
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                <span>Custom Image</span>
              </div>
            </button>
            <input
              id="bg-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              ref={fileInputRef}
            />
            {effect === 'image' && (
              <div className="pl-8 pr-4 py-2">
                <button
                  onClick={() => document.getElementById('bg-image-upload')?.click()}
                  className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Change Image
                </button>
                <button
                  onClick={() => {
                    onBackgroundImageChange(null);
                    onEffectChange('none');
                  }}
                  className="w-full mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Note */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-gray-400 text-center">
            Background effects are applied to your camera feed
          </p>
        </div>
      </div>
    </div>
  );
}
