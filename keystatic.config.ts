import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'quirgs-admin/quirgs',
  },
  collections: {
    skills: collection({
      label: 'Compliance Skills',
      slugField: 'slug',
      path: 'src/content/skills/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Title' }),
        slug: fields.text({ label: 'Slug' }),
        tagline: fields.text({ label: 'Tagline' }),
        bundle: fields.select({
          label: 'Bundle',
          options: [
            { label: 'Compliance', value: 'compliance' },
            { label: 'Publish', value: 'publish' },
          ],
          defaultValue: 'compliance',
        }),
        pillar: fields.select({
          label: 'Pillar',
          // Must mirror the enum in src/content.config.ts exactly.
          options: [
            { label: 'Inventory', value: 'Inventory' },
            { label: 'Checkpoints', value: 'Checkpoints' },
            { label: 'Standards Alignment', value: 'Standards Alignment' },
          ],
          defaultValue: 'Inventory',
        }),
        framework: fields.array(
          fields.text({ label: 'Framework' }),
          { label: 'Frameworks' }
        ),
        interoperates_with: fields.array(
          fields.text({ label: 'Skill slug' }),
          { label: 'Interoperates With' }
        ),
        triggers: fields.array(
          fields.text({ label: 'Trigger phrase' }),
          { label: 'Triggers' }
        ),
        example_prompts: fields.array(
          fields.text({ label: 'Example prompt' }),
          { label: 'Example Prompts' }
        ),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Live', value: 'live' },
            { label: 'Draft', value: 'draft' },
            { label: 'Deprecated', value: 'deprecated' },
          ],
          defaultValue: 'draft',
        }),
        version: fields.text({ label: 'Version' }),
        lastUpdated: fields.date({ label: 'Last Updated' }),
        gistUrl: fields.url({ label: 'Gist URL' }),
        marketplaceCmd: fields.text({ label: 'Marketplace Add Command' }),
        installCmd: fields.text({ label: 'Install Command' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags' }
        ),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
  },
});
