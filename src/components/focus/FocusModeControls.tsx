
import { Button } from '@/components/ui/button';

interface FocusModeControlsProps {
  mode: 'focus' | 'shortBreak' | 'longBreak';
  onSwitchMode: (newMode: 'focus' | 'shortBreak' | 'longBreak') => void;
}

const FocusModeControls = ({ mode, onSwitchMode }: FocusModeControlsProps) => {
  return (
    <div className="flex justify-center space-x-2 mb-4">
      <Button
        variant={mode === 'focus' ? 'default' : 'outline'}
        onClick={() => onSwitchMode('focus')}
        className={mode === 'focus' ? 'bg-green-500 hover:bg-green-600' : ''}
      >
        Focus
      </Button>
      <Button
        variant={mode === 'shortBreak' ? 'default' : 'outline'}
        onClick={() => onSwitchMode('shortBreak')}
        className={mode === 'shortBreak' ? 'bg-blue-500 hover:bg-blue-600' : ''}
      >
        Short Break
      </Button>
      <Button
        variant={mode === 'longBreak' ? 'default' : 'outline'}
        onClick={() => onSwitchMode('longBreak')}
        className={mode === 'longBreak' ? 'bg-purple-500 hover:bg-purple-600' : ''}
      >
        Long Break
      </Button>
    </div>
  );
};

export default FocusModeControls;
