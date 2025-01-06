#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <language> <source_file>"
  exit 1
fi

LANGUAGE=$1
SOURCE_FILE=$2
OUTPUT_FILE="output"

# Move to the workspace directory
cd /workspace

# Compile or interpret the code based on the language
case $LANGUAGE in
  "c")
    gcc "$SOURCE_FILE" -o "$OUTPUT_FILE"
    ;;
  "cpp" | "c++")
    g++ "$SOURCE_FILE" -o "$OUTPUT_FILE"
    ;;
  "python")
    python2 "$SOURCE_FILE"
    exit 0
    ;;
  "python3")
    python3 "$SOURCE_FILE"
    exit 0
    ;;
  "java")
    javac "$SOURCE_FILE"
    OUTPUT_FILE=$(basename "$SOURCE_FILE" .java)
    java "$OUTPUT_FILE"
    exit 0
    ;;
  *)
    echo "Unsupported language: $LANGUAGE"
    exit 1
    ;;
esac

# Execute the compiled output if it's a C or C++ program
if [ -f "$OUTPUT_FILE" ]; then
  ./"$OUTPUT_FILE"
fi
