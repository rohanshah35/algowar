import { Inter } from 'next/font/google';
import { Button } from '@mantine/core';
import { IconPlayerPlay, IconCloudCheck } from '@tabler/icons-react'; // Import icons

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

type ProblemHeaderProps = {
  handleRun: () => void;
  handleSubmit: () => void;
};

const ProblemHeader: React.FC<ProblemHeaderProps> = ({ handleRun, handleSubmit }) => (
  <div
    style={{
      backgroundColor: '#18181b',
      padding: '14px',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      borderBottom: '1px solid #27272a',
    }}
  >
    <div style={{ display: 'flex', gap: '4px' }}>
      <Button
        className={inter.className}
        style={{
          fontSize: '12px',
          width: '80px',
          height: '30px',
          backgroundColor: '#2d2d2d',
          color: '#d4d4d4',
        }}
        radius="xs"
        onClick={handleRun}
        leftSection={<IconPlayerPlay size={16} />}
        variant="filled"
      >
        Run
      </Button>

      <Button
        className={inter.className}
        style={{
          fontSize: '12px',
          width: '100px',
          height: '30px',
          backgroundColor: '#059669',
          color: 'white',
        }}
        radius="xs"
        onClick={handleSubmit}
        leftSection={<IconCloudCheck size={16} />}
        variant="filled"
      >
        Submit
      </Button>
    </div>
  </div>
);

export default ProblemHeader;
