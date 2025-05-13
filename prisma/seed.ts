import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create a user
  const user = await prisma.tbm_user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      full_name: 'System Admin',
      email_verified: true,
    },
  });

  console.log('Created user:', user);

  // Create a team
  const team = await prisma.tbm_team.upsert({
    where: { slug: 'default-team' },
    update: {},
    create: {
      name: 'Default Team',
      slug: 'default-team',
      creator_id: user.id,
    },
  });

  console.log('Created team:', team);

  // Create team member
  const teamMember = await prisma.tbs_team_member.upsert({
    where: {
      id: 'default-team-member',
    },
    update: {},
    create: {
      id: 'default-team-member',
      team_id: team.id,
      user_id: user.id,
      role: 'Admin',
    },
  });

  console.log('Created team member:', teamMember);

  // Create blog post object type
  const blogPostObjectType = await prisma.tbm_object_type.upsert({
    where: { slug: 'blog-post' },
    update: {},
    create: {
      name: 'Blog Post',
      slug: 'blog-post',
    },
  });

  console.log('Created blog post object type:', blogPostObjectType);

  // Create field definitions for blog post
  const titleField = await prisma.tbm_field_definition.upsert({
    where: {
      id: 'blog-post-title-field',
    },
    update: {},
    create: {
      id: 'blog-post-title-field',
      name: 'Title',
      type: 'TEXT',
      required: true,
      object_type_id: blogPostObjectType.id,
    },
  });

  const contentField = await prisma.tbm_field_definition.upsert({
    where: {
      id: 'blog-post-content-field',
    },
    update: {},
    create: {
      id: 'blog-post-content-field',
      name: 'Content',
      type: 'RICH_TEXT',
      required: true,
      object_type_id: blogPostObjectType.id,
    },
  });

  const publishedField = await prisma.tbm_field_definition.upsert({
    where: {
      id: 'blog-post-published-field',
    },
    update: {},
    create: {
      id: 'blog-post-published-field',
      name: 'Published',
      type: 'BOOLEAN',
      required: true,
      default_value: { value: false },
      object_type_id: blogPostObjectType.id,
    },
  });

  console.log(
    'Created field definitions:',
    titleField,
    contentField,
    publishedField,
  );

  // Create a sample blog post entry
  const entry = await prisma.tbm_entry.upsert({
    where: {
      id: 'sample-blog-post',
    },
    update: {},
    create: {
      id: 'sample-blog-post',
      object_type_id: blogPostObjectType.id,
      data: {
        Title: 'Getting Started with NestJS',
        Content: 'This is a sample blog post about NestJS...',
        Published: true,
      },
    },
  });

  console.log('Created sample blog post entry:', entry);

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally((): void => {
    prisma.$disconnect();
  });
