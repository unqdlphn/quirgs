const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MAP_PATH = path.join(__dirname, '../../skills/gist-map.json');
const gistToken = process.env.GIST_TOKEN;
const gitToken = process.env.GIT_TOKEN;

if (!gistToken) {
  console.error("Error: GIST_TOKEN is not defined in environment");
  process.exit(1);
}

async function apiRequest(url, method, body) {
  const response = await fetch(url, {
    method,
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${gistToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'quirgs-gist-sync',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

async function run() {
  const sha = process.env.GITHUB_SHA || 'HEAD';
  let diffOutput = '';

  try {
    diffOutput = execSync(`git diff --name-only ${sha}~1 ${sha}`).toString();
  } catch (e) {
    try {
      console.log('HEAD~1 reference missing. Fetching repository history...');
      execSync('git fetch --depth=2', { stdio: 'inherit' });
      diffOutput = execSync(`git diff --name-only ${sha}~1 ${sha}`).toString();
    } catch (err) {
      console.error('Failed to retrieve git diff:', err);
      process.exit(1);
    }
  }

  const changedFiles = diffOutput.split('\n').map(f => f.trim()).filter(Boolean);
  const skillFiles = changedFiles.filter(file => /^skills\/[^/]+\/SKILL\.md$/.test(file));

  if (skillFiles.length === 0) {
    console.log('No skills/*/SKILL.md files changed. Exiting sync script.');
    process.exit(0);
  }

  let map = {};
  try {
    if (fs.existsSync(MAP_PATH)) {
      map = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
    }
  } catch (e) {
    console.error(`Failed to read or parse map at ${MAP_PATH}:`, e);
    process.exit(1);
  }

  let mapChanged = false;

  for (const filePath of skillFiles) {
    const match = filePath.match(/^skills\/([^/]+)\/SKILL\.md$/);
    if (!match) continue;
    const slug = match[1];
    const absoluteSkillPath = path.join(__dirname, '../../', filePath);

    if (!fs.existsSync(absoluteSkillPath)) {
      console.warn(`File ${filePath} no longer exists. Skipping.`);
      continue;
    }

    const content = fs.readFileSync(absoluteSkillPath, 'utf8');
    const gistId = map[slug];

    if (gistId) {
      try {
        console.log(`Updating existing Gist ${gistId} for skill ${slug}...`);
        await apiRequest(`https://api.github.com/gists/${gistId}`, 'PATCH', {
          description: `Quirgs Skill: ${slug}`,
          files: {
            [`${slug}.md`]: {
              content
            }
          }
        });
        console.log(`Successfully updated Gist ${gistId}`);
      } catch (e) {
        if (e.message.includes('404')) {
          console.warn(`Gist ${gistId} not found (404). Creating a new one...`);
          const newGist = await apiRequest('https://api.github.com/gists', 'POST', {
            description: `Quirgs Skill: ${slug}`,
            public: true,
            files: {
              [`${slug}.md`]: {
                content
              }
            }
          });
          map[slug] = newGist.id;
          mapChanged = true;
          console.log(`Created new Gist ${newGist.id} for skill ${slug}`);
        } else {
          throw e;
        }
      }
    } else {
      console.log(`Creating Gist for skill ${slug}...`);
      const newGist = await apiRequest('https://api.github.com/gists', 'POST', {
        description: `Quirgs Skill: ${slug}`,
        public: true,
        files: {
          [`${slug}.md`]: {
            content
          }
        }
      });
      map[slug] = newGist.id;
      mapChanged = true;
      console.log(`Created new Gist ${newGist.id} for skill ${slug}`);
    }
  }

  if (mapChanged) {
    fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 2) + '\n');
    console.log('Updated gist-map.json. Committing and pushing back...');

    if (!gitToken) {
      console.error("Error: GIT_TOKEN is not defined in environment");
      process.exit(1);
    }

    const repo = process.env.GITHUB_REPOSITORY;
    if (!repo) {
      console.error("Error: GITHUB_REPOSITORY is not defined in environment");
      process.exit(1);
    }

    try {
      execSync('git config user.name "github-actions[bot]"');
      execSync('git config user.email "github-actions[bot]@users.noreply.github.com"');
      execSync('git add skills/gist-map.json');
      execSync('git commit -m "chore: update gist-map.json [skip ci]"');

      execSync(`git remote set-url origin https://x-access-token:${gitToken}@github.com/${repo}.git`);
      execSync('git push origin HEAD');
      console.log('Successfully pushed updated gist-map.json to repository.');
    } catch (gitErr) {
      console.error('Failed to commit/push updated map:', gitErr);
      process.exit(1);
    }
  } else {
    console.log('No Gist IDs changed. No push back required.');
  }
}

run().catch(err => {
  console.error('Fatal error during gist sync:', err);
  process.exit(1);
});
