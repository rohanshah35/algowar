import { Tabs, Textarea, Text } from "@mantine/core";
import { Inter } from "next/font/google";
import styles from "./EditorFooter.module.css";
import { IconTestPipe, IconFlask2Filled } from "@tabler/icons-react";

const inter = Inter({ subsets: ["latin"], weight: ["300"] });

interface TestCase {
  input: string;
  output: string;
}

type EditorFooterProps = {
  problem: {
    testCases: TestCase[];
  };
  onChange: (value: string) => void;
};

const EditorFooter: React.FC<EditorFooterProps> = ({ problem, onChange }) => (
  <div className={`bg-dark-layer-1 p-3 ${inter.className}`}>
    <Tabs
      defaultValue="testcases"
      onChange={(value) => onChange(value || "testcases")}
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
              {problem.testCases.map((_, index) => (
                <Tabs.Tab key={index} value={`case-${index + 1}`}>
                  Case {index + 1}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {problem.testCases.map((testCase, index) => (
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
      </Tabs.Panel>

      <Tabs.Panel value="results" >
        <Text color="gray.5">Test Results will be displayed here after running your code.</Text>
      </Tabs.Panel>
    </Tabs>
  </div>
);

export default EditorFooter;
