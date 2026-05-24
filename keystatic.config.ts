import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'unqdlphn/quirgs',
  },
  collections: {
    skills: collection({
      label: 'Compliance Skills',
      slugField: 'slug',
      path: 'src/content/skills/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Title' }),
        tagline: fields.text({ label: 'Tagline' }),
        framework: fields.array(
          fields.text({ label: 'Framework' }),
          { label: 'Frameworks' }
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
