import { HardDrive, Shield, UserPlus, Code, Palette } from "lucide-react";

export const StorageStep = ({ autoCleanup, setAutoCleanup, cacheSize, setCacheSize, handleNext, handleBack }: any) => (
  <div className="space-y-8 animate-fade-in">
    <div className="flex items-center gap-4 mb-8">
      <HardDrive className="w-12 h-12 text-primary" />
      <h2 className="text-4xl font-bold">Storage & Data</h2>
    </div>
    
    <div className="space-y-6">
      <label className="flex items-center justify-between gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
        <div>
          <div className="font-bold">Auto Cleanup</div>
          <div className="text-sm text-muted-foreground">Automatically remove temporary files</div>
        </div>
        <input
          type="checkbox"
          checked={autoCleanup}
          onChange={(e) => setAutoCleanup(e.target.checked)}
          className="w-5 h-5"
        />
      </label>

      <div>
        <label className="block font-bold mb-3">Cache Size Limit (GB)</label>
        <input
          type="range"
          min="1"
          max="20"
          value={cacheSize}
          onChange={(e) => setCacheSize(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-center mt-2 text-primary font-bold">{cacheSize} GB</div>
      </div>
    </div>

    <div className="flex gap-4 justify-between">
      <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
        Back
      </button>
      <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
        Continue
      </button>
    </div>
  </div>
);

export const SecurityStep = ({ encryption, setEncryption, biometrics, setBiometrics, handleNext, handleBack }: any) => (
  <div className="space-y-8 animate-fade-in">
    <div className="flex items-center gap-4 mb-8">
      <Shield className="w-12 h-12 text-primary" />
      <h2 className="text-4xl font-bold">Security Settings</h2>
    </div>
    
    <div className="space-y-6">
      <label className="flex items-center justify-between gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
        <div>
          <div className="font-bold">Full Disk Encryption</div>
          <div className="text-sm text-muted-foreground">Encrypt all stored data</div>
        </div>
        <input
          type="checkbox"
          checked={encryption}
          onChange={(e) => setEncryption(e.target.checked)}
          className="w-5 h-5"
        />
      </label>

      <label className="flex items-center justify-between gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
        <div>
          <div className="font-bold">Biometric Authentication</div>
          <div className="text-sm text-muted-foreground">Enable fingerprint/face unlock</div>
        </div>
        <input
          type="checkbox"
          checked={biometrics}
          onChange={(e) => setBiometrics(e.target.checked)}
          className="w-5 h-5"
        />
      </label>
    </div>

    <div className="flex gap-4 justify-between">
      <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
        Back
      </button>
      <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
        Continue
      </button>
    </div>
  </div>
);

export const AccountsStep = ({ handleNext, handleBack }: any) => (
  <div className="space-y-8 animate-fade-in">
    <div className="flex items-center gap-4 mb-8">
      <UserPlus className="w-12 h-12 text-primary" />
      <h2 className="text-4xl font-bold">User Accounts</h2>
    </div>
    
    <div className="space-y-6">
      <p className="text-muted-foreground">
        User accounts will be set up after initial setup. You'll be able to create and manage multiple accounts in Settings.
      </p>
      
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
        <p className="text-sm">
          <strong className="text-primary">Note:</strong> The default administrator account will be created automatically.
        </p>
      </div>
    </div>

    <div className="flex gap-4 justify-between">
      <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
        Back
      </button>
      <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
        Continue
      </button>
    </div>
  </div>
);

export const DeveloperStep = ({ developerMode, setDeveloperMode, oemUnlocked, setOemUnlocked, usbDebugging, setUsbDebugging, handleNext, handleBack }: any) => (
  <div className="space-y-8 animate-fade-in">
    <div className="flex items-center gap-4 mb-8">
      <Code className="w-12 h-12 text-primary" />
      <h2 className="text-4xl font-bold">Developer Options</h2>
    </div>
    
    <div className="space-y-6">
      <label className="flex items-center justify-between gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
        <div>
          <div className="font-bold">Developer Mode</div>
          <div className="text-sm text-muted-foreground">Enable advanced developer features</div>
        </div>
        <input
          type="checkbox"
          checked={developerMode}
          onChange={(e) => setDeveloperMode(e.target.checked)}
          className="w-5 h-5"
        />
      </label>

      {developerMode && (
        <>
          <label className="flex items-center justify-between gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
            <div>
              <div className="font-bold">OEM Unlocking</div>
              <div className="text-sm text-muted-foreground">Allow bootloader unlock without factory reset</div>
            </div>
            <input
              type="checkbox"
              checked={oemUnlocked}
              onChange={(e) => setOemUnlocked(e.target.checked)}
              className="w-5 h-5"
            />
          </label>

          <label className="flex items-center justify-between gap-3 cursor-pointer p-4 rounded-lg bg-black/40 border border-white/10">
            <div>
              <div className="font-bold">USB Debugging</div>
              <div className="text-sm text-muted-foreground">Allow debugging via USB connection</div>
            </div>
            <input
              type="checkbox"
              checked={usbDebugging}
              onChange={(e) => setUsbDebugging(e.target.checked)}
              className="w-5 h-5"
            />
          </label>
        </>
      )}
      
      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
        <p className="text-sm text-yellow-500">
          <strong>Warning:</strong> These options are for advanced users only. Incorrect usage may cause system instability.
        </p>
      </div>
    </div>

    <div className="flex gap-4 justify-between">
      <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
        Back
      </button>
      <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
        Continue
      </button>
    </div>
  </div>
);

export const BackgroundStep = ({ bgGradientStart, setBgGradientStart, bgGradientEnd, setBgGradientEnd, handleNext, handleBack }: any) => (
  <div className="space-y-8 animate-fade-in">
    <div className="flex items-center gap-4 mb-8">
      <Palette className="w-12 h-12 text-primary" />
      <h2 className="text-4xl font-bold">Customize Background</h2>
    </div>
    
    <div className="space-y-6">
      <div>
        <label className="block font-bold mb-3">Gradient Start Color</label>
        <input
          type="color"
          value={bgGradientStart}
          onChange={(e) => setBgGradientStart(e.target.value)}
          className="w-full h-16 rounded-lg cursor-pointer"
        />
      </div>

      <div>
        <label className="block font-bold mb-3">Gradient End Color</label>
        <input
          type="color"
          value={bgGradientEnd}
          onChange={(e) => setBgGradientEnd(e.target.value)}
          className="w-full h-16 rounded-lg cursor-pointer"
        />
      </div>

      <div className="p-6 rounded-lg border-2 border-white/10" style={{ background: `linear-gradient(135deg, ${bgGradientStart}, ${bgGradientEnd})` }}>
        <p className="text-white font-bold text-center">Preview</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => { setBgGradientStart("#1a1a2e"); setBgGradientEnd("#16213e"); }} className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 text-sm">
          Dark Blue
        </button>
        <button onClick={() => { setBgGradientStart("#0f0f0f"); setBgGradientEnd("#1a1a1a"); }} className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 text-sm">
          Pure Dark
        </button>
        <button onClick={() => { setBgGradientStart("#1e3a8a"); setBgGradientEnd("#312e81"); }} className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 hover:border-primary/30 text-sm">
          Deep Blue
        </button>
      </div>
    </div>

    <div className="flex gap-4 justify-between">
      <button onClick={handleBack} className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
        Back
      </button>
      <button onClick={handleNext} className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/80 transition-colors">
        Continue
      </button>
    </div>
  </div>
);
