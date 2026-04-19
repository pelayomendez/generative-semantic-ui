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
  flight: `
    <Stack gap={3}>
      <Heading level={2}>Book a flight</Heading>
      <Row gap={2}>
        <Input name="from" placeholder="From (e.g. MAD)" />
        <Input name="to" placeholder="To (e.g. JFK)" />
      </Row>
      <Row gap={2}>
        <Input name="departure" type="date" placeholder="Departure" />
        <Input name="return" type="date" placeholder="Return" />
      </Row>
      <Input name="passengers" type="number" placeholder="Passengers" />
      <Divider />
      <Row gap={2}>
        <Button onClick="cancelBooking">Cancel</Button>
        <Button onClick="searchFlights">Search flights</Button>
      </Row>
    </Stack>
  `,
  profile: `
    <Stack gap={3}>
      <Heading level={2}>Perfil</Heading>
      <Input name="firstName" placeholder="Nombre" />
      <Input name="lastName" placeholder="Apellidos" />
      <Input name="address" placeholder="Dirección" />
      <Row gap={2}>
        <Button onClick="cancelProfile">Cancelar</Button>
        <Button onClick="saveProfile">Guardar</Button>
      </Row>
    </Stack>
  `,
};
