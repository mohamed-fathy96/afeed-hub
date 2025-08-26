export default (plop) => {
  const titleCase = plop.getHelper('titleCase');
  plop.setHelper('folderName', (txt) => titleCase(txt).replace(/ /g, ''));
  plop.setGenerator('component', {
    description:
      'Generate New UI Component skeleton',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name',
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: `src/ui/{{folderName name}}/index.tsx`,
        templateFile: '.templates/component/index.hbs',
      },
      {
        type: 'add',
        path: `src/ui/{{folderName name}}/{{folderName name}}.types.ts`,
        templateFile: '.templates/component/Types.hbs',
      },
      {
        type: 'add',
        path: `src/ui/{{folderName name}}/{{folderName name}}.tsx`,
        templateFile: '.templates/component/Component.hbs',
      },
      {
        type: 'add',
        path: `src/ui/{{folderName name}}/README.md`,
        templateFile: '.templates/component/README.hbs',
      },
    ],
  });
  plop.setGenerator('page', {
    description:
      'Generate New Page skeleton',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Page name',
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: `src/pages/{{folderName name}}/index.tsx`,
        templateFile: '.templates/page/index.hbs',
      }]
  })
};