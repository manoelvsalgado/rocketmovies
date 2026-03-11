import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  > main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px 40px;
  }

  .tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  @media (max-width: 720px) {
    > main {
      padding: 24px 16px 32px;
    }
  }

`;

export const Form = styled.form`
  max-width: 980px;
  margin: 0 auto;
  padding: 28px;
  border-radius: 14px;
  background: ${({ theme }) => theme.COLORS.BACKGROUND_900};
  border: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};

  > header {
    display: grid;
    gap: 12px;

    margin-bottom: 36px;

    a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: ${({ theme }) => theme.COLORS.GRAY_100};
      font-size: 15px;
      width: fit-content;
    }

    h1 {
      font-size: clamp(30px, 5vw, 38px);
      font-weight: 500;
    }
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 220px;
    gap: 16px;

    > div {
      margin-bottom: 0;
    }
  }

  @media (max-width: 720px) {
    padding: 20px;

    .row {
      grid-template-columns: 1fr;
    }
  }
`;