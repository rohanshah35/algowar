// ProblemHeader.tsx
import { Inter } from 'next/font/google';
import { Button } from '@mantine/core';
import { IconPlayerPlay, IconCloudCheck, IconArrowLeft } from '@tabler/icons-react';
import styles from './problem-header.module.css';
import HamburgerMenu from '../hamburger-menu/hamburger-menu';

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

type ProblemHeaderProps = {
  handleRun: () => void;
  handleSubmit: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const ProblemHeader: React.FC<ProblemHeaderProps> = ({ 
  handleRun, 
  handleSubmit, 
  isRunning, 
  isSubmitting,
  isSidebarOpen,
  toggleSidebar,
}) => (
  <div className={styles.header}>
    <div className={styles.backButtonContainer}>
      <HamburgerMenu isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
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
