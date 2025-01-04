import { Tabs } from '@mantine/core';

type EditorFooterProps = {
  onChange: (value: string) => void;
};

const EditorFooter: React.FC<EditorFooterProps> = ({ onChange }) => (
  <div className="bg-dark-layer-1 p-3">
    <Tabs
      defaultValue="testcases"
      onChange={(value) => onChange(value || 'testcases')}
      className="w-full"
    >
      <Tabs.List>
        <Tabs.Tab value="testcases">Test Cases</Tabs.Tab>
        <Tabs.Tab value="results">Test Results</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="testcases" pt="xs">

        <div className="p-4">
          <p>nums = [2, 7, 11, 15]</p>
          <p>target = 9</p>
        </div>
      </Tabs.Panel>

      <Tabs.Panel value="results" pt="xs">

        <div className="p-4">
          <p>Output: [0, 1]</p>
        </div>
      </Tabs.Panel>
    </Tabs>
  </div>
);

export default EditorFooter;
