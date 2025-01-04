import { Inter } from 'next/font/google';
import { Button } from '@mantine/core';

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

type ProblemHeaderProps = {
  handleRun: () => void;
  handleSubmit: () => void;
};

const ProblemHeader: React.FC<ProblemHeaderProps> = ({ handleRun, handleSubmit }) => (
  <div
    style={{
      backgroundColor: '#1e1e1e',
      padding: '10px',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      borderBottom: '1px solid #3c3c3c',
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
        radius="sm"
        onClick={handleRun}
        variant="filled"
      >
        Run
      </Button>
      <Button
        className={inter.className}
        style={{
          fontSize: '12px',
          width: '80px',
          height: '30px',
          backgroundColor: '#059669',
          color: 'white',
        }}
        radius="sm"
        onClick={handleSubmit}
        variant="filled"
      >
        Submit
      </Button>
    </div>
  </div>
);

export default ProblemHeader;
