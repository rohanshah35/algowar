import { Tabs, Textarea, Text } from "@mantine/core";
import { Inter } from "next/font/google";
import styles from "./EditorFooter.module.css";
import { IconTestPipe, IconFlask2Filled, IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"], weight: ["300"] });

interface TestCase {
  input: string;
  output: string;
}

interface TestResult {
  case: number;
  error: string | null;
  expected: any;
  nums: number[];
  output: any;
  passed: boolean;
  target: number;
}

const nonSelectableStyles: React.CSSProperties = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
  pointerEvents: 'none' as const
};

type EditorFooterProps = {
  problem: {
    shownTestCases: TestCase[];
  };
  onChange: (value: string) => void;
  results: { results: TestResult[]; error?: string; } | null;
};

const EditorFooter: React.FC<EditorFooterProps> = ({ problem, onChange, results }) => {
  const [activeTab, setActiveTab] = useState("testcases");
  const [activeResultCase, setActiveResultCase] = useState("result-1");

  useEffect(() => {
    if (results) {
      setActiveTab("results");
    }
  }, [results]);

  const renderTestCasesTabs = () => (
    <div style={{ marginTop: "12px" }}>
      <Tabs
        defaultValue="case-1"
        classNames={{
          tab: styles.tab,
          list: styles.list,
        }}
        styles={{
          tab: {
            fontSize: "12px",
            padding: "4px 10px",
            width: "90px"
          },
        }}
      >
        <Tabs.List>
          {problem.shownTestCases.map((_, index) => (
            <Tabs.Tab key={index} value={`case-${index + 1}`}>
              Case {index + 1}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {problem.shownTestCases.map((testCase, index) => (
          <Tabs.Panel key={index} value={`case-${index + 1}`} mt="md">
            <div style={{ marginBottom: "16px" }}>
              <Text fw={500} color="gray.5" style={{ fontSize: "12px", marginBottom: "6px" }}>
                Input:
              </Text>
              <Textarea
                value={testCase.input}
                readOnly
                autosize
                styles={{
                  input: {
                    backgroundColor: "#18181b",
                    color: "#f4f4f5",
                    border: "1px solid #27272a",
                  },
                }}
              />
            </div>
            <div>
              <Text fw={500} color="gray.5" style={{ fontSize: "12px", marginBottom: "6px" }}>
                Expected Output:
              </Text>
              <Textarea
                value={testCase.output}
                readOnly
                autosize
                styles={{
                  input: {
                    backgroundColor: "#18181b",
                    color: "#22C55E",
                    border: "1px solid #27272a",
                  },
                }}
              />
            </div>
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );

  const renderTestResults = () => {
    if (!results) {
      return (
        <Text color="gray.5" style={{ paddingTop: "12px" }}>
          Test Results will be displayed here after running your code.
        </Text>
      );
    }

    if (results.error) {
      return (
        <div 
          className="p-4 rounded-lg" 
          style={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
            color: "#f87171",
            marginTop: "16px"
          }}
        >
          <Text fw={500} color="red.4" size="sm" style={{ marginBottom: "6px" }}>
            Error:
          </Text>
          <Text size="sm">{results.error}</Text>
        </div>
      );
    }

    return (
      <div style={{ marginTop: "12px" }}>
        <Tabs
          value={activeResultCase}
          onChange={(value) => setActiveResultCase(value || "result-1")}
          classNames={{
            tab: styles.tab,
            list: styles.list,
          }}
          styles={{
            tab: {
              fontSize: "12px",
              padding: "4px 10px",
              width: "90px"
            },
          }}
        >
          <Tabs.List>
            {results.results.map((_, index) => (
              <Tabs.Tab 
                key={index} 
                value={`result-${index + 1}`}
              >
                Case {index + 1}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {results.results.map((result, index) => (
            <Tabs.Panel key={index} value={`result-${index + 1}`}>
              <div 
                className="p-4 rounded-lg mt-4"
                style={{ 
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a"
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Text fw={500} color="gray.5" size="sm">
                    Test Case {result.case}
                  </Text>
                  {result.passed ? (
                    <div className="flex items-center text-green-500">
                      <IconCheck size={16} className="mr-1" />
                      <Text size="sm">Passed</Text>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <IconX size={16} className="mr-1" />
                      <Text size="sm">Failed</Text>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div>
                    <Text fw={500} color="gray.5" size="xs" className="mb-1">Input:</Text>
                    <Text size="sm" color="gray.4">
                      {problem.shownTestCases[result.case - 1]?.input}
                    </Text>
                  </div>
                  
                  <div>
                    <Text fw={500} color="gray.5" size="xs" className="mb-1">Expected Output:</Text>
                    <Text size="sm" color="green.4">
                      {JSON.stringify(result.expected)}
                    </Text>
                  </div>
                  
                  <div>
                    <Text fw={500} color="gray.5" size="xs" className="mb-1">Your Output:</Text>
                    <Text 
                      size="sm" 
                      color={result.passed ? "green.4" : "red.4"}
                    >
                      {result.output === null ? "null" : JSON.stringify(result.output)}
                    </Text>
                  </div>
                  
                  {result.error && (
                    <div>
                      <Text fw={500} color="gray.5" size="xs" className="mb-1">Error:</Text>
                      <Text size="sm" color="red.4">
                        {result.error}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
    );
  };

  return (
    <div className={`bg-dark-layer-1 p-3 ${inter.className}`} >
      <Tabs
        value={activeTab}
        onChange={(value) => {
          setActiveTab(value || "testcases");
          onChange(value || "testcases");
        }}
        className="w-full"
        classNames={{
          tab: styles.tab,
          list: styles.list,
        }}
        styles={{
          panel: {
            paddingTop: "2px",
            paddingLeft: "16px",
          },
        }}
      >
        <Tabs.List>
          <Tabs.Tab 
            value="testcases" 
            leftSection={<IconTestPipe size={16} style={{ marginRight: "6px" }} />}
          >
            Test Cases
          </Tabs.Tab>
          <Tabs.Tab 
            value="results" 
            leftSection={<IconFlask2Filled size={16} style={{ marginRight: '6px' }} />}
          >
            Test Results
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="testcases">
          {renderTestCasesTabs()}
        </Tabs.Panel>

        <Tabs.Panel value="results">
          {renderTestResults()}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default EditorFooter;