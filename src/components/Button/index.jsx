import { Container } from "./styles";

export function Button({ title, icon, loading = false , ...rest }) {

  return (
  <Container 
    type={rest.type || 'button'}
    disabled={loading}
    {...rest}
  >
    {loading ? 'Carregando...' : (
      <>
        {icon && <span>{icon}</span>}
        <span>{title}</span>
      </>
    )}
  </Container>
  );
}