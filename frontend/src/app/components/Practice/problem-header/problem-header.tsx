// ProblemHeader.tsx
import { Inter } from 'next/font/google';
import { Button } from '@mantine/core';
import { IconPlayerPlay, IconCloudCheck, IconArrowLeft } from '@tabler/icons-react';
import styles from './problem-header.module.css';

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

type ProblemHeaderProps = {
  handleRun: () => void;
  handleSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
};

const ProblemHeader: React.FC<ProblemHeaderProps> = ({ 
  handleRun, 
  handleSubmit, 
  isRunning, 
  isSubmitting 
}) => (
  <div className={styles.header}>
    <div className={styles.backButtonContainer}>
      <Button
        className={`${inter.className} ${styles.backButton}`}
        radius="xs"
        variant="subtle"
        component="a"
        href="http://localhost:3000/problems"
      >
        <IconArrowLeft size={16} />
      </Button>
    </div>

    <div className={styles.buttonContainer}>
      <Button
        className={`${inter.className} ${styles.runButton}`}
        radius="xs"
        onClick={handleRun}
        leftSection={<IconPlayerPlay size={16} />}
        variant="filled"
        loading={isRunning}
      >
        Run
      </Button>

      <Button
        className={`${inter.className} ${styles.submitButton}`}
        radius="xs"
        onClick={handleSubmit}
        leftSection={<IconCloudCheck size={16} />}
        variant="filled"
        loading={isSubmitting}
      >
        Submit
      </Button>
    </div>
  </div>
);

export default ProblemHeader;
