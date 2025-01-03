export const mockProblem = {
  id: "two-sum",
  title: "1. Two Sum",
  description:
    "Given an array of integers, find two numbers that add up to the target. You may assume that each input would have exactly one solution, and you may not use the same element twice. The solution should be returned in any order. The problem tests your ability to use hash maps or two-pointer techniques to optimize time complexity for such scenarios. It's one of the most basic and commonly asked questions in coding interviews.",
  difficulty: "Easy",
  starterCode: `// Implement the twoSum function
function twoSum(nums, target) {
  // Write your code here
}`,
  examples: [
    {
      inputText: "nums = [2,7,11,15], target = 9",
      outputText: "[0, 1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      inputText: "nums = [3,2,4], target = 6",
      outputText: "[1, 2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
    {
      inputText: "nums = [3,3], target = 6",
      outputText: "[0, 1]",
      explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
    },
    {
      inputText: "nums = [1, 2, 3, 4, 5], target = 6",
      outputText: "[1, 3]",
      explanation: "Because nums[1] + nums[3] == 6, we return [1, 3].",
    },
    {
      inputText: "nums = [10, 20, 10, 40, 50, 60, 70], target = 50",
      outputText: "[0, 3]",
      explanation: "Because nums[0] + nums[3] == 50, we return [0, 3].",
    },
    {
      inputText: "nums = [100, 200, 300, 400, 500], target = 900",
      outputText: "[3, 4]",
      explanation: "Because nums[3] + nums[4] == 900, we return [3, 4].",
    },
    {
      inputText: "nums = [1, 3, 5, 7, 9], target = 10",
      outputText: "[0, 4]",
      explanation: "Because nums[0] + nums[4] == 10, we return [0, 4].",
    },
    {
      inputText: "nums = [10, -10, 20, -20, 30], target = 0",
      outputText: "[1, 3]",
      explanation: "Because nums[1] + nums[3] == 0, we return [1, 3].",
    },
    {
      inputText: "nums = [5, 5, 10, 15], target = 10",
      outputText: "[0, 1]",
      explanation: "Because nums[0] + nums[1] == 10, we return [0, 1].",
    },
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists.",
    "Indices must be returned in ascending order.",
    "The input array is unsorted.",
    "All elements in the input array are integers.",
    "The input array can contain duplicate numbers.",
  ],
};
