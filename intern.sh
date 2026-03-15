#!/bin/bash

OUTPUT="repo_llm_context.md"
> "$OUTPUT"

echo "# Repository Context Export" >> "$OUTPUT"
echo "" >> "$OUTPUT"

find . \
  -type f \
  -not -path "*/.git/*" \
  -not -path "*/node_modules/*" \
  -not -path "*/venv/*" \
  -not -path "*/.venv/*" \
  -not -path "*/env/*" \
  -not -path "*/__pycache__/*" \
  -not -path "*/build/*" \
  -not -path "*/dist/*" \
  -not -name "*.png" \
  -not -name "*.jpg" \
  -not -name "*.jpeg" \
  -not -name "*.gif" \
  -not -name "*.pdf" \
  -not -name "*.zip" \
  -not -name "*.exe" \
| while read -r f; do

  echo "## FILE: $f" >> "$OUTPUT"
  echo '```' >> "$OUTPUT"
  cat "$f" >> "$OUTPUT"
  echo '```' >> "$OUTPUT"
  echo "" >> "$OUTPUT"

done
