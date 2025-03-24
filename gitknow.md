# GIT and Github Knowledge

## Efficient Branch Structure

To set up an efficient branch structure for your repository, you can follow the Git branching model known as “Git Flow.” This model helps manage the development process by organizing branches in a structured way. Here are the key branches and steps to set up Git Flow:

### Main Branches

- main: This branch contains the production-ready code. It should always be stable.
- develop: This branch contains the latest development changes. It is the integration branch for features.

### Supporting Branches

- **feature/***: These branches are used to develop new features. They branch off from develop and merge back into develop.
- **release/***: These branches are used to prepare for a new production release. They branch off from develop and merge into main and develop.
- **hotfix/***: These branches are used to quickly fix production issues. They branch off from main and merge back into main and develop.

## Steps to Set Up Git Flow

1. Create the develop branch

   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

2. Create a feature branch

   ```bash
   git checkout -b feature/your-feature-name develop
   ```

3. Work on the feature and commit changes

   ```bash
   git add .
   git commit -m “Add new feature”
   ```

4. Merge the feature branch back into develop

   ```bash
   git checkout develop
   git merge feature/your-feature-name
   git push
   ```

5. Create a release branch (when ready for a new release)

   ```bash
   git checkout -b release/v1.0 develop
   ```

6. Prepare the release, fix bugs, and commit changes

   ```bash
   git add .
   git commit -m “Prepare for release v1.0”
   ```

7. Merge the release branch into main and develop

   ```bash
   git checkout main
   git merge release/v1.0
   git push

   git checkout develop
   git merge release/v1.0
   git push
   ```

8. Create a hotfix branch (if needed)

   ```bash
   git checkout -b hotfix/v1.0.1 main
   ```

9. Fix the issue, commit changes, and merge back into main and develop

   ```bash
   git add .
   git commit -m “Fix critical issue”
   git checkout main
   git merge hotfix/v1.0.1
   git push

   git checkout develop
   git merge hotfix/v1.0.1
   git push
   ```

## Summary of Branches

- main: Production-ready code.
- develop: Latest development changes.
- **feature/***: New features.
- **release/***: Preparing for a new release.
- **hotfix/***: Quick fixes for production issues.

This branching model helps keep your codebase organized and ensures a smooth development and release process.

# Switch Branches and Run Script in VS Code

To switch branches and run your script in VS Code, follow these steps:

1. Switch Branches

   - Open the Source Control panel by clicking on the Source Control icon in the Activity Bar on the side of the window.
   - Click on the branch name at the bottom of the Source Control panel.
   - Select the branch you want to switch to (main or develop).

2. Activate Virtual Environment

   - Open the integrated terminal in VS Code by selecting View > Terminal from the menu or pressing Ctrl+`.
   - Activate your virtual environment by running the appropriate command:

     ```bash
     source path/to/venv/bin/activate  # For macOS/Linux
     ```

3. Run the Script

   - In the terminal, navigate to the directory containing your script.
   - Run your script using the appropriate command, for example:

     ```bash
     python your_script.py
     ```

This will run the version of the script corresponding to the branch you have checked out.