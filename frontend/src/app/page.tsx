import { Container } from "@mantine/core";
import AppNavbar from "./components/navbar";

export default function Home() {
  return (
    <>
      <AppNavbar />
      <Container style={{ marginTop: '2rem', textAlign: 'center' }}>
      </Container>
    </>
  );
}