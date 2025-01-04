import { Tabs } from '@mantine/core';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['300'] });

interface TestCase {
  input: string;
  output: string;
}

type EditorFooterProps = {
  onChange: (value: string) => void;
  problem: {
    testCases: TestCase[];
  };
  testResults?: {
    passed: boolean;
    output: string;
    expectedOutput: string;
  }[];
};

const EditorFooter: React.FC<EditorFooterProps> = ({ onChange, problem, testResults }) => (
  <div className={`bg-dark-layer-1 p-3 ${inter.className}`}>
    <Tabs
      defaultValue="testcases"
      onChange={(value) => onChange(value || 'testcases')}
      className="w-full"
      styles={{
        tab: {
          fontFamily: inter.style.fontFamily,
          fontSize: '14px',
          color: '#d4d4d4',
          backgroundColor: 'transparent',
          border: 'none',
        },
        panel: {
          fontFamily: inter.style.fontFamily,
          color: '#d4d4d4',
          fontSize: '13px',
        },
      }}
    >
      <Tabs.List>
        <Tabs.Tab value="testcases">Test Cases</Tabs.Tab>
        <Tabs.Tab value="results">Test Results</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="testcases" pt="xs">
        <div className="p-4">
          {problem.testCases.map((testCase, index) => (
            <div key={index}>
              <p>Input: {testCase.input}</p>
              <p>Expected Output: {testCase.output}</p>
            </div>
          ))}
        </div>
      </Tabs.Panel>

      <Tabs.Panel value="results" pt="xs">
        <div className="p-4">
          {testResults ? (
            testResults.map((result, index) => (
              <p key={index}>Output: {result.output}</p>
            ))
          ) : (
            <p>Output: Run your code to see results</p>
          )}
        </div>
      </Tabs.Panel>
    </Tabs>
  </div>
);

export default EditorFooter;