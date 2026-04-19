export const FIXTURES: Record<string, string> = {
  login: `
    <Stack gap={3}>
      <Heading level={2}>Log in</Heading>
      <Input name="email" type="email" placeholder="Email" />
      <Input name="password" type="password" placeholder="Password" />
      <Button onClick="login">Log in</Button>
    </Stack>
  `,
  settings: `
    <Stack gap={4}>
      <Heading level={2}>Settings</Heading>
      <Input name="username" placeholder="Username" />
      <Input name="email" placeholder="Email" />
      <Divider />
      <Row gap={2}>
        <Button onClick="cancel">Cancel</Button>
        <Button onClick="save">Save</Button>
      </Row>
    </Stack>
  `,
  transform: `
    <Stack gap={2}>
      <Heading level={3}>Transform</Heading>
      <Input name="x" type="number" placeholder="X" />
      <Input name="y" type="number" placeholder="Y" />
      <Input name="z" type="number" placeholder="Z" />
      <Button onClick="apply">Apply</Button>
    </Stack>
  `,
};
