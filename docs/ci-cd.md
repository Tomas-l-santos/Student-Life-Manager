## Overview

Continuous Integration  (CI) is the practice of automatically checking every code change to a software program the moment it is pushed to the repository. Rather than manually running checks and tests before merging, the pipeline does it automatically and immediately flags any issues spotted.

Continuous Deployment (CD) extends this by ensuring that every change that passes all stages of a production pipeline is released to a live environment. With four developers working across a shared codebase, code quality issues can compound quickly. Failures can arise from various issues such as  broken imports, unused variables, or formatting inconsistencies. The pipeline enforces a quality check on every push to the 'main' ensuring:
 - No broken syntax or format errors
 - Code style is consistent across all contributors
 - The production build is verified to compile before merging

The pipeline is defined in `.github/workflows/ci.yml` and runs automatically on Github Actions.

## Pipeline Stages

The pipeline contains two parallel jobs, one for the backend tests and the other for the frontend build, running simultaneously to reduce total pipeline time.

### Backend Job

#### Stage 1 — Checkout
```yaml
- uses: actions/checkout@v4
```
Clones the repository onto the GitHub Actions runner so subsequent steps have access to the code.

#### Stage 2 — Python Setup
```yaml
- uses: actions/setup-python@v5
  with:
    python-version: "3.12"
```
Installs Python 3.12 on the runner, matching the version used in development. Pinning the version ensures the pipeline behaves identically every time regardless of what Python version GitHub updates their runners to.

#### Stage 3 — Install Dependencies
```yaml
- run: |
    cd Backend
    pip install -r requirements.txt
```
Installs all runtime dependencies from `requirements.txt`. If a developer adds a new package locally but forgets to update `requirements.txt`, this step will catch the omission before it breaks another developer's environment.

#### Stage 4 — Install Dev Tools
```yaml
- run: pip install flake8 black
```
Installs flake8 separately (development tool not runtime dependency)

#### Stage 5 — Syntax Check
```yaml
- run: |
    cd Backend
    python -m py_compile $(git ls-files '*.py')
```
Compiles every tracked Python file without executing it. This catches syntax errors such as missing colons, unclosed brackets, or invalid indentation that would cause an immediate crash at startup. It runs before linting so that the most critical errors are reported first.

#### Stage 6 - Format Check with black
```yaml
- run: |
    cd Backend
    python -m black --check --diff .
```
Runs black in check mode which exits with a non-zero code if any file would be reformatted, failing the pipeline.

#### Stage 7 — Lint with flake8
```yaml
- run: |
    cd Backend
    python -m flake8 .
```
Runs flake8 across all Python files to check for PEP8 style violations and potential code quality issues. Examples of what it catches:

| Code | Issue |
|------|-------|
| `from services.authorisation import AuthService` (unused) | F401 — imported but unused |
| `x = a+b` | E226 — missing whitespace around operator |
| Three blank lines between functions | E303 — too many blank lines |
| A blank line containing only spaces | W293 — whitespace on blank line |
| Importing `datetime` twice in the same file | F811 — redefinition of unused name |

The configuration is stored in `Backend/.flake8` which sets the maximum line length to 100 characters and excludes virtual environment folders.

### Frontend Job

#### Stage 1 — Checkout
Clones the repository.

#### Stage 2 — Node Setup
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "20"
```
Installs Node.js 20 LTS on the runner. Vite and the TypeScript compiler require Node to run.

#### Stage 3 — Install Dependencies
```yaml
- run: |
    cd Frontend
    npm install
```
Installs all packages from `package.json` and `package-lock.json`.

#### Stage 4 — TypeScript Type Check
```yaml
- run: |
    cd Frontend
    npx tsc --noEmit
```
Runs the TypeScript compiler across the entire codebase without producing any output files. This catches type errors that would not necessarily prevent the app from running in development but would indicate bugs or incorrect assumptions in the code. Examples of what it catches:

| Error | Meaning |
|-------|---------|
| `TS6133: 'React' is declared but its value is never read` | Unused import — remove it |
| `TS2304: Cannot find name 'Navigate'` | Missing import from react-router-dom |
| `TS2322: Type 'string' is not assignable to type 'number'` | Wrong type passed to a prop or function |

#### Stage 5 — Build
```yaml
- run: |
    cd Frontend
    npm run build
```
Runs `tsc -b && vite build` to produce the full production bundle. This verifies that the application compiles end-to-end, including all imports, assets,and optimisations. A passing build confirms the app could be deployed as-is.

#### Stage 6 — Lint with ESLint
```yaml
- run: |
    cd Frontend
    npm run lint
```
Runs ESLint across all `.ts` and `.tsx` files using the configuration in `eslint.config.js`. It checks for React-specific issues such as missing hook dependencies, rules of hooks violations, and unused variables, as well as general TypeScript quality rules. Running lint after the build means a build failure is reported before lint issues, prioritising the most critical errors first.

## 3. How to Read the Results

### Finding the Actions tab
1. Go to the repository on GitHub
2. Click the Actions tab at the top of the page
3. Each push or pull request will appear as a workflow run in the list

### Interpreting results

| Symbol | Meaning |
|--------|---------|
| Yellow circle | Pipeline is currently running |
| Green tick | All jobs passed (code is clean) |
| Red cross | One or more jobs failed |

### Investigating a failure
1. Click the failed workflow run
2. Click the job that failed (Backend Tests or Frontend Build)
3. Expand the step that shows a red cross
4. Read the error output — flake8 will show the file path, line number, and rule code. TypeScript will show the file, line, column, and error message
5. Fix the issue locally, commit, and push — the pipeline re-runs automatically

