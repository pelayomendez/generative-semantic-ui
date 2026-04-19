export interface Example {
  prompt: string;
  jsx: string;
}

// Precomputed LLM outputs so the playground has something to render
// even when the user has no API key set.
export const EXAMPLES: Example[] = [
  {
    prompt: "a login form",
    jsx: `<Stack gap={3}>
  <Heading level={2}>Log in</Heading>
  <Input name="email" type="email" placeholder="Email" />
  <Input name="password" type="password" placeholder="Password" />
  <Button onClick="login">Log in</Button>
</Stack>`,
  },
  {
    prompt: "a profile form with name, surname, address",
    jsx: `<Stack gap={3}>
  <Heading level={2}>Profile</Heading>
  <Input name="firstName" placeholder="First name" />
  <Input name="lastName" placeholder="Last name" />
  <Input name="address" placeholder="Address" />
  <Row gap={2}>
    <Button onClick="cancel">Cancel</Button>
    <Button onClick="save">Save</Button>
  </Row>
</Stack>`,
  },
  {
    prompt: "a transform panel for a 3D object (x, y, z)",
    jsx: `<Stack gap={2}>
  <Heading level={3}>Transform</Heading>
  <Input name="x" type="number" placeholder="X" />
  <Input name="y" type="number" placeholder="Y" />
  <Input name="z" type="number" placeholder="Z" />
  <Button onClick="apply">Apply</Button>
</Stack>`,
  },
  {
    prompt: "a settings panel with username, email, save and cancel",
    jsx: `<Stack gap={4}>
  <Heading level={2}>Settings</Heading>
  <Input name="username" placeholder="Username" />
  <Input name="email" placeholder="Email" />
  <Divider />
  <Row gap={2}>
    <Button onClick="cancel">Cancel</Button>
    <Button onClick="save">Save</Button>
  </Row>
</Stack>`,
  },
];
