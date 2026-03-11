import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_800};

  > main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px 40px;

    > section {
      max-width: 980px;
      margin: 0 auto;
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;

    button {
      width: fit-content;
      min-width: 220px;
      margin-top: 0;
      padding: 0 22px;
    }
  }

  .empty {
    margin-top: 28px;
    text-align: center;
    border: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};
    border-radius: 12px;
    background: ${({ theme }) => theme.COLORS.BACKGROUND_900};
    padding: 28px 20px;

    strong {
      color: ${({ theme }) => theme.COLORS.WHITE};
      display: block;
      margin-bottom: 8px;
    }

    p {
      color: ${({ theme }) => theme.COLORS.GRAY_100};
      font-size: 15px;
    }
  }

  @media (max-width: 720px) {
    > main {
      padding: 24px 16px 32px;
    }

    .actions button {
      width: 100%;
    }
  }
`;
